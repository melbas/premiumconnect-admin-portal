
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Palette,
  GitBranch,
  Activity,
  Route,
  FileJson,
  Zap,
  Book
} from 'lucide-react';

// Import des nouveaux composants
import { ThemeJsonManager, WorkflowBuilder, ApiMonitoringDashboard, OpenApiDocumentation } from '../AdvancedPortalStudio';
import CustomerJourneyPanel from '../PortalStudio/CustomerJourneyPanel';

const SuperAdminAdvancedPortals: React.FC = () => {
  const [activeTab, setActiveTab] = useState('themes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portails Avancés</h1>
          <p className="text-muted-foreground">
            Système avancé de gestion des thèmes, workflows et parcours client
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          Studio Avancé v2.0
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Thèmes JSON
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Workflow Builder
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            API Monitoring
          </TabsTrigger>
          <TabsTrigger value="openapi" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            OpenAPI
          </TabsTrigger>
          <TabsTrigger value="journeys" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Parcours Client
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-primary" />
                Gestion Avancée des Thèmes JSON
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Importez, exportez et gérez vos thèmes personnalisés au format JSON. 
                Créez des thèmes culturels adaptés au contexte sénégalais avec aperçu en temps réel.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Import/Export JSON</Badge>
                <Badge variant="outline">Validation Automatique</Badge>
                <Badge variant="outline">Aperçu Temps Réel</Badge>
                <Badge variant="outline">Thèmes Culturels</Badge>
              </div>
            </CardContent>
          </Card>
          
          <ThemeJsonManager />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card className="border-2 border-dashed border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-blue-500" />
                Workflow Builder Visuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Créez des workflows visuels avec intégration API REST/GraphQL, 
                logique conditionnelle et monitoring intégré des performances.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Éditeur Visuel</Badge>
                <Badge variant="outline">API REST/GraphQL</Badge>
                <Badge variant="outline">OAuth2 + JWT</Badge>
                <Badge variant="outline">Logique Conditionnelle</Badge>
              </div>
            </CardContent>
          </Card>
          
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="border-2 border-dashed border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Monitoring API Intégré
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Surveillez les performances de vos APIs avec suivi des erreurs, 
                temps de réponse, logs détaillés et système de retry automatique.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Métriques Temps Réel</Badge>
                <Badge variant="outline">Suivi Erreurs</Badge>
                <Badge variant="outline">Retry Automatique</Badge>
                <Badge variant="outline">Logs Structurés</Badge>
              </div>
            </CardContent>
          </Card>
          
          <ApiMonitoringDashboard />
        </TabsContent>

        <TabsContent value="openapi" className="space-y-6">
          <Card className="border-2 border-dashed border-orange-500/20 bg-orange-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-orange-500" />
                Documentation OpenAPI Automatique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Générez automatiquement la documentation de vos APIs, testez les endpoints 
                et générez du code client dans plusieurs langages.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Documentation Auto</Badge>
                <Badge variant="outline">Swagger UI</Badge>
                <Badge variant="outline">Génération Code</Badge>
                <Badge variant="outline">Tests Intégrés</Badge>
              </div>
            </CardContent>
          </Card>
          
          <OpenApiDocumentation />
        </TabsContent>

        <TabsContent value="journeys" className="space-y-6">
          <Card className="border-2 border-dashed border-purple-500/20 bg-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-purple-500" />
                Designer de Parcours Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Concevez des parcours client dynamiques avec intégration API, 
                conditions personnalisées et suivi analytique avancé.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Designer Visuel</Badge>
                <Badge variant="outline">Conditions Dynamiques</Badge>
                <Badge variant="outline">Intégration API</Badge>
                <Badge variant="outline">Analytics Avancées</Badge>
              </div>
            </CardContent>
          </Card>
          
          <CustomerJourneyPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminAdvancedPortals;
