import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  description: string;
  admin_user_id?: string;
  is_resolved: boolean;
  created_at: string;
}

const SecurityAlertsWidget: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    
    // S'abonner aux nouvelles alertes en temps réel
    const subscription = supabase
      .channel('security_alerts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'security_alerts' },
        (payload) => {
          const newAlert = payload.new as any;
          const typedAlert: SecurityAlert = {
            id: newAlert.id,
            alert_type: newAlert.alert_type,
            severity: newAlert.severity as 'info' | 'warning' | 'danger' | 'critical',
            title: newAlert.title,
            description: newAlert.description,
            admin_user_id: newAlert.admin_user_id,
            is_resolved: newAlert.is_resolved,
            created_at: newAlert.created_at
          };
          setAlerts(prev => [typedAlert, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erreur chargement alertes:', error);
        return;
      }

      if (data) {
        const typedAlerts: SecurityAlert[] = data.map(alert => ({
          id: alert.id,
          alert_type: alert.alert_type,
          severity: alert.severity as 'info' | 'warning' | 'danger' | 'critical',
          title: alert.title,
          description: alert.description,
          admin_user_id: alert.admin_user_id || undefined,
          is_resolved: alert.is_resolved,
          created_at: alert.created_at
        }));
        setAlerts(typedAlerts);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({ 
          is_resolved: true, 
          resolved_at: new Date().toISOString(),
          resolved_by: 'current-admin-id' // À récupérer du contexte
        })
        .eq('id', alertId);

      if (error) {
        console.error('Erreur résolution alerte:', error);
        return;
      }

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'danger': return 'bg-red-400';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'danger':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Alertes de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Alertes de Sécurité
          </div>
          <Badge variant="outline">
            {alerts.length} active{alerts.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">Aucune alerte de sécurité active</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAlertsWidget;
