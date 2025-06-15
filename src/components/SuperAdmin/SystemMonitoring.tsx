
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Cpu,
  MemoryStick
} from 'lucide-react';
import { performanceMonitor } from '@/services/monitoring/performanceMonitor';
import { errorHandler } from '@/services/monitoring/errorHandler';

const SystemMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    const updateMetrics = () => {
      const currentMetrics = performanceMonitor.getMetrics();
      const currentErrors = errorHandler.getErrors();
      
      setMetrics(currentMetrics.slice(-10)); // 10 dernières métriques
      setErrors(currentErrors.slice(-5)); // 5 dernières erreurs

      // Déterminer le statut système
      const criticalErrors = currentErrors.filter(e => e.severity === 'critical').length;
      const recentErrors = currentErrors.filter(e => 
        new Date().getTime() - new Date(e.timestamp).getTime() < 300000 // 5 minutes
      ).length;

      if (criticalErrors > 0) {
        setSystemStatus('critical');
      } else if (recentErrors > 3) {
        setSystemStatus('warning');
      } else {
        setSystemStatus('healthy');
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 10000); // Mise à jour toutes les 10s

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const exportLogs = () => {
    const data = {
      metrics: performanceMonitor.getMetrics(),
      errors: errorHandler.getErrors(),
      timestamp: new Date(),
      systemStatus
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut Système</CardTitle>
            {getStatusIcon()}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor()}`}>
              {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dernière vérification: {new Date().toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Métriques</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.length}</div>
            <p className="text-xs text-muted-foreground">
              Métriques collectées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errors.length}</div>
            <p className="text-xs text-muted-foreground">
              Erreurs récentes
            </p>
          </CardContent>
        </Card>
      </div>

      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Erreurs Récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {errors.map((error, index) => (
              <Alert key={index} variant={error.severity === 'critical' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>{error.message}</span>
                    <Badge variant={error.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {error.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(error.timestamp).toLocaleString()}
                  </p>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Métriques de Performance
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length > 0 ? (
            <div className="space-y-2">
              {metrics.slice(-5).map((metric, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-sm">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {metric.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucune métrique disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
