import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, User } from 'lucide-react';
import { realtimeMetricsService, IncidentData } from '@/services/kpi/RealtimeMetricsService';

const IncidentsLiveTable: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await realtimeMetricsService.getActiveIncidents();
        setIncidents(data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getElapsedTime = (startTime: string): string => {
    const elapsed = Date.now() - new Date(startTime).getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Incidents en Cours
          </div>
          <Badge variant={incidents.length === 0 ? 'default' : 'destructive'}>
            {incidents.length} actif{incidents.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucun incident actif</p>
            <p className="text-xs">Tous les systèmes fonctionnent normalement</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">{incident.incident_id}</span>
                    </div>
                    <h4 className="font-medium">{incident.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {incident.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{getElapsedTime(incident.started_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{incident.affected_users_count || 0} utilisateurs</span>
                    </div>
                  </div>
                  {incident.sla_breached && (
                    <Badge variant="destructive" className="text-xs">
                      SLA Violé
                    </Badge>
                  )}
                </div>

                {incident.affected_sites && incident.affected_sites.length > 0 && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Sites affectés: </span>
                    <span>{incident.affected_sites.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentsLiveTable;