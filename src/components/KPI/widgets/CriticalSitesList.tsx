import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, Clock } from 'lucide-react';

interface CriticalSite {
  site_id: string;
  uptime: number;
  incidents: number;
}

interface CriticalSitesListProps {
  sites: CriticalSite[];
}

const CriticalSitesList: React.FC<CriticalSitesListProps> = ({ sites }) => {
  const getSeverityLevel = (uptime: number, incidents: number): 'critical' | 'high' | 'medium' => {
    if (uptime < 95 || incidents >= 3) return 'critical';
    if (uptime < 99 || incidents >= 2) return 'high';
    return 'medium';
  };

  const getSeverityColor = (level: 'critical' | 'high' | 'medium') => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="border-danger/20 bg-danger/5">
      <CardHeader>
        <CardTitle className="flex items-center text-danger">
          <XCircle className="h-5 w-5 mr-2" />
          Sites Critiques - Attention Requise
          <Badge variant="destructive" className="ml-2">
            {sites.length} site{sites.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sites.map((site) => {
            const severity = getSeverityLevel(site.uptime, site.incidents);
            
            return (
              <div key={site.site_id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-danger/20">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{site.site_id}</span>
                      <Badge variant={getSeverityColor(severity)}>
                        {severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Disponibilité: {site.uptime.toFixed(2)}%
                      {site.incidents > 0 && (
                        <span className="ml-2">• {site.incidents} incident{site.incidents > 1 ? 's' : ''} actif{site.incidents > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  <div className="text-danger font-medium">
                    Action requise
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    SLA en risque
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Recommandations:</p>
              <ul className="text-muted-foreground text-xs mt-1 space-y-1">
                <li>• Vérifier la connectivité réseau de ces sites</li>
                <li>• Contacter les équipes sur site si nécessaire</li>
                <li>• Surveiller l'évolution dans les prochaines minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalSitesList;