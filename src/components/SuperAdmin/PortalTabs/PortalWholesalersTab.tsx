
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Settings } from 'lucide-react';

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

interface PortalWholesalersTabProps {
  portals: Portal[];
}

const PortalWholesalersTab: React.FC<PortalWholesalersTabProps> = ({ portals }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion par Grossistes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(portals.map(p => p.wholesaler))).map((wholesaler) => {
              const wholesalerPortals = portals.filter(p => p.wholesaler === wholesaler);
              return (
                <Card key={wholesaler} className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{wholesaler}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wholesalerPortals.map((portal) => (
                        <div key={portal.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{portal.site}</h4>
                            <Badge variant={portal.status === 'active' ? 'default' : 'secondary'}>
                              {portal.status === 'active' ? 'Actif' : 'Brouillon'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Thème: {portal.theme}</p>
                          <div className="flex justify-between text-sm mb-3">
                            <span>{portal.visitors} visiteurs</span>
                            <span>{portal.conversion}% conversion</span>
                          </div>
                          <Button size="sm" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Personnaliser
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalWholesalersTab;
