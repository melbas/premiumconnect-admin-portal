
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  Shield, 
  Zap, 
  Key, 
  Link,
  Building
} from 'lucide-react';
import { SiteNetworkConfig, ConnectionMethod } from './types';

interface ConnectionMethodSelectorProps {
  method: SiteNetworkConfig['method'];
  onMethodChange: (method: SiteNetworkConfig['method']) => void;
}

const ConnectionMethodSelector: React.FC<ConnectionMethodSelectorProps> = ({
  method,
  onMethodChange
}) => {
  const connectionMethods: ConnectionMethod[] = [
    { value: 'direct', label: 'Connexion Directe', icon: Globe, description: 'IP publique ou domaine direct' },
    { value: 'openwisp', label: 'OpenWisp', icon: Building, description: 'Plateforme de gestion réseau centralisée' },
    { value: 'cloudflare_tunnel', label: 'Cloudflare Tunnel', icon: Shield, description: 'Tunnel sécurisé via Cloudflare' },
    { value: 'wireguard', label: 'WireGuard VPN', icon: Zap, description: 'VPN moderne et rapide' },
    { value: 'tailscale', label: 'Tailscale', icon: Link, description: 'Réseau mesh zero-config' },
    { value: 'openvpn', label: 'OpenVPN', icon: Key, description: 'VPN SSL traditionnel' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Méthode de Connexion</CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={method} 
          onValueChange={onMethodChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {connectionMethods.map(method => {
              const Icon = method.icon;
              return (
                <SelectItem key={method.value} value={method.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-xs text-muted-foreground">{method.description}</div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ConnectionMethodSelector;
