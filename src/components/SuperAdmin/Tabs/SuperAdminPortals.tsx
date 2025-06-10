
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { usePortalFeatures } from '@/hooks/usePortalFeatures';
import { 
  Plus, 
  Smartphone,
  Globe,
  Zap,
  Heart,
  Gamepad2,
  Eye,
  Sparkles
} from 'lucide-react';
import PortalConfigurationStudio from '../PortalStudio/PortalConfigurationStudio';
import SuperAdminAdvancedPortals from './SuperAdminAdvancedPortals';
import {
  PortalOverviewTab,
  PortalSitesTab,
  PortalWholesalersTab,
  PortalStudioTab,
  PortalModulesTab,
  PortalAnalyticsTab
} from '../PortalTabs';

const SuperAdminPortals = () => {
  const [activePortalsTab, setActivePortalsTab] = useState('overview');
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
          <PortalOverviewTab
            portals={portals}
            themes={themes}
            modules={modules}
            onDuplicatePortal={handleDuplicatePortal}
            getPerformanceBadge={getPerformanceBadge}
          />
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <PortalSitesTab portals={portals} />
        </TabsContent>

        <TabsContent value="wholesalers" className="space-y-6">
          <PortalWholesalersTab portals={portals} />
        </TabsContent>

        <TabsContent value="studio" className="space-y-6">
          <PortalStudioTab themes={themes} />
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <PortalModulesTab modules={modules} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PortalAnalyticsTab 
            portals={portals} 
            getPerformanceColor={getPerformanceColor} 
          />
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
