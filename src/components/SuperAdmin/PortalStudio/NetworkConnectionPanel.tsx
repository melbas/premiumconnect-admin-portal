
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Globe, 
  Shield, 
  Zap, 
  Key, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Settings,
  Link
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConnectionConfig {
  method: 'direct' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn';
  credentials: {
    tunnelId?: string;
    cloudflareToken?: string;
    privateKey?: string;
    publicKey?: string;
    endpoint?: string;
    tailscaleKey?: string;
    openvpnConfig?: string;
  };
  subdomain?: string;
  dnsConfig?: {
    cloudflareApiKey?: string;
    domain?: string;
    zoneId?: string;
  };
  isActive: boolean;
}

const NetworkConnectionPanel: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ConnectionConfig>({
    method: 'direct',
    credentials: {},
    isActive: false
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const connectionMethods = [
    { value: 'direct', label: 'Connexion Directe', icon: Globe, description: 'IP publique ou domaine direct' },
    { value: 'cloudflare_tunnel', label: 'Cloudflare Tunnel', icon: Shield, description: 'Tunnel sécurisé via Cloudflare' },
    { value: 'wireguard', label: 'WireGuard VPN', icon: Zap, description: 'VPN moderne et rapide' },
    { value: 'tailscale', label: 'Tailscale', icon: Link, description: 'Réseau mesh zero-config' },
    { value: 'openvpn', label: 'OpenVPN', icon: Key, description: 'VPN SSL traditionnel' }
  ];

  const updateCredentials = (key: string, value: string) => {
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
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResult(success);
      
      toast({
        title: success ? "Test réussi" : "Test échoué",
        description: success 
          ? "La connexion fonctionne correctement" 
          : "Vérifiez vos paramètres de connexion",
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      setTestResult(false);
      toast({
        title: "Erreur de test",
        description: "Impossible de tester la connexion",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const renderCredentialFields = () => {
    switch (config.method) {
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
              <Label htmlFor="publicKey">Clé Publique</Label>
              <Input
                id="publicKey"
                value={config.credentials.publicKey || ''}
                onChange={(e) => updateCredentials('publicKey', e.target.value)}
                placeholder="Clé publique du serveur"
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
          <div className="space-y-4">
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
          </div>
        );

      case 'openvpn':
        return (
          <div className="space-y-4">
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
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subdomain">Sous-domaine</Label>
              <Input
                id="subdomain"
                value={config.subdomain || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, subdomain: e.target.value }))}
                placeholder="site1.portal.example.com"
              />
            </div>
          </div>
        );
    }
  };

  const selectedMethod = connectionMethods.find(m => m.value === config.method);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Réseau
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method Selection */}
          <div>
            <Label htmlFor="method">Méthode de Connexion</Label>
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
          </div>

          {/* Method Description */}
          {selectedMethod && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <selectedMethod.icon className="h-4 w-4" />
                <span className="font-medium">{selectedMethod.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedMethod.description}</p>
            </div>
          )}

          {/* Credential Fields */}
          {renderCredentialFields()}

          {/* DNS Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Configuration DNS (Cloudflare)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="domain">Domaine Principal</Label>
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
                  placeholder="Zone ID depuis Cloudflare Dashboard"
                />
              </div>
              <div>
                <Label htmlFor="cloudflareApiKey">Clé API Cloudflare</Label>
                <Input
                  id="cloudflareApiKey"
                  type="password"
                  value={config.dnsConfig?.cloudflareApiKey || ''}
                  onChange={(e) => updateDnsConfig('cloudflareApiKey', e.target.value)}
                  placeholder="Clé API pour gestion DNS"
                />
              </div>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                checked={config.isActive}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isActive: checked }))}
              />
              <Label>Activer cette connexion</Label>
            </div>
            
            <div className="flex items-center gap-2">
              {testResult !== null && (
                <Badge variant={testResult ? "default" : "destructive"}>
                  {testResult ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Connecté</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Échec</>
                  )}
                </Badge>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={testConnection}
                disabled={testing}
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                {testing ? 'Test...' : 'Tester'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkConnectionPanel;
