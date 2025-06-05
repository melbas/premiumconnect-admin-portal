
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Brain, 
  Activity, 
  Wrench, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { supervisionAgent } from '@/services/ai/SupervisionAgent';
import { predictiveMaintenanceAgent } from '@/services/ai/PredictiveMaintenanceAgent';
import { initialSetupAgent } from '@/services/ai/InitialSetupAgent';

interface AIOptimizationDashboardProps {
  selectedSiteId?: string;
  sites: any[];
}

const AIOptimizationDashboard: React.FC<AIOptimizationDashboardProps> = ({ 
  selectedSiteId, 
  sites 
}) => {
  const [activeTab, setActiveTab] = useState('supervision');
  const [supervisionAlerts, setSupervisionAlerts] = useState<any[]>([]);
  const [maintenancePredictions, setMaintenancePredictions] = useState<any[]>([]);
  const [setupRecommendations, setSetupRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentSite = sites.find(site => site.id === selectedSiteId) || sites[0];

  useEffect(() => {
    if (currentSite) {
      loadAIData(currentSite.id);
    }
  }, [currentSite]);

  const loadAIData = async (siteId: string) => {
    setIsLoading(true);
    try {
      // Charger les données des 3 agents IA
      const [alerts, predictions, recommendations] = await Promise.all([
        supervisionAgent.analyzeNetworkHealth(siteId),
        predictiveMaintenanceAgent.generateMaintenancePredictions(siteId),
        initialSetupAgent.generateSetupRecommendations(siteId)
      ]);

      setSupervisionAlerts(alerts);
      setMaintenancePredictions(predictions);
      setSetupRecommendations(recommendations);
    } catch (error) {
      console.error('Erreur chargement données IA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentSite) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Aucun site sélectionné. Veuillez sélectionner un site pour voir les optimisations IA.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Optimisation IA - {currentSite.name}
          </h2>
          <p className="text-muted-foreground">
            Intelligence artificielle contextuelle pour la gestion réseau
          </p>
        </div>
        <Button onClick={() => loadAIData(currentSite.id)} disabled={isLoading}>
          {isLoading ? 'Actualisation...' : 'Actualiser'}
        </Button>
      </div>

      {/* Métriques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertes Actives</p>
                <p className="text-2xl font-bold">{supervisionAlerts.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prédictions Maintenance</p>
                <p className="text-2xl font-bold">{maintenancePredictions.length}</p>
              </div>
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recommandations</p>
                <p className="text-2xl font-bold">{setupRecommendations.length}</p>
              </div>
              <Settings className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score Optimisation</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets des agents IA */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="supervision" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Supervision
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="supervision" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Agent de Supervision
              </CardTitle>
            </CardHeader>
            <CardContent>
              {supervisionAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune alerte active. Réseau en bon état.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supervisionAlerts.map((alert, index) => (
                    <Alert key={alert.id || index} className="border-l-4" style={{ borderLeftColor: getSeverityColor(alert.severity).replace('bg-', '#') }}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        {alert.title}
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      </AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">{alert.description}</p>
                        {alert.culturalContext && (
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Contexte:</strong> {alert.culturalContext}
                          </p>
                        )}
                        <div className="mt-2">
                          <strong>Recommandations:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {alert.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="text-sm">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Agent de Maintenance Prédictive
              </CardTitle>
            </CardHeader>
            <CardContent>
              {maintenancePredictions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune maintenance prédictive nécessaire.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {maintenancePredictions.map((prediction, index) => (
                    <Card key={prediction.equipmentId || index} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{prediction.equipmentName}</h4>
                            <p className="text-sm text-muted-foreground">ID: {prediction.equipmentId}</p>
                          </div>
                          <Badge className={getSeverityColor(prediction.riskLevel)}>{prediction.riskLevel}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                              Prédiction: {prediction.predictedFailureDate?.toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">Confiance: {prediction.confidence}%</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Facteurs saisonniers:</p>
                          <div className="flex flex-wrap gap-1">
                            {prediction.seasonalFactors.map((factor: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">{factor}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Recommandations:</p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {prediction.recommendations.map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-green-600">Préventif: {prediction.costImpact.preventive.toLocaleString()} {prediction.costImpact.currency}</span>
                            <span className="text-red-600 ml-4">Réactif: {prediction.costImpact.reactive.toLocaleString()} {prediction.costImpact.currency}</span>
                          </div>
                          <Button size="sm" onClick={() => predictiveMaintenanceAgent.scheduleMaintenanceTask(currentSite.id, prediction.equipmentId, 'preventive')}>
                            Planifier Maintenance
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Agent de Configuration Initiale
              </CardTitle>
            </CardHeader>
            <CardContent>
              {setupRecommendations.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Configuration optimale atteinte.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {setupRecommendations.map((recommendation, index) => (
                    <Card key={index} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{recommendation.title}</h4>
                            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(recommendation.priority)}>{recommendation.priority}</Badge>
                            <Badge variant="outline">{recommendation.category}</Badge>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Étapes d'implémentation:</p>
                          <ol className="list-decimal list-inside text-sm space-y-1">
                            {recommendation.implementation.map((step: string, i: number) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm">
                            <strong>Impact estimé:</strong> {recommendation.estimatedImpact}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Contexte local:</strong> {recommendation.localContext}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Appliquer
                          </Button>
                          <Button size="sm" variant="outline">
                            Planifier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIOptimizationDashboard;
