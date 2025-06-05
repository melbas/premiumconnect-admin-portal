
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteNetworkConfig } from './types';

interface CredentialFieldsProps {
  method: SiteNetworkConfig['method'];
  credentials: SiteNetworkConfig['credentials'];
  subdomain?: string;
  siteName: string;
  onCredentialChange: (key: string, value: string | any) => void;
  onSubdomainChange: (subdomain: string) => void;
}

const CredentialFields: React.FC<CredentialFieldsProps> = ({
  method,
  credentials,
  subdomain,
  siteName,
  onCredentialChange,
  onSubdomainChange
}) => {
  const renderFields = () => {
    switch (method) {
      case 'openwisp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="baseUrl">URL de l'instance OpenWisp</Label>
              <Input
                id="baseUrl"
                value={credentials.baseUrl || ''}
                onChange={(e) => onCredentialChange('baseUrl', e.target.value)}
                placeholder="https://openwisp.example.com"
              />
            </div>
            <div>
              <Label htmlFor="apiToken">Token API</Label>
              <Input
                id="apiToken"
                type="password"
                value={credentials.apiToken || ''}
                onChange={(e) => onCredentialChange('apiToken', e.target.value)}
                placeholder="Token d'authentification OpenWisp"
              />
            </div>
            <div>
              <Label htmlFor="organization">Organisation (optionnel)</Label>
              <Input
                id="organization"
                value={credentials.organization || ''}
                onChange={(e) => onCredentialChange('organization', e.target.value)}
                placeholder="Nom de l'organisation"
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuration RADIUS (optionnel)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="radiusServer">Serveur RADIUS</Label>
                  <Input
                    id="radiusServer"
                    value={credentials.radiusSettings?.radiusServer || ''}
                    onChange={(e) => onCredentialChange('radiusSettings', {
                      ...credentials.radiusSettings,
                      radiusServer: e.target.value
                    })}
                    placeholder="127.0.0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="radiusSecret">Secret RADIUS</Label>
                  <Input
                    id="radiusSecret"
                    type="password"
                    value={credentials.radiusSettings?.radiusSecret || ''}
                    onChange={(e) => onCredentialChange('radiusSettings', {
                      ...credentials.radiusSettings,
                      radiusSecret: e.target.value
                    })}
                    placeholder="Secret partagé"
                  />
                </div>
                <div>
                  <Label htmlFor="radiusPort">Port RADIUS</Label>
                  <Input
                    id="radiusPort"
                    type="number"
                    value={credentials.radiusSettings?.radiusPort || 1812}
                    onChange={(e) => onCredentialChange('radiusSettings', {
                      ...credentials.radiusSettings,
                      radiusPort: parseInt(e.target.value)
                    })}
                    placeholder="1812"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'cloudflare_tunnel':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tunnelId">Tunnel ID</Label>
              <Input
                id="tunnelId"
                value={credentials.tunnelId || ''}
                onChange={(e) => onCredentialChange('tunnelId', e.target.value)}
                placeholder="UUID du tunnel Cloudflare"
              />
            </div>
            <div>
              <Label htmlFor="cloudflareToken">Token Cloudflare</Label>
              <Input
                id="cloudflareToken"
                type="password"
                value={credentials.cloudflareToken || ''}
                onChange={(e) => onCredentialChange('cloudflareToken', e.target.value)}
                placeholder="Token d'authentification"
              />
            </div>
          </div>
        );

      case 'wireguard':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="privateKey">Clé Privée</Label>
              <Textarea
                id="privateKey"
                value={credentials.privateKey || ''}
                onChange={(e) => onCredentialChange('privateKey', e.target.value)}
                placeholder="Clé privée WireGuard..."
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                value={credentials.endpoint || ''}
                onChange={(e) => onCredentialChange('endpoint', e.target.value)}
                placeholder="server.example.com:51820"
              />
            </div>
          </div>
        );

      case 'tailscale':
        return (
          <div>
            <Label htmlFor="tailscaleKey">Clé d'Authentification</Label>
            <Input
              id="tailscaleKey"
              type="password"
              value={credentials.tailscaleKey || ''}
              onChange={(e) => onCredentialChange('tailscaleKey', e.target.value)}
              placeholder="tskey-auth-..."
            />
          </div>
        );

      case 'openvpn':
        return (
          <div>
            <Label htmlFor="openvpnConfig">Configuration OpenVPN</Label>
            <Textarea
              id="openvpnConfig"
              value={credentials.openvpnConfig || ''}
              onChange={(e) => onCredentialChange('openvpnConfig', e.target.value)}
              placeholder="Collez ici votre fichier .ovpn..."
              className="font-mono text-sm h-32"
            />
          </div>
        );

      default:
        return (
          <div>
            <Label htmlFor="subdomain">Sous-domaine</Label>
            <Input
              id="subdomain"
              value={subdomain || ''}
              onChange={(e) => onSubdomainChange(e.target.value)}
              placeholder={`${siteName.toLowerCase().replace(/\s+/g, '-')}.portal.example.com`}
            />
          </div>
        );
    }
  };

  return <div className="space-y-4">{renderFields()}</div>;
};

export default CredentialFields;
