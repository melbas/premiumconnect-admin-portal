import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Eye, 
  Edit, 
  Copy, 
  Plus, 
  Palette, 
  Layout, 
  Users, 
  Building, 
  BarChart3,
  Wifi,
  Smartphone,
  Globe,
  Zap,
  Heart,
  Gamepad2,
  Wrench
} from 'lucide-react';
import PortalConfigurationStudio from '../PortalStudio/PortalConfigurationStudio';

const SuperAdminPortals = () => {
  const [activePortalsTab, setActivePortalsTab] = useState('overview');

  // Mock data pour les portails
  const portals = [
    {
      id: '1',
      name: 'Portail Dakar Central',
      site: 'Dakar Central',
      wholesaler: 'Fatou Ndiaye',
      theme: 'Teranga',
      status: 'active',
      visitors: 1250,
      conversion: 68,
      modules: ['auth_sms', 'ai_chat', 'mobile_money', 'mini_games']
    },
    {
      id: '2', 
      name: 'Portail Thiès Connect',
      site: 'Thiès Nord',
      wholesaler: 'Moussa Sow',
      theme: 'Dakar Modern',
      status: 'active',
      visitors: 890,
      conversion: 72,
      modules: ['auth_sms', 'ai_chat', 'mobile_money', 'loyalty_program']
    },
    {
      id: '3',
      name: 'Portail Casamance WiFi',
      site: 'Ziguinchor Centre',
      wholesaler: 'Aminata Diallo',
      theme: 'Casamance',
      status: 'draft',
      visitors: 0,
      conversion: 0,
      modules: ['auth_sms', 'ai_chat', 'mobile_money']
    }
  ];

  const themes = [
    { name: 'Teranga', color: '#D97706', description: 'Hospitalité sénégalaise' },
    { name: 'Ndoumbane', color: '#7C2D12', description: 'Traditionnel géométrique' },
    { name: 'Dakar Modern', color: '#1E40AF', description: 'Urbain moderne' },
    { name: 'Casamance', color: '#166534', description: 'Nature et verdure' }
  ];

  const modules = [
    { name: 'auth_sms', display: 'Auth SMS', category: 'mandatory', icon: Smartphone },
    { name: 'ai_chat', display: 'Chat IA', category: 'mandatory', icon: Zap },
    { name: 'mobile_money', display: 'Mobile Money', category: 'mandatory', icon: Smartphone },
    { name: 'mini_games', display: 'Mini-jeux', category: 'optional', icon: Gamepad2 },
    { name: 'loyalty_program', display: 'Fidélité', category: 'optional', icon: Heart },
    { name: 'video_system', display: 'Vidéos', category: 'optional', icon: Eye },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Portails Captifs</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Portail
        </Button>
      </div>

      <Tabs value={activePortalsTab} onValueChange={setActivePortalsTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sites">Par Sites</TabsTrigger>
          <TabsTrigger value="wholesalers">Par Grossistes</TabsTrigger>
          <TabsTrigger value="studio">Studio Design</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="configuration">Configuration Live</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portails Actifs</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 ce mois-ci
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Moyenne</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.5%</div>
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
                <div className="text-2xl font-bold">15,420</div>
                <p className="text-xs text-muted-foreground">
                  +12% cette semaine
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portails Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portals.map((portal) => (
                  <div key={portal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: portal.theme === 'Teranga' ? '#D97706' : portal.theme === 'Dakar Modern' ? '#1E40AF' : '#166534' }}></div>
                      <div>
                        <h4 className="font-medium">{portal.name}</h4>
                        <p className="text-sm text-gray-600">{portal.site} • {portal.wholesaler}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant={portal.status === 'active' ? 'default' : 'secondary'}>
                        {portal.status === 'active' ? 'Actif' : 'Brouillon'}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {portal.visitors} visiteurs • {portal.conversion}% conversion
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="wholesalers" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="studio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Studio de Personnalisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thèmes Culturels Sénégalais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <Card key={theme.name} className="border-2 hover:border-blue-200 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.color }}></div>
                            <h4 className="font-medium">{theme.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{theme.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un Nouveau Thème
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preview en Temps Réel</h3>
                  <Card className="aspect-video bg-gradient-to-br from-orange-100 to-yellow-50 border-2 border-dashed border-orange-300">
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Globe className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                        <h4 className="text-lg font-medium text-orange-800">Preview du Portail</h4>
                        <p className="text-sm text-orange-600">Sélectionnez un thème pour voir l'aperçu</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Modules et Extensions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Modules Obligatoires</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modules.filter(m => m.category === 'mandatory').map((module) => {
                      const IconComponent = module.icon;
                      return (
                        <Card key={module.name} className="border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-6 w-6 text-green-600" />
                              <div>
                                <h4 className="font-medium">{module.display}</h4>
                                <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Modules Optionnels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modules.filter(m => m.category === 'optional').map((module) => {
                      const IconComponent = module.icon;
                      return (
                        <Card key={module.name} className="border-blue-200 bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-6 w-6 text-blue-600" />
                                <div>
                                  <h4 className="font-medium">{module.display}</h4>
                                  <Badge variant="outline" className="text-xs">Optionnel</Badge>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                Configurer
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics par Portail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">Analytics Avancées</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Dashboard détaillé avec métriques de performance par portail
                </p>
                <Button className="mt-4">
                  Voir les Analytics Détaillées
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="h-screen">
          <div className="bg-white rounded-lg border h-full">
            <PortalConfigurationStudio />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminPortals;
