
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Brain } from 'lucide-react';
import { UnifiSite } from '@/services/unifiService';
import SiteNetworkConfiguration from './SiteNetworkConfiguration';
import SiteNetworkStatus from './SiteNetworkStatus';
import SiteAIIndicators from './SiteAIIndicators';
import QuickOptimizationButton from './QuickOptimizationButton';
import { getSiteNetworkConfig, saveSiteNetworkConfig, SiteNetworkConfig } from './siteNetworkUtils';
import { useSiteAIData } from '@/hooks/use-site-ai-data';

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
  const siteIds = filteredSites.map(site => site.id);
  const { aiData, isLoading: isLoadingAI, refreshSiteData } = useSiteAIData(siteIds);

  const handleNetworkConfigSaved = (config: SiteNetworkConfig) => {
    saveSiteNetworkConfig(config);
  };

  const handleOptimizationComplete = (siteId: string) => {
    refreshSiteData(siteId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Liste des Sites - Vue Intelligente
        </CardTitle>
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
                <th>Performance IA</th>
                <th>Réseau</th>
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
                const networkConfig = getSiteNetworkConfig(site.id);
                const siteAI = aiData[site.id];
                
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
                      {siteAI && !isLoadingAI ? (
                        <SiteAIIndicators
                          siteId={site.id}
                          siteName={site.name}
                          optimizationScore={siteAI.optimizationScore}
                          activeAlertsCount={siteAI.activeAlertsCount}
                          lastOptimization={siteAI.lastOptimization}
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground">Chargement IA...</div>
                      )}
                    </td>
                    <td>
                      <SiteNetworkStatus
                        method={networkConfig?.method}
                        status={networkConfig?.status || 'disconnected'}
                        isActive={networkConfig?.isActive || false}
                        lastTested={networkConfig?.lastTested}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <QuickOptimizationButton
                          siteId={site.id}
                          siteName={site.name}
                          onOptimizationComplete={() => handleOptimizationComplete(site.id)}
                        />
                        <SiteNetworkConfiguration
                          siteId={site.id}
                          siteName={site.name}
                          initialConfig={networkConfig || undefined}
                          onConfigSaved={handleNetworkConfigSaved}
                        />
                        <a href="#" className="flex items-center text-primary hover:underline">
                          <ExternalLink size={14} className="mr-1" />
                          <span>Détails</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredSites.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-muted-foreground">
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
  );
};

export default SitesList;
