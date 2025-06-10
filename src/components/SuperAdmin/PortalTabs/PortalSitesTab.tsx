
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Settings, Eye } from 'lucide-react';

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

interface PortalSitesTabProps {
  portals: Portal[];
}

const PortalSitesTab: React.FC<PortalSitesTabProps> = ({ portals }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Gestion par Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portals.map((portal) => (
              <Card key={portal.id} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{portal.site}</CardTitle>
                    <Badge variant="outline">{portal.theme}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">Grossiste: {portal.wholesaler}</p>
                  <div className="flex justify-between text-sm">
                    <span>{portal.visitors} visiteurs</span>
                    <span>{portal.conversion}% conversion</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Gérer
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalSitesTab;
