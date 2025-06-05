
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Search, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { unifiApiService, UnifiSite, UnifiDevice } from '@/services/unifiService';
import { Input } from '@/components/ui/input';
import SiteMetricsCards from './SitesComponents/SiteMetricsCards';
import SitesList from './SitesComponents/SitesList';
import SitesMap from './SitesComponents/SitesMap';
import { useSiteAIData } from '@/hooks/use-site-ai-data';
import {
  getDeviceCountForSite,
  getUptimeForSite,
  getIssuesForSite,
  getUsersForSite,
  getRevenueForSite,
  getStatusForSite,
  getUptimeColorClass
} from './SitesComponents/siteUtils';

const SuperAdminSites: React.FC = () => {
  const [sites, setSites] = useState<UnifiSite[]>([]);
  const [devices, setDevices] = useState<UnifiDevice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('list');
  const { toast } = useToast();

  // Filter sites based on search
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (site.desc && site.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get AI data for managing AI refresh
  const siteIds = filteredSites.map(site => site.id);
  const { refreshAllData } = useSiteAIData(siteIds);

  // Fetch sites data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const sitesData = await unifiApiService.getSites();
      setSites(sitesData);
      
      const devicesData = await unifiApiService.getDevices();
      setDevices(devicesData);
      
      toast({
        title: "Données actualisées",
        description: "Les informations des sites ont été actualisées avec succès",
      });
    } catch (error) {
      console.error('Error fetching sites data:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de récupérer les données des sites. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh AI data
  const handleRefreshAI = () => {
    refreshAllData();
    toast({
      title: "Données IA actualisées",
      description: "Les métriques d'intelligence artificielle ont été mises à jour",
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Create wrapper functions to pass device data to utility functions
  const getDevicesCountWrapper = (siteName: string) => getDeviceCountForSite(siteName, devices);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="dashboard-title">Gestion des Sites</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshAI} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Actualiser IA
          </Button>
          <Button 
            onClick={fetchData} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualisation...' : 'Actualiser'}
          </Button>
        </div>
      </div>
      
      {/* Site Statistics Summary */}
      <SiteMetricsCards
        sites={sites}
        getUsersForSite={getUsersForSite}
        getUptimeForSite={getUptimeForSite}
        getStatusForSite={getStatusForSite}
      />
      
      {/* View switcher tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
          </TabsList>
          
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un site..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="list" className="pt-4">
          {/* Sites Table */}
          <SitesList
            filteredSites={filteredSites}
            isLoading={isLoading}
            searchTerm={searchTerm}
            getUptimeForSite={getUptimeForSite}
            getStatusForSite={getStatusForSite}
            getDeviceCountForSite={getDevicesCountWrapper}
            getIssuesForSite={getIssuesForSite}
            getUsersForSite={getUsersForSite}
            getRevenueForSite={getRevenueForSite}
            getUptimeColorClass={getUptimeColorClass}
          />
        </TabsContent>
        
        <TabsContent value="map" className="pt-4">
          <SitesMap
            sites={sites}
            getStatusForSite={getStatusForSite}
            getUptimeForSite={getUptimeForSite}
            getIssuesForSite={getIssuesForSite}
            getUsersForSite={getUsersForSite}
            getDeviceCountForSite={getDevicesCountWrapper}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminSites;
