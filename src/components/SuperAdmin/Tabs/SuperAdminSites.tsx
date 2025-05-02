
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, RefreshCw, Wifi, Users, Activity, MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { unifiApiService, UnifiSite, UnifiDevice } from '@/services/unifiService';
import { Input } from '@/components/ui/input';

// Define map coordinates for sites
interface SiteCoordinates {
  [key: string]: { lat: number; lng: number };
}

const siteCoordinates: SiteCoordinates = {
  'Dakar Central': { lat: 14.7167, lng: -17.4677 },
  'Thiès Ouest': { lat: 14.7833, lng: -16.9667 },
  'Saint-Louis Port': { lat: 16.0377, lng: -16.5083 },
  'Touba Résidentiel': { lat: 14.8667, lng: -15.8833 },
  'Ziguinchor Centre': { lat: 12.5667, lng: -16.2667 },
};

const SuperAdminSites: React.FC = () => {
  const [sites, setSites] = useState<UnifiSite[]>([]);
  const [devices, setDevices] = useState<UnifiDevice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('list');
  const { toast } = useToast();

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

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Get devices count for a site
  const getDeviceCountForSite = (siteName: string) => {
    // In a real app, we would match by siteId, but for demo we'll match by name
    return devices.filter(device => {
      // Map the device to a site based on name prefix (this is just for demo)
      const devicePrefix = device.name?.split('-')[0];
      if (devicePrefix === 'AP' && siteName.includes('Dakar')) return true;
      if (devicePrefix === 'SW' && siteName.includes('Dakar')) return true;
      if (siteName.includes('Thiès') && device.name?.includes('Thies')) return true;
      if (siteName.includes('Saint-Louis') && device.name?.includes('StLouis')) return true;
      if (siteName.includes('Touba') && device.name?.includes('Touba')) return true;
      if (siteName.includes('Ziguinchor') && device.name?.includes('Ziguinchor')) return true;
      return false;
    }).length;
  };

  // Get uptime percentage for a site
  const getUptimeForSite = (siteName: string) => {
    // For demo purposes, generate a realistic uptime value
    const base = siteName.includes('Thiès') ? 92 : 98; // Thiès site has issues
    return base + (Math.random() * 2);
  };

  // Get issues count for a site
  const getIssuesForSite = (siteName: string) => {
    // For demo purposes
    if (siteName.includes('Thiès')) return 2;
    if (siteName.includes('Ziguinchor')) return 1;
    return 0;
  };

  // Get users count for a site
  const getUsersForSite = (siteName: string) => {
    // For demo purposes, generate user counts
    if (siteName.includes('Dakar')) return 450 + Math.floor(Math.random() * 50);
    if (siteName.includes('Thiès')) return 280 + Math.floor(Math.random() * 30);
    if (siteName.includes('Saint-Louis')) return 175 + Math.floor(Math.random() * 25);
    if (siteName.includes('Touba')) return 320 + Math.floor(Math.random() * 40);
    if (siteName.includes('Ziguinchor')) return 140 + Math.floor(Math.random() * 20);
    return 100 + Math.floor(Math.random() * 50);
  };

  // Get revenue for a site
  const getRevenueForSite = (siteName: string) => {
    // For demo purposes, generate revenue based on user count
    const users = getUsersForSite(siteName);
    // Average revenue per user: 2000-4000 FCFA
    const avgRevenuePerUser = 2000 + Math.floor(Math.random() * 2000);
    return users * avgRevenuePerUser;
  };

  // Get status for a site
  const getStatusForSite = (siteName: string) => {
    // For demo purposes, Thiès site is offline
    return siteName.includes('Thiès') ? 'offline' : 'active';
  };

  // Helper function to determine color class based on uptime percentage
  const getUptimeColorClass = (uptime: number): string => {
    if (uptime >= 99) return 'bg-success';
    if (uptime >= 95) return 'bg-warning';
    return 'bg-danger';
  };

  // Calculate total users across all sites
  const totalUsers = sites.reduce((total, site) => {
    return total + getUsersForSite(site.name);
  }, 0);

  // Calculate average uptime across all sites
  const averageUptime = sites.length > 0 
    ? sites.reduce((total, site) => total + getUptimeForSite(site.name), 0) / sites.length
    : 0;

  // Filter sites based on search
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (site.desc && site.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle site selection
  const handleSiteSelect = (siteName: string) => {
    setSelectedSite(siteName === selectedSite ? null : siteName);
  };

  // Render map visualization
  const renderMap = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carte des Sites</CardTitle>
          <CardDescription>Visualisation géographique des sites du réseau</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[600px] bg-gray-200 rounded-md overflow-hidden border border-border">
            {/* Map container */}
            <div className="absolute inset-0 bg-[url('https://i.imgur.com/YIeZOF8.png')] bg-cover bg-center">
              {/* Site markers */}
              {sites.map((site) => {
                const coordinates = siteCoordinates[site.name];
                const status = getStatusForSite(site.name);
                const uptime = getUptimeForSite(site.name);
                const issues = getIssuesForSite(site.name);
                
                if (!coordinates) return null;
                
                // Convert geo coordinates to relative positions within the container
                const left = ((coordinates.lng + 20) / 40) * 100; // Normalize to 0-100%
                const top = (1 - ((coordinates.lat + 20) / 40)) * 100; // Normalize and invert
                
                return (
                  <div 
                    key={site.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                      selectedSite === site.name ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                    }`}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    onClick={() => handleSiteSelect(site.name)}
                  >
                    <div className={`flex flex-col items-center`}>
                      <div className={`h-5 w-5 rounded-full ${
                        status === 'active' 
                          ? 'bg-success animate-pulse' 
                          : 'bg-danger'
                      } shadow-lg flex items-center justify-center border-2 border-white`}>
                        {issues > 0 && (
                          <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {issues}
                          </span>
                        )}
                      </div>
                      <div className={`mt-1 px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                        selectedSite === site.name 
                          ? 'bg-primary text-white' 
                          : 'bg-background text-primary'
                      }`}>
                        {site.name}
                      </div>
                    </div>
                    
                    {/* Site details popup */}
                    {selectedSite === site.name && (
                      <div className="absolute top-7 left-0 min-w-[250px] p-3 bg-background border border-border rounded-md shadow-lg z-30">
                        <h4 className="font-bold">{site.name}</h4>
                        <p className="text-xs text-muted-foreground">{site.desc || "Site standard"}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">État:</span>
                            <span 
                              className={`ml-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium
                                ${status === 'active' 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-danger/20 text-danger'
                                }`}
                            >
                              {status === 'active' ? 'Actif' : 'Hors ligne'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Clients:</span>
                            <span className="ml-1 font-medium">{getUsersForSite(site.name)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Appareils:</span>
                            <span className="ml-1 font-medium">{getDeviceCountForSite(site.name)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Uptime:</span>
                            <span className="ml-1 font-medium">{uptime.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            <ExternalLink size={12} className="mr-1" />
                            Voir Détails
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Map controls */}
            <div className="absolute bottom-4 right-4 bg-background p-2 rounded-md shadow-lg border border-border">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span>+</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span>−</span>
                </Button>
              </div>
            </div>
            
            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-background p-2 rounded-md shadow-lg border border-border">
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-success mr-2"></div>
                  <span>Site actif</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-danger mr-2"></div>
                  <span>Site hors ligne</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-danger relative mr-2">
                    <span className="absolute -top-1 -right-1 bg-danger text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center">
                      !
                    </span>
                  </div>
                  <span>Site avec incidents</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="dashboard-title">Gestion des Sites</h1>
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
      
      {/* Site Statistics Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Total des Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sites.length}</div>
            <p className="text-sm text-muted-foreground">
              {sites.filter(site => getStatusForSite(site.name) === 'active').length} sites actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Utilisateurs Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalUsers.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Sur tous les sites
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Performance Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {averageUptime.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              Disponibilité réseau moyenne
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Emplacements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              5
            </div>
            <p className="text-sm text-muted-foreground">
              Régions couvertes
            </p>
          </CardContent>
        </Card>
      </div>
      
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
          <Card>
            <CardHeader>
              <CardTitle>Liste des Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Nom du Site</th>
                      <th>Description</th>
                      <th>Appareils</th>
                      <th>Utilisateurs</th>
                      <th>Revenu Mensuel</th>
                      <th>Disponibilité</th>
                      <th>Problèmes</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSites.map((site) => {
                      const uptime = getUptimeForSite(site.name);
                      const status = getStatusForSite(site.name);
                      const deviceCount = getDeviceCountForSite(site.name);
                      const issues = getIssuesForSite(site.name);
                      const users = getUsersForSite(site.name);
                      const revenue = getRevenueForSite(site.name);
                      
                      return (
                        <tr key={site.id}>
                          <td className="font-medium">{site.name}</td>
                          <td>{site.desc || "Site standard"}</td>
                          <td>{deviceCount}</td>
                          <td>{users.toLocaleString()}</td>
                          <td>{revenue.toLocaleString()} FCFA</td>
                          <td>
                            <div className="flex items-center">
                              <div className="mr-2 h-2.5 w-full max-w-24 rounded-full bg-muted">
                                <div 
                                  className={`h-full rounded-full ${getUptimeColorClass(uptime)}`} 
                                  style={{ width: `${uptime}%` }}
                                ></div>
                              </div>
                              <span>{uptime.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td>{issues > 0 ? (
                            <span className="inline-flex items-center rounded-full bg-danger/20 px-2.5 py-0.5 text-xs font-medium text-danger">
                              {issues}
                            </span>
                          ) : '0'}</td>
                          <td>
                            <span 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                ${status === 'active' 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-danger/20 text-danger'
                                }`}
                            >
                              {status === 'active' ? 'Actif' : 'Hors ligne'}
                            </span>
                          </td>
                          <td>
                            <a href="#" className="flex items-center text-primary hover:underline">
                              <ExternalLink size={14} className="mr-1" />
                              <span>Détails</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredSites.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center py-4 text-muted-foreground">
                          {isLoading ? 'Chargement des sites...' : (
                            searchTerm ? 'Aucun site ne correspond à votre recherche' : 'Aucun site trouvé'
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="pt-4">
          {renderMap()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminSites;
