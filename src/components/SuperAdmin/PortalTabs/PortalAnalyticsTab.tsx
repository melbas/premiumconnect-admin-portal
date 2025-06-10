
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

interface Portal {
  id: string;
  name: string;
  site: string;
  wholesaler: string;
  theme: string;
  status: 'active' | 'draft';
  visitors: number;
  conversion: number;
  revenue: number;
  modules: string[];
  lastUpdated: string;
  performance: string;
  location: { lat: number; lng: number };
}

interface PortalAnalyticsTabProps {
  portals: Portal[];
  getPerformanceColor: (performance: string) => string;
}

const PortalAnalyticsTab: React.FC<PortalAnalyticsTabProps> = ({ 
  portals, 
  getPerformanceColor 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics par Portail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portals.map((portal) => (
              <Card key={portal.id} className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{portal.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Visiteurs</span>
                      <div className="font-semibold">{portal.visitors.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conversion</span>
                      <div className="font-semibold">{portal.conversion}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenus</span>
                      <div className="font-semibold">{(portal.revenue / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Performance</span>
                      <div className={`font-semibold ${getPerformanceColor(portal.performance)}`}>
                        {portal.performance === 'excellent' ? 'Excellent' :
                         portal.performance === 'good' ? 'Bon' :
                         portal.performance === 'average' ? 'Moyen' :
                         portal.performance === 'poor' ? 'Faible' : 'En attente'}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Voir détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalAnalyticsTab;
