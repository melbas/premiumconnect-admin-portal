
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { SiteNetworkConfig } from './types';

interface NetworkStatusProps {
  config: SiteNetworkConfig;
  onActiveChange: (active: boolean) => void;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ config, onActiveChange }) => {
  const getStatusBadge = () => {
    switch (config.status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connecté</Badge>;
      case 'testing':
        return <Badge variant="secondary">Test en cours...</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Erreur</Badge>;
      default:
        return <Badge variant="outline">Non configuré</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium">Statut:</span>
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.isActive}
              onCheckedChange={onActiveChange}
            />
            <Label>Actif</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkStatus;
