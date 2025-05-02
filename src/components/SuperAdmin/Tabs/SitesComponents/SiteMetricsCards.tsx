
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Users, Activity, MapPin } from 'lucide-react';
import { UnifiSite } from '@/services/unifiService';

interface SiteMetricsCardsProps {
  sites: UnifiSite[];
  getUsersForSite: (siteName: string) => number;
  getUptimeForSite: (siteName: string) => number;
  getStatusForSite: (siteName: string) => string;
}

const SiteMetricsCards: React.FC<SiteMetricsCardsProps> = ({
  sites,
  getUsersForSite,
  getUptimeForSite,
  getStatusForSite
}) => {
  // Calculate total users across all sites
  const totalUsers = sites.reduce((total, site) => {
    return total + getUsersForSite(site.name);
  }, 0);

  // Calculate average uptime across all sites
  const averageUptime = sites.length > 0 
    ? sites.reduce((total, site) => total + getUptimeForSite(site.name), 0) / sites.length
    : 0;

  return (
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
  );
};

export default SiteMetricsCards;
