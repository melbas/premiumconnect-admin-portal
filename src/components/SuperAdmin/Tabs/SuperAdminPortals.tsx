import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { usePortalFeatures } from '@/hooks/usePortalFeatures';
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
  Wrench,
  Sparkles,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import PortalConfigurationStudio from '../PortalStudio/PortalConfigurationStudio';
import SuperAdminAdvancedPortals from './SuperAdminAdvancedPortals';

const SuperAdminPortals = () => {
  const [activePortalsTab, setActivePortalsTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const [isCreatingPortal, setIsCreatingPortal] = useState(false);
  const { features, toggleFeature } = usePortalFeatures();
  const { toast } = useToast();

  // Mock data pour les portails avec plus de détails
  const portals = [
    {
      id: '1',
      name: 'Portail Dakar Central',
      site: 'Dakar Central',
      wholesaler: 'Fatou Ndiaye',
      theme: 'Teranga',
      status: 'active' as const,
      visitors: 1250,
      conversion: 68,
      revenue: 245000,
      modules: ['auth_sms', 'ai_chat', 'mobile_money', 'mini_games'],
      lastUpdated: '2024-01-15T10:30:00Z',
      performance: 'excellent',
      location: { lat: 14.7167, lng: -17.4677 }
    },
    {
      id: '2', 
      name: 'Portail Thiès Connect',
      site: 'Thiès Nord',
      wholesaler: 'Moussa Sow',
      theme: 'Dakar Modern',
      status: 'active' as const,
      visitors: 890,
      conversion: 72,
      revenue: 189000,
      modules: ['auth_sms', 'ai_chat', 'mobile_money', 'loyalty_program'],
      lastUpdated: '2024-01-14T15:45:00Z',
      performance: 'good',
      location: { lat: 14.7886, lng: -16.9246 }
    },
    {
      id: '3',
      name: 'Portail Casamance WiFi',
      site: 'Ziguinchor Centre',
      wholesaler: 'Aminata Diallo',
      theme: 'Casamance Nature',
      status: 'draft' as const,
      visitors: 0,
      conversion: 0,
      revenue: 0,
      modules: ['auth_sms', 'ai_chat', 'mobile_money'],
      lastUpdated: '2024-01-13T09:15:00Z',
      performance: 'pending',
      location: { lat: 12.5681, lng: -16.2719 }
    }
  ];

  const filteredPortals = portals.filter(portal =>
    portal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portal.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portal.wholesaler.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const themes = [
    { name: 'Teranga', color: '#D97706', description: 'Hospitalité sénégalaise' },
    { name: 'Dakar Modern', color: '#1E40AF', description: 'Urbain moderne' },
    { name: 'Casamance Nature', color: '#166534', description: 'Nature et verdure' },
    { name: 'Business Pro', color: '#1F2937', description: 'Professionnel sobre' }
  ];

  const modules = [
    { name: 'auth_sms', display: 'Auth SMS', category: 'mandatory', icon: Smartphone, enabled: true },
    { name: 'ai_chat', display: 'Chat IA', category: 'mandatory', icon: Zap, enabled: true },
    { name: 'mobile_money', display: 'Mobile Money', category: 'mandatory', icon: Smartphone, enabled: true },
    { name: 'mini_games', display: 'Mini-jeux', category: 'optional', icon: Gamepad2, enabled: true },
    { name: 'loyalty_program', display: 'Fidélité', category: 'optional', icon: Heart, enabled: true },
    { name: 'video_system', display: 'Vidéos', category: 'optional', icon: Eye, enabled: false },
  ];

  const handleCreatePortal = async () => {
    setIsCreatingPortal(true);
    
    try {
      // Simulation de création
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Portail créé",
        description: "Le nouveau portail a été créé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur de création",
        description: "Impossible de créer le portail",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPortal(false);
    }
  };

  const handleDuplicatePortal = async (portalId: string) => {
    const portal = portals.find(p => p.id === portalId);
    if (!portal) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Portail dupliqué",
        description: `Le portail "${portal.name}" a été dupliqué`,
      });
    } catch (error) {
      toast({
        title: "Erreur de duplication",
        description: "Impossible de dupliquer le portail",
        variant: "destructive",
      });
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent': return <Badge className="bg-green-500">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-500">Bon</Badge>;
      case 'average': return <Badge className="bg-yellow-500">Moyen</Badge>;
      case 'poor': return <Badge className="bg-red-500">Faible</Badge>;
      default: return <Badge variant="secondary">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Portails Captifs</h1>
          <p className="text-muted-foreground">
            Gérez et surveillez tous vos portails captifs en temps réel
          </p>
        </div>
        <Button onClick={handleCreatePortal} disabled={isCreatingPortal} className="flex items-center gap-2">
          {isCreatingPortal ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Nouveau Portail
        </Button>
      </div>

      <Tabs value={activePortalsTab} onValueChange={setActivePortalsTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sites">Par Sites</TabsTrigger>
          <TabsTrigger value="wholesalers">Par Grossistes</TabsTrigger>
          <TabsTrigger value="studio">Studio Design</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="configuration">Configuration Live</TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Avancé
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                            <Button size="sm" variant="outline" onClick={() => handleDuplicatePortal(portal.id)}>
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
                Gestion des Modules
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-6 w-6 text-green-600" />
                                <div>
                                  <h4 className="font-medium">{module.display}</h4>
                                  <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                                </div>
                              </div>
                              <Badge variant="default" className="bg-green-500">Actif</Badge>
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
                              <div className="flex items-center gap-2">
                                <Badge variant={module.enabled ? 'default' : 'secondary'}>
                                  {module.enabled ? 'Actif' : 'Inactif'}
                                </Badge>
                                <Button size="sm" variant="outline">
                                  Configurer
                                </Button>
                              </div>
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
        </TabsContent>

        <TabsContent value="configuration" className="h-screen">
          <div className="bg-white rounded-lg border h-full">
            <PortalConfigurationStudio />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="h-screen">
          <div className="bg-white rounded-lg border h-full">
            <SuperAdminAdvancedPortals />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminPortals;
