
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { UnifiSite } from '@/services/unifiService';

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
  return (
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
  );
};

export default SitesList;
