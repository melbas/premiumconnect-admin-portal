
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TestTube, Router } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  NetworkStatus,
  ConnectionMethodSelector,
  CredentialFields,
  DNSConfiguration,
  SiteNetworkConfig
} from './NetworkConfiguration';

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
          <NetworkStatus 
            config={config}
            onActiveChange={(checked) => setConfig(prev => ({ ...prev, isActive: checked }))}
          />

          <ConnectionMethodSelector
            method={config.method}
            onMethodChange={(method) => setConfig(prev => ({ ...prev, method }))}
          />

          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <CredentialFields
                method={config.method}
                credentials={config.credentials}
                subdomain={config.subdomain}
                siteName={siteName}
                onCredentialChange={updateCredentials}
                onSubdomainChange={(subdomain) => setConfig(prev => ({ ...prev, subdomain }))}
              />
            </CardContent>
          </Card>

          <DNSConfiguration
            dnsConfig={config.dnsConfig}
            onDnsConfigChange={updateDnsConfig}
          />

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
