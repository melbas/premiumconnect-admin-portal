
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { UnifiSite } from '@/services/unifiService';

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

interface SitesMapProps {
  sites: UnifiSite[];
  getStatusForSite: (siteName: string) => string;
  getUptimeForSite: (siteName: string) => number;
  getIssuesForSite: (siteName: string) => number;
  getUsersForSite: (siteName: string) => number;
  getDeviceCountForSite: (siteName: string) => number;
}

const SitesMap: React.FC<SitesMapProps> = ({
  sites,
  getStatusForSite,
  getUptimeForSite,
  getIssuesForSite,
  getUsersForSite,
  getDeviceCountForSite
}) => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  // Handle site selection
  const handleSiteSelect = (siteName: string) => {
    setSelectedSite(siteName === selectedSite ? null : siteName);
  };

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

export default SitesMap;
