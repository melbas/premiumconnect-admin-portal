import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Globe, 
  Shield, 
  Zap, 
  Key, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Settings,
  Link,
  Router,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SiteNetworkConfig {
  siteId: string;
  siteName: string;
  method: 'direct' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn' | 'openwisp';
  credentials: {
    tunnelId?: string;
    cloudflareToken?: string;
    privateKey?: string;
    publicKey?: string;
    endpoint?: string;
    tailscaleKey?: string;
    openvpnConfig?: string;
    // OpenWisp specific credentials
    baseUrl?: string;
    apiToken?: string;
    organization?: string;
    radiusSettings?: {
      radiusServer?: string;
      radiusSecret?: string;
      radiusPort?: number;
    };
  };
  subdomain?: string;
  dnsConfig?: {
    cloudflareApiKey?: string;
    domain?: string;
    zoneId?: string;
  };
  isActive: boolean;
  lastTested?: Date;
  status: 'connected' | 'disconnected' | 'testing' | 'error';
}

interface SiteNetworkConfigurationProps {
  siteId: string;
  siteName: string;
  initialConfig?: Partial<SiteNetworkConfig>;
  onConfigSaved: (config: SiteNetworkConfig) => void;
}

const SiteNetworkConfiguration: React.FC<SiteNetworkConfigurationProps> = ({
  siteId,
  siteName,
  initialConfig,
  onConfigSaved
}) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SiteNetworkConfig>({
    siteId,
    siteName,
    method: 'direct',
    credentials: {},
    isActive: false,
    status: 'disconnected',
    ...initialConfig
  });
  const [testing, setTesting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const connectionMethods = [
    { value: 'direct', label: 'Connexion Directe', icon: Globe, description: 'IP publique ou domaine direct' },
    { value: 'openwisp', label: 'OpenWisp', icon: Building, description: 'Plateforme de gestion réseau centralisée' },
    { value: 'cloudflare_tunnel', label: 'Cloudflare Tunnel', icon: Shield, description: 'Tunnel sécurisé via Cloudflare' },
    { value: 'wireguard', label: 'WireGuard VPN', icon: Zap, description: 'VPN moderne et rapide' },
    { value: 'tailscale', label: 'Tailscale', icon: Link, description: 'Réseau mesh zero-config' },
    { value: 'openvpn', label: 'OpenVPN', icon: Key, description: 'VPN SSL traditionnel' }
  ];

  const updateCredentials = (key: string, value: string | any) => {
    setConfig(prev => ({
      ...prev,
      credentials: { ...prev.credentials, [key]: value }
    }));
  };

  const updateDnsConfig = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      dnsConfig: { ...prev.dnsConfig, [key]: value }
    }));
  };

  const testConnection = async () => {
    setTesting(true);
    setConfig(prev => ({ ...prev, status: 'testing' }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const success = Math.random() > 0.3;
      
      setConfig(prev => ({
        ...prev,
        status: success ? 'connected' : 'error',
        lastTested: new Date()
      }));
      
      toast({
        title: success ? "Test réussi" : "Test échoué",
        description: success 
          ? `Connexion établie pour ${siteName}` 
          : "Vérifiez vos paramètres de connexion",
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      setConfig(prev => ({ ...prev, status: 'error' }));
      toast({
        title: "Erreur de test",
        description: "Impossible de tester la connexion",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const saveConfiguration = () => {
    onConfigSaved(config);
    setIsOpen(false);
    toast({
      title: "Configuration sauvegardée",
      description: `Configuration réseau mise à jour pour ${siteName}`
    });
  };

  const renderCredentialFields = () => {
    switch (config.method) {
      case 'openwisp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="baseUrl">URL de l'instance OpenWisp</Label>
              <Input
                id="baseUrl"
                value={config.credentials.baseUrl || ''}
                onChange={(e) => updateCredentials('baseUrl', e.target.value)}
                placeholder="https://openwisp.example.com"
              />
            </div>
            <div>
              <Label htmlFor="apiToken">Token API</Label>
              <Input
                id="apiToken"
                type="password"
                value={config.credentials.apiToken || ''}
                onChange={(e) => updateCredentials('apiToken', e.target.value)}
                placeholder="Token d'authentification OpenWisp"
              />
            </div>
            <div>
              <Label htmlFor="organization">Organisation (optionnel)</Label>
              <Input
                id="organization"
                value={config.credentials.organization || ''}
                onChange={(e) => updateCredentials('organization', e.target.value)}
                placeholder="Nom de l'organisation"
              />
            </div>
            
            {/* RADIUS Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuration RADIUS (optionnel)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="radiusServer">Serveur RADIUS</Label>
                  <Input
                    id="radiusServer"
                    value={config.credentials.radiusSettings?.radiusServer || ''}
                    onChange={(e) => updateCredentials('radiusSettings', {
                      ...config.credentials.radiusSettings,
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
                    value={config.credentials.radiusSettings?.radiusSecret || ''}
                    onChange={(e) => updateCredentials('radiusSettings', {
                      ...config.credentials.radiusSettings,
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
                    value={config.credentials.radiusSettings?.radiusPort || 1812}
                    onChange={(e) => updateCredentials('radiusSettings', {
                      ...config.credentials.radiusSettings,
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
                value={config.credentials.tunnelId || ''}
                onChange={(e) => updateCredentials('tunnelId', e.target.value)}
                placeholder="UUID du tunnel Cloudflare"
              />
            </div>
            <div>
              <Label htmlFor="cloudflareToken">Token Cloudflare</Label>
              <Input
                id="cloudflareToken"
                type="password"
                value={config.credentials.cloudflareToken || ''}
                onChange={(e) => updateCredentials('cloudflareToken', e.target.value)}
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
                value={config.credentials.privateKey || ''}
                onChange={(e) => updateCredentials('privateKey', e.target.value)}
                placeholder="Clé privée WireGuard..."
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                value={config.credentials.endpoint || ''}
                onChange={(e) => updateCredentials('endpoint', e.target.value)}
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
              value={config.credentials.tailscaleKey || ''}
              onChange={(e) => updateCredentials('tailscaleKey', e.target.value)}
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
              value={config.credentials.openvpnConfig || ''}
              onChange={(e) => updateCredentials('openvpnConfig', e.target.value)}
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
              value={config.subdomain || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, subdomain: e.target.value }))}
              placeholder={`${siteName.toLowerCase().replace(/\s+/g, '-')}.portal.example.com`}
            />
          </div>
        );
    }
  };

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Router className="h-4 w-4" />
          Réseau
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Router className="h-5 w-5" />
            Configuration Réseau - {siteName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
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
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label>Actif</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Method */}
          <Card>
            <CardHeader>
              <CardTitle>Méthode de Connexion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select 
                value={config.method} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, method: value }))}
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

              {renderCredentialFields()}
            </CardContent>
          </Card>

          {/* DNS Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration DNS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="domain">Domaine</Label>
                  <Input
                    id="domain"
                    value={config.dnsConfig?.domain || ''}
                    onChange={(e) => updateDnsConfig('domain', e.target.value)}
                    placeholder="example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="zoneId">Zone ID Cloudflare</Label>
                  <Input
                    id="zoneId"
                    value={config.dnsConfig?.zoneId || ''}
                    onChange={(e) => updateDnsConfig('zoneId', e.target.value)}
                    placeholder="Zone ID"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={testing}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {testing ? 'Test...' : 'Tester'}
            </Button>
            <Button onClick={saveConfiguration} className="flex-1">
              Sauvegarder Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiteNetworkConfiguration;
