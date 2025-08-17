import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ChevronRight } from 'lucide-react';
import { realtimeMetricsService, AuthFunnelMetrics } from '@/services/kpi/RealtimeMetricsService';

const AuthFunnelWidget: React.FC = () => {
  const [funnelData, setFunnelData] = useState<AuthFunnelMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await realtimeMetricsService.getAuthFunnelMetrics(1);
        setFunnelData(data);
      } catch (error) {
        console.error('Error fetching auth funnel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const stages = ['captive', 'dhcp', 'dns', 'radius', 'internet'];
  const stageLabels = {
    captive: 'Portail Captif',
    dhcp: 'Attribution DHCP',
    dns: 'Résolution DNS', 
    radius: 'Auth RADIUS',
    internet: 'Accès Internet'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Funnel d'Authentification
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : (
          <div className="space-y-3">
            {stages.map((stage, index) => {
              const stageMetrics = funnelData.filter(m => m.stage === stage);
              const totalSuccess = stageMetrics.reduce((sum, m) => sum + m.success_count, 0);
              const totalAttempts = stageMetrics.reduce((sum, m) => sum + m.total_attempts, 0);
              const successRate = totalAttempts > 0 ? (totalSuccess / totalAttempts) * 100 : 0;
              
              return (
                <div key={stage} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{stageLabels[stage as keyof typeof stageLabels]}</span>
                      <Badge variant={successRate >= 95 ? 'default' : successRate >= 80 ? 'secondary' : 'destructive'}>
                        {successRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          successRate >= 95 ? 'bg-success' : 
                          successRate >= 80 ? 'bg-warning' : 'bg-danger'
                        }`}
                        style={{ width: `${Math.max(successRate, 5)}%` }}
                      />
                    </div>
                  </div>
                  {index < stages.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthFunnelWidget;