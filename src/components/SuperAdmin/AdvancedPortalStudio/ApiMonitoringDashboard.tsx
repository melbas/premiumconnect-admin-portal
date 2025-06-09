
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WorkflowService } from '@/services/workflowService';
import { ApiCall, ApiMetrics } from '@/types/workflow';
import { ResponsiveTable, ResponsiveTableRow, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/responsive-table';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Trash2,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react';

const ApiMonitoringDashboard: React.FC = () => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setApiCalls(WorkflowService.getApiCalls());
    setMetrics(WorkflowService.getApiMetrics());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadData();
      setRefreshing(false);
    }, 1000);
  };

  const handleClearLogs = () => {
    WorkflowService.clearApiCallsLog();
    loadData();
  };

  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusBadge = (status: number, error?: string) => {
    if (error) {
      return <Badge variant="destructive">Erreur</Badge>;
    }
    if (status >= 200 && status < 300) {
      return <Badge variant="default">Succès</Badge>;
    }
    if (status >= 400) {
      return <Badge variant="destructive">Échec</Badge>;
    }
    return <Badge variant="secondary">En cours</Badge>;
  };

  const formatResponseTime = (time: number): string => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Monitoring API</h3>
          <p className="text-sm text-muted-foreground">
            Suivi en temps réel des appels API et performances
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleClearLogs}
            disabled={apiCalls.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Vider les logs
          </Button>
        </div>
      </div>

      {/* Métriques globales */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requêtes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                Dernières 24h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Succès</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
              <Progress value={metrics.successRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatResponseTime(metrics.averageResponseTime)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {metrics.averageResponseTime < 1000 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                Performance
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'Erreur</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}%</div>
              {metrics.lastError && (
                <p className="text-xs text-red-600 mt-1">
                  Dernière erreur: {new Date(metrics.lastError.timestamp).toLocaleTimeString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tableau des appels API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Historique des Appels API
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiCalls.length > 0 ? (
            <ResponsiveTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Horodatage</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Temps</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiCalls.slice(0, 50).map((call) => (
                  <ResponsiveTableRow 
                    key={call.id}
                    mobileLayout={
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{call.method}</Badge>
                          {getStatusBadge(call.status, call.error)}
                        </div>
                        <div className="text-sm font-mono break-all">{call.url}</div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{new Date(call.timestamp).toLocaleString()}</span>
                          <span>{formatResponseTime(call.responseTime)}</span>
                        </div>
                        {call.error && (
                          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            {call.error}
                          </div>
                        )}
                      </div>
                    }
                  >
                    <TableCell className="text-xs">
                      {new Date(call.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{call.method}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate font-mono text-xs">
                      {call.url}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={getStatusColor(call.status)}>
                          {call.status || '0'}
                        </span>
                        {getStatusBadge(call.status, call.error)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatResponseTime(call.responseTime)}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        Détails
                      </Button>
                    </TableCell>
                  </ResponsiveTableRow>
                ))}
              </TableBody>
            </ResponsiveTable>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Aucun appel API</h3>
              <p className="text-sm text-muted-foreground">
                Les appels API apparaîtront ici une fois les workflows exécutés
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiMonitoringDashboard;
