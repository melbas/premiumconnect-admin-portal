
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { sites } from '../../mockData';

// Site Status component
const SiteStatus: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut des Sites</CardTitle>
        <CardDescription>Les 5 premiers sites par nombre d'utilisateurs</CardDescription>
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
              </tr>
            </thead>
            <tbody>
              {sites.slice(0, 5).map((site) => (
                <tr key={site.id}>
                  <td className="font-medium">{site.name}</td>
                  <td>{site.location}</td>
                  <td>{site.users?.toLocaleString()}</td>
                  <td>{site.revenue?.toLocaleString()} FCFA</td>
                  <td>{site.uptime}%</td>
                  <td>{site.issues}</td>
                  <td>
                    <span 
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${site.status === 'active' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-danger/20 text-danger'
                      }`}
                    >
                      {site.status === 'active' ? 'Actif' : 'Hors ligne'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteStatus;
