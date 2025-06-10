
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Wifi, 
  BarChart3, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  MoreHorizontal 
} from 'lucide-react';

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

interface Theme {
  name: string;
  color: string;
  description: string;
}

interface Module {
  name: string;
  display: string;
  category: string;
  icon: any;
  enabled: boolean;
}

interface PortalOverviewTabProps {
  portals: Portal[];
  themes: Theme[];
  modules: Module[];
  onDuplicatePortal: (portalId: string) => Promise<void>;
  getPerformanceBadge: (performance: string) => React.ReactNode;
}

const PortalOverviewTab: React.FC<PortalOverviewTabProps> = ({
  portals,
  themes,
  modules,
  onDuplicatePortal,
  getPerformanceBadge
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);

  const filteredPortals = portals.filter(portal =>
    portal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portal.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portal.wholesaler.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portails Actifs</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portals.filter(p => p.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              +{portals.filter(p => p.status === 'draft').length} en préparation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Moyenne</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(portals.reduce((sum, p) => sum + p.conversion, 0) / portals.filter(p => p.status === 'active').length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +5.2% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visiteurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portals.reduce((sum, p) => sum + p.visitors, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(portals.reduce((sum, p) => sum + p.revenue, 0) / 1000).toFixed(0)}K FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              +8.1% ce mois-ci
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Portails</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un portail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPortals.map((portal) => (
              <Card key={portal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: themes.find(t => t.name === portal.theme)?.color || '#3B82F6' 
                        }}
                      />
                      <div>
                        <h4 className="font-medium">{portal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {portal.site} • {portal.wholesaler}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <Badge variant={portal.status === 'active' ? 'default' : 'secondary'}>
                          {portal.status === 'active' ? 'Actif' : 'Brouillon'}
                        </Badge>
                        {getPerformanceBadge(portal.performance)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground text-right">
                        <div>{portal.visitors.toLocaleString()} visiteurs</div>
                        <div>{portal.conversion}% conversion</div>
                        <div>{(portal.revenue / 1000).toFixed(0)}K FCFA</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedPortal(portal.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onDuplicatePortal(portal.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    {portal.modules.slice(0, 3).map((module) => {
                      const moduleInfo = modules.find(m => m.name === module);
                      return (
                        <Badge key={module} variant="outline" className="text-xs">
                          {moduleInfo?.display || module}
                        </Badge>
                      );
                    })}
                    {portal.modules.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{portal.modules.length - 3} autres
                      </Badge>
                    )}
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

export default PortalOverviewTab;
