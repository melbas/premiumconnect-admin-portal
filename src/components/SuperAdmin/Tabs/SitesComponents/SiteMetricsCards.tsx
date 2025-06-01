
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, TrendingUp, Activity } from 'lucide-react';
import { UnifiSite } from '@/services/unifiService';
import NetworkMetricsCard from './NetworkMetricsCard';

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
  const totalSites = sites.length;
  const activeSites = sites.filter(site => getStatusForSite(site.name) === 'active').length;
  const totalUsers = sites.reduce((sum, site) => sum + getUsersForSite(site.name), 0);
  const averageUptime = sites.length > 0 
    ? sites.reduce((sum, site) => sum + getUptimeForSite(site.name), 0) / sites.length
    : 0;

  const metricsCards = [
    {
      title: "Total des Sites",
      value: totalSites.toString(),
      icon: MapPin,
      description: `${activeSites} sites actifs`
    },
    {
      title: "Utilisateurs Totaux",
      value: totalUsers.toLocaleString(),
      icon: Users,
      description: "Utilisateurs connectés"
    },
    {
      title: "Disponibilité Moyenne",
      value: `${averageUptime.toFixed(1)}%`,
      icon: Activity,
      description: "Uptime moyen"
    },
    {
      title: "Performance",
      value: activeSites > 0 ? "Excellente" : "Critique",
      icon: TrendingUp,
      description: `${Math.round((activeSites / totalSites) * 100)}% opérationnels`
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metricsCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Network Metrics Card */}
      <NetworkMetricsCard />
    </div>
  );
};

export default SiteMetricsCards;
