import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SiteAvailability {
  site_id: string;
  uptime_percentage: number;
  downtime_minutes: number;
  sla_breached: boolean;
  incident_count: number;
  timestamp: string;
}

const UptimeGlobalWidget: React.FC = () => {
  const [siteData, setSiteData] = useState<SiteAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalUptime, setGlobalUptime] = useState<number>(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get latest site availability metrics
        const { data: sites, error } = await supabase
          .from('site_availability_metrics')
          .select('*')
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24h
          .order('timestamp', { ascending: false });

        if (error) throw error;

        // Group by site_id and get the latest entry for each
        const latestBySite = (sites || []).reduce((acc: Record<string, SiteAvailability>, site) => {
          if (!acc[site.site_id] || new Date(site.timestamp) > new Date(acc[site.site_id].timestamp)) {
            acc[site.site_id] = site as SiteAvailability;
          }
          return acc;
        }, {});

        const siteDataArray = Object.values(latestBySite);
        setSiteData(siteDataArray);

        // Calculate global uptime
        if (siteDataArray.length > 0) {
          const avgUptime = siteDataArray.reduce((sum, site) => sum + site.uptime_percentage, 0) / siteDataArray.length;
          setGlobalUptime(avgUptime);
        }
      } catch (error) {
        console.error('Error fetching uptime data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getSLAStatus = (uptime: number): { color: string; icon: React.ReactNode; label: string } => {
    if (uptime >= 99.9) {
      return {
        color: 'text-success',
        icon: <CheckCircle className="h-4 w-4 text-success" />,
        label: 'SLA Respecté'
      };
    } else if (uptime >= 99.5) {
      return {
        color: 'text-warning',
        icon: <AlertTriangle className="h-4 w-4 text-warning" />,
        label: 'SLA Dégradé'
      };
    } else {
      return {
        color: 'text-danger',
        icon: <XCircle className="h-4 w-4 text-danger" />,
        label: 'SLA Violé'
      };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wifi className="h-5 w-5 mr-2" />
            Disponibilité par Site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Wifi className="h-5 w-5 mr-2" />
            Disponibilité par Site
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {siteData.length} sites surveillés
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Uptime Global</span>
            <span className="text-lg font-bold">{globalUptime.toFixed(2)}%</span>
          </div>
          <Progress 
            value={globalUptime} 
            className="h-2"
            // @ts-ignore - Progress component accepts these props
            color={globalUptime >= 99.9 ? 'success' : globalUptime >= 99.5 ? 'warning' : 'danger'}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>SLA Target: 99.9%</span>
            <span>{getSLAStatus(globalUptime).label}</span>
          </div>
        </div>

        {/* Individual Sites */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Détail par Site</h4>
          
          {siteData.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Wifi className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucune donnée de disponibilité disponible</p>
              <p className="text-xs">Les métriques apparaîtront dès que les premiers relevés seront effectués</p>
            </div>
          ) : (
            <div className="space-y-3">
              {siteData
                .sort((a, b) => a.uptime_percentage - b.uptime_percentage) // Worst first
                .slice(0, 8) // Show top 8
                .map((site) => {
                  const status = getSLAStatus(site.uptime_percentage);
                  
                  return (
                    <div key={site.site_id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {status.icon}
                          <span className="text-sm font-medium">{site.site_id}</span>
                          {site.incident_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {site.incident_count} incident{site.incident_count > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold ${status.color}`}>
                            {site.uptime_percentage.toFixed(2)}%
                          </span>
                          {site.downtime_minutes > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {site.downtime_minutes}min d'arrêt
                            </div>
                          )}
                        </div>
                      </div>
                      <Progress 
                        value={site.uptime_percentage} 
                        className="h-1.5"
                        // @ts-ignore
                        color={site.uptime_percentage >= 99.9 ? 'success' : site.uptime_percentage >= 99.5 ? 'warning' : 'danger'}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-success" />
                <span>≥99.9%</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-warning" />
                <span>99.5-99.9%</span>
              </div>
              <div className="flex items-center space-x-1">
                <XCircle className="h-3 w-3 text-danger" />
                <span>&lt;99.5%</span>
              </div>
            </div>
            <span>Mis à jour toutes les minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UptimeGlobalWidget;