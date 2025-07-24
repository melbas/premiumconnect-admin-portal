import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsentManager, PrivacyPolicy, DataRightsManager } from '@/components/GDPR';
import { Shield, Lock, Eye, AlertTriangle, Users, Cookie } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

const SuperAdminSecurity: React.FC = () => {
  const { toast } = useToast();
  const [consentOpen, setConsentOpen] = useState(false);
  const [securityMetrics] = useState({
    threatLevel: 'medium' as ThreatLevel,
    activeThreats: 3,
    blockedRequests: 247,
    protectedUsers: 156
  });

  const handleConsentUpdate = (settings: any) => {
    toast({
      title: "Configuration RGPD mise à jour",
      description: "Les préférences de confidentialité ont été sauvegardées.",
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sécurité & RGPD</h2>
          <p className="text-muted-foreground">Gestion de la sécurité réseau et conformité RGPD</p>
        </div>
        <Badge variant={securityMetrics.threatLevel === 'high' ? 'destructive' : 'secondary'}>
          Niveau de menace: {securityMetrics.threatLevel}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="gdpr">RGPD</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Menaces actives</p>
                    <p className="text-2xl font-bold">{securityMetrics.activeThreats}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Requêtes bloquées</p>
                    <p className="text-2xl font-bold">{securityMetrics.blockedRequests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Utilisateurs protégés</p>
                    <p className="text-2xl font-bold">{securityMetrics.protectedUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Conformité RGPD</p>
                    <p className="text-sm font-bold text-green-600">✓ Conforme</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gdpr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Gestion RGPD
              </CardTitle>
              <CardDescription>
                Outils de conformité et gestion des données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => setConsentOpen(true)}
                  variant="outline" 
                  className="h-20 flex-col"
                >
                  <Cookie className="h-6 w-6 mb-2" />
                  Gestionnaire de consentement
                </Button>
                
                <PrivacyPolicy 
                  trigger={
                    <Button variant="outline" className="h-20 flex-col">
                      <Eye className="h-6 w-6 mb-2" />
                      Politique de confidentialité
                    </Button>
                  }
                />
                
                <DataRightsManager 
                  trigger={
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      Droits des utilisateurs
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services de sécurité actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Détection de fraude</span>
                  <Badge variant="default">Actif</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Filtrage URL</span>
                  <Badge variant="default">Actif</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Protection ARP</span>
                  <Badge variant="default">Actif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConsentManager 
        open={consentOpen}
        onOpenChange={setConsentOpen}
        onConsentUpdate={handleConsentUpdate}
      />
    </div>
  );
};

export default SuperAdminSecurity;