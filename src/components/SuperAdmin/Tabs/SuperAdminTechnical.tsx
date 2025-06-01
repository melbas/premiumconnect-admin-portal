
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wifi,
  Server,
  Database,
  Settings,
  Globe,
  Shield,
  Activity,
  Palette
} from 'lucide-react';
import { NetworkConfigPanel, ServerMonitoring } from './TechnicalComponents';
import { PortalConfigurationStudio } from '../PortalStudio';

interface SuperAdminTechnicalProps {
  initialView?: 'network' | 'server' | 'database' | 'captive-portal';
}

const SuperAdminTechnical: React.FC<SuperAdminTechnicalProps> = ({ 
  initialView = 'network' 
}) => {
  const [activeView, setActiveView] = useState(initialView);

  if (activeView === 'captive-portal') {
    return <PortalConfigurationStudio />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configuration Technique</h2>
          <p className="text-muted-foreground">
            Gestion des systèmes, réseaux et infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'captive-portal' ? 'default' : 'outline'}
            onClick={() => setActiveView('captive-portal')}
            className="flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Studio Portail
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Réseau
          </TabsTrigger>
          <TabsTrigger value="server" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Serveurs
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de données
          </TabsTrigger>
          <TabsTrigger value="captive-portal" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Portail Captif
          </TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="mt-6">
          <NetworkConfigPanel />
        </TabsContent>

        <TabsContent value="server" className="mt-6">
          <ServerMonitoring />
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  État de la Base de Données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-muted-foreground">Disponibilité</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">2.1GB</div>
                    <div className="text-sm text-muted-foreground">Taille DB</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">15ms</div>
                    <div className="text-sm text-muted-foreground">Latence</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration Supabase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Row Level Security (RLS)</span>
                    <Badge variant="default">Activé</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Réplication temps réel</span>
                    <Badge variant="default">Activé</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sauvegarde automatique</span>
                    <Badge variant="default">Quotidienne</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="captive-portal" className="mt-6">
          {/* This will be handled by the activeView check above */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminTechnical;
