
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Brain } from 'lucide-react';
import { UnifiSite } from '@/services/unifiService';
import { ResponsiveTable, ResponsiveTableRow, TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/responsive-table';
import { SkeletonTable } from '@/components/ui/loading-states';
import { AnimatedButton } from '@/components/ui/animated-button';
import SiteNetworkConfiguration from './SiteNetworkConfiguration';
import SiteNetworkStatus from './SiteNetworkStatus';
import SiteAIIndicators from './SiteAIIndicators';
import QuickOptimizationButton from './QuickOptimizationButton';
import { getSiteNetworkConfig, saveSiteNetworkConfig, SiteNetworkConfig } from './siteNetworkUtils';
import { useSiteAIData } from '@/hooks/use-site-ai-data';
import { useIsMobile } from '@/hooks/use-mobile';

interface SitesListProps {
  filteredSites: UnifiSite[];
  isLoading: boolean;
  searchTerm: string;
  getUptimeForSite: (siteName: string) => number;
  getStatusForSite: (siteName: string) => string;
  getDeviceCountForSite: (siteName: string) => number;
  getIssuesForSite: (siteName: string) => number;
  getUsersForSite: (siteName: string) => number;
  getRevenueForSite: (siteName: string) => number;
  getUptimeColorClass: (uptime: number) => string;
}

const SitesList: React.FC<SitesListProps> = ({
  filteredSites,
  isLoading,
  searchTerm,
  getUptimeForSite,
  getStatusForSite,
  getDeviceCountForSite,
  getIssuesForSite,
  getUsersForSite,
  getRevenueForSite,
  getUptimeColorClass
}) => {
  const isMobile = useIsMobile();
  
  // Mémoriser les IDs des sites pour éviter les re-calculs
  const siteIds = useMemo(() => filteredSites.map(site => site.id), [filteredSites]);
  
  const { aiData, isLoading: isLoadingAI, refreshSiteData } = useSiteAIData(siteIds);

  const handleNetworkConfigSaved = (config: SiteNetworkConfig) => {
    saveSiteNetworkConfig(config);
  };

  const handleOptimizationComplete = (siteId: string) => {
    refreshSiteData(siteId);
  };

  // Mémoriser les données calculées pour chaque site
  const sitesData = useMemo(() => {
    return filteredSites.map((site, index) => ({
      site,
      uptime: getUptimeForSite(site.name),
      status: getStatusForSite(site.name),
      deviceCount: getDeviceCountForSite(site.name),
      issues: getIssuesForSite(site.name),
      users: getUsersForSite(site.name),
      revenue: getRevenueForSite(site.name),
      networkConfig: getSiteNetworkConfig(site.id),
      siteAI: aiData[site.id],
      animationDelay: index * 100
    }));
  }, [filteredSites, aiData, getUptimeForSite, getStatusForSite, getDeviceCountForSite, getIssuesForSite, getUsersForSite, getRevenueForSite]);

  const MobileSiteCard = ({ siteData }: { siteData: any }) => (
    <div className="space-y-4 p-4 border rounded-lg bg-card animate-fade-in" style={{ animationDelay: `${siteData.animationDelay}ms` }}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{siteData.site.name}</h3>
          <p className="text-sm text-muted-foreground">{siteData.site.desc || "Site standard"}</p>
        </div>
        <span 
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${siteData.status === 'active' 
              ? 'bg-success/20 text-success' 
              : 'bg-danger/20 text-danger'
            }`}
        >
          {siteData.status === 'active' ? 'Actif' : 'Hors ligne'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Appareils:</span>
          <p className="font-medium">{siteData.deviceCount}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Utilisateurs:</span>
          <p className="font-medium">{siteData.users.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Revenu:</span>
          <p className="font-medium">{siteData.revenue.toLocaleString()} FCFA</p>
        </div>
        <div>
          <span className="text-muted-foreground">Problèmes:</span>
          <p className="font-medium">{siteData.issues}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Disponibilité:</span>
          <span className="text-sm font-medium">{siteData.uptime.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getUptimeColorClass(siteData.uptime)}`} 
            style={{ width: `${siteData.uptime}%` }}
          ></div>
        </div>
      </div>
      
      {siteData.siteAI && !isLoadingAI && (
        <SiteAIIndicators
          siteId={siteData.site.id}
          siteName={siteData.site.name}
          optimizationScore={siteData.siteAI.optimizationScore}
          activeAlertsCount={siteData.siteAI.activeAlertsCount}
          lastOptimization={siteData.siteAI.lastOptimization}
        />
      )}
      
      <div className="flex flex-wrap gap-2">
        <QuickOptimizationButton
          siteId={siteData.site.id}
          siteName={siteData.site.name}
          onOptimizationComplete={() => handleOptimizationComplete(siteData.site.id)}
        />
        <SiteNetworkConfiguration
          siteId={siteData.site.id}
          siteName={siteData.site.name}
          initialConfig={siteData.networkConfig || undefined}
          onConfigSaved={handleNetworkConfigSaved}
        />
        <AnimatedButton variant="outline" size="sm">
          <ExternalLink size={14} className="mr-1" />
          Détails
        </AnimatedButton>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Liste des Sites - Vue Intelligente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonTable rows={5} columns={11} />
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Liste des Sites - Vue Intelligente
            </CardTitle>
          </CardHeader>
        </Card>
        
        {sitesData.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Aucun site ne correspond à votre recherche' : 'Aucun site trouvé'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sitesData.map((siteData) => (
              <MobileSiteCard key={siteData.site.id} siteData={siteData} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <ResponsiveTable 
      title="Liste des Sites - Vue Intelligente"
      className="animate-fade-in"
    >
      <TableHeader>
        <tr>
          <TableHead>Nom du Site</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Appareils</TableHead>
          <TableHead>Utilisateurs</TableHead>
          <TableHead>Revenu Mensuel</TableHead>
          <TableHead>Disponibilité</TableHead>
          <TableHead>Problèmes</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Performance IA</TableHead>
          <TableHead>Réseau</TableHead>
          <TableHead>Actions</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {sitesData.map((siteData) => (
          <ResponsiveTableRow 
            key={siteData.site.id}
            className="animate-fade-in hover:bg-muted/50 transition-colors duration-200"
            style={{ animationDelay: `${siteData.animationDelay}ms` }}
          >
            <TableCell className="font-medium">{siteData.site.name}</TableCell>
            <TableCell>{siteData.site.desc || "Site standard"}</TableCell>
            <TableCell>{siteData.deviceCount}</TableCell>
            <TableCell>{siteData.users.toLocaleString()}</TableCell>
            <TableCell>{siteData.revenue.toLocaleString()} FCFA</TableCell>
            <TableCell>
              <div className="flex items-center">
                <div className="mr-2 h-2.5 w-full max-w-24 rounded-full bg-muted">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getUptimeColorClass(siteData.uptime)}`} 
                    style={{ width: `${siteData.uptime}%` }}
                  ></div>
                </div>
                <span>{siteData.uptime.toFixed(1)}%</span>
              </div>
            </TableCell>
            <TableCell>{siteData.issues > 0 ? (
              <span className="inline-flex items-center rounded-full bg-danger/20 px-2.5 py-0.5 text-xs font-medium text-danger animate-pulse">
                {siteData.issues}
              </span>
            ) : '0'}</TableCell>
            <TableCell>
              <span 
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200
                  ${siteData.status === 'active' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-danger/20 text-danger'
                  }`}
              >
                {siteData.status === 'active' ? 'Actif' : 'Hors ligne'}
              </span>
            </TableCell>
            <TableCell>
              {siteData.siteAI && !isLoadingAI ? (
                <SiteAIIndicators
                  siteId={siteData.site.id}
                  siteName={siteData.site.name}
                  optimizationScore={siteData.siteAI.optimizationScore}
                  activeAlertsCount={siteData.siteAI.activeAlertsCount}
                  lastOptimization={siteData.siteAI.lastOptimization}
                />
              ) : (
                <div className="text-xs text-muted-foreground">Chargement IA...</div>
              )}
            </TableCell>
            <TableCell>
              <SiteNetworkStatus
                method={siteData.networkConfig?.method}
                status={siteData.networkConfig?.status || 'disconnected'}
                isActive={siteData.networkConfig?.isActive || false}
                lastTested={siteData.networkConfig?.lastTested}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <QuickOptimizationButton
                  siteId={siteData.site.id}
                  siteName={siteData.site.name}
                  onOptimizationComplete={() => handleOptimizationComplete(siteData.site.id)}
                />
                <SiteNetworkConfiguration
                  siteId={siteData.site.id}
                  siteName={siteData.site.name}
                  initialConfig={siteData.networkConfig || undefined}
                  onConfigSaved={handleNetworkConfigSaved}
                />
                <AnimatedButton variant="outline" size="sm" className="hover:scale-105">
                  <ExternalLink size={14} className="mr-1" />
                  <span>Détails</span>
                </AnimatedButton>
              </div>
            </TableCell>
          </ResponsiveTableRow>
        ))}
        {sitesData.length === 0 && (
          <tr>
            <TableCell colSpan={11} className="text-center py-8 text-muted-foreground animate-fade-in">
              {searchTerm ? 'Aucun site ne correspond à votre recherche' : 'Aucun site trouvé'}
            </TableCell>
          </tr>
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

export default SitesList;
