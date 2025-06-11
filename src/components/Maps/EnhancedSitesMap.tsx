
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Wifi, Users, Zap } from 'lucide-react';
import { useMapContext } from './MapProvider';
import { getMapStyle, getSiteCoordinates } from './mapUtils';
import { UnifiSite } from '@/services/unifiService';

// Fix pour les icônes de marqueurs Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EnhancedSitesMapProps {
  sites: UnifiSite[];
  getStatusForSite: (siteName: string) => string;
  getUptimeForSite: (siteName: string) => number;
  getIssuesForSite: (siteName: string) => number;
  getUsersForSite: (siteName: string) => number;
  getDeviceCountForSite: (siteName: string) => number;
}

const EnhancedSitesMap: React.FC<EnhancedSitesMapProps> = ({
  sites,
  getStatusForSite,
  getUptimeForSite,
  getIssuesForSite,
  getUsersForSite,
  getDeviceCountForSite
}) => {
  const { defaultCenter, defaultZoom, isDarkMode } = useMapContext();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  // Créer des icônes personnalisées basées sur le statut
  const createCustomIcon = (status: string, issues: number) => {
    const color = status === 'active' ? '#10B981' : '#EF4444';
    const size = issues > 0 ? 30 : 25;
    
    return L.divIcon({
      html: `
        <div style="
          background: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          position: relative;
        ">
          ${issues > 0 ? '!' : '✓'}
          ${issues > 0 ? `<span style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #EF4444;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            border: 2px solid white;
          ">${issues}</span>` : ''}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carte Interactive des Sites</CardTitle>
        <CardDescription>
          Visualisation en temps réel avec OpenStreetMap
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full rounded-md overflow-hidden border">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url={getMapStyle(isDarkMode)}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {sites.map((site) => {
              const coordinates = getSiteCoordinates(site.name);
              if (!coordinates) return null;
              
              const status = getStatusForSite(site.name);
              const uptime = getUptimeForSite(site.name);
              const issues = getIssuesForSite(site.name);
              const users = getUsersForSite(site.name);
              const devices = getDeviceCountForSite(site.name);
              
              return (
                <Marker
                  key={site.id}
                  position={[coordinates.lat, coordinates.lng]}
                  icon={createCustomIcon(status, issues)}
                  eventHandlers={{
                    click: () => setSelectedSite(site.name === selectedSite ? null : site.name)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h4 className="font-bold text-lg mb-2">{site.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {site.desc || "Site de réseau WiFi"}
                      </p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">État:</span>
                          <Badge variant={status === 'active' ? 'default' : 'destructive'}>
                            {status === 'active' ? 'Actif' : 'Hors ligne'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Utilisateurs:
                          </span>
                          <span className="font-medium">{users}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Wifi className="h-3 w-3 mr-1" />
                            Appareils:
                          </span>
                          <span className="font-medium">{devices}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            Uptime:
                          </span>
                          <span className="font-medium">{uptime.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Voir Détails
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        
        {/* Légende */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Site actif</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Site hors ligne</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 relative mr-2">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                !
              </span>
            </div>
            <span>Site avec incidents</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSitesMap;
