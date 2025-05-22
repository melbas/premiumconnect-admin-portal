
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { networkConfigurations } from '../../mockData';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

const NetworkConfigPanel = () => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active':
        return <Wifi className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error':
      default:
        return <WifiOff className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Actif</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Avertissement</Badge>;
      case 'error':
      default:
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Erreur</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Réseau</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Site</th>
                <th className="p-3 text-right">Bande Passante</th>
                <th className="p-3 text-right">Appareils</th>
                <th className="p-3 text-center">Statut</th>
                <th className="p-3 text-right">Dernière Mise à Jour</th>
              </tr>
            </thead>
            <tbody>
              {networkConfigurations.map(config => (
                <tr key={config.id} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-medium">{config.name}</td>
                  <td className="p-3 text-right">{config.bandwidth} Mbps</td>
                  <td className="p-3 text-right">{config.devices}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(config.status)}
                      {getStatusBadge(config.status)}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {new Date(config.lastUpdate).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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

export default NetworkConfigPanel;
