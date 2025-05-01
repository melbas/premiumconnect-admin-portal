
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sites, Site } from '../mockData';
import { ExternalLink } from 'lucide-react';

const SuperAdminSites: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="dashboard-title">Gestion des Sites</h1>
      
      {/* Site Statistics Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total des Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sites.length}</div>
            <p className="text-sm text-muted-foreground">
              {sites.filter(site => site.status === 'active').length} sites actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Utilisateurs Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {sites.reduce((total, site) => total + site.users, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Sur tous les sites
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(sites.reduce((total, site) => total + site.uptime, 0) / sites.length).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              Disponibilité réseau moyenne
            </p>
          </CardContent>
        </Card>
      </div>
      
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
                  <th>Emplacement</th>
                  <th>Utilisateurs</th>
                  <th>Revenu Mensuel</th>
                  <th>Disponibilité</th>
                  <th>Problèmes</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id}>
                    <td className="font-medium">{site.name}</td>
                    <td>{site.location}</td>
                    <td>{site.users.toLocaleString()}</td>
                    <td>{site.revenue.toLocaleString()} FCFA</td>
                    <td>
                      <div className="flex items-center">
                        <div className="mr-2 h-2.5 w-full max-w-24 rounded-full bg-muted">
                          <div 
                            className={`h-full rounded-full ${getUptimeColorClass(site.uptime)}`} 
                            style={{ width: `${site.uptime}%` }}
                          ></div>
                        </div>
                        <span>{site.uptime}%</span>
                      </div>
                    </td>
                    <td>{site.issues > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-danger/20 px-2.5 py-0.5 text-xs font-medium text-danger">
                        {site.issues}
                      </span>
                    ) : '0'}</td>
                    <td>
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${site.status === 'active' 
                            ? 'bg-success/20 text-success' 
                            : site.status === 'maintenance'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-danger/20 text-danger'
                          }`}
                      >
                        {site.status === 'active' ? 'Actif' : 
                          site.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                      </span>
                    </td>
                    <td>
                      <a href="#" className="flex items-center text-primary hover:underline">
                        <ExternalLink size={14} className="mr-1" />
                        <span>Détails</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to determine color class based on uptime percentage
const getUptimeColorClass = (uptime: number): string => {
  if (uptime >= 99) return 'bg-success';
  if (uptime >= 95) return 'bg-warning';
  return 'bg-danger';
};

export default SuperAdminSites;
