
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Users, Zap, RefreshCw, AlertTriangle } from 'lucide-react';
import { useTensorFlowBehavior } from '@/hooks/use-tensorflow-behavior';
import { UserBehaviorData } from '@/services/ai/tensorflowBehaviorService';

const TensorFlowBehaviorDashboard: React.FC = () => {
  const {
    prediction,
    segment,
    isLoading,
    error,
    isInitialized,
    analyzeBehavior,
    getRecommendations,
    getModelMetrics
  } = useTensorFlowBehavior();

  const [mockUserData, setMockUserData] = useState<UserBehaviorData>({
    sessionDuration: 1800, // 30 minutes
    pagesVisited: 5,
    clickCount: 24,
    scrollDepth: 85,
    timeOnPage: 180,
    deviceType: 'mobile',
    connectionTime: new Date().toISOString(),
    previousSessions: 3,
    gameInteractions: 2,
    chatInteractions: 1
  });

  const [modelMetrics, setModelMetrics] = useState<any>(null);

  const simulateUserBehavior = () => {
    const variations = [
      {
        sessionDuration: Math.random() * 3600 + 600, // 10min to 1h
        pagesVisited: Math.floor(Math.random() * 10) + 1,
        clickCount: Math.floor(Math.random() * 50) + 5,
        scrollDepth: Math.random() * 100,
        timeOnPage: Math.random() * 300 + 30,
        deviceType: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)] as any,
        connectionTime: new Date().toISOString(),
        previousSessions: Math.floor(Math.random() * 10),
        gameInteractions: Math.floor(Math.random() * 20),
        chatInteractions: Math.floor(Math.random() * 15)
      }
    ];

    const randomData = variations[0];
    setMockUserData(randomData);
    analyzeBehavior(randomData);
  };

  const loadModelMetrics = async () => {
    const metrics = await getModelMetrics();
    setModelMetrics(metrics);
  };

  useEffect(() => {
    if (isInitialized) {
      analyzeBehavior(mockUserData);
      loadModelMetrics();
    }
  }, [isInitialized]);

  const recommendations = getRecommendations();

  const getSegmentColor = (segmentType: string) => {
    switch (segmentType) {
      case 'premium_candidate': return 'bg-green-500';
      case 'engaged': return 'bg-blue-500';
      case 'at_risk': return 'bg-red-500';
      case 'casual': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'offer_premium': return 'text-green-600';
      case 'suggest_game': return 'text-blue-600';
      case 'extend_session': return 'text-orange-600';
      case 'no_action': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  if (!isInitialized && isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
            <h3 className="text-lg font-medium">Initialisation TensorFlow.js...</h3>
            <p className="text-sm text-gray-600 mt-2">Chargement des modèles d'IA comportementale</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h3 className="text-lg font-medium text-red-800">Erreur TensorFlow.js</h3>
            <p className="text-sm text-red-600 mt-2">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Analyse Comportementale IA</h2>
            <p className="text-sm text-gray-600">Powered by TensorFlow.js</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={simulateUserBehavior} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Simuler Utilisateur
          </Button>
          <Button variant="outline" onClick={loadModelMetrics}>
            Métriques Modèles
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Modèles IA</p>
                <p className="text-2xl font-bold">{isInitialized ? '3' : '0'}</p>
                <p className="text-xs text-green-600">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Prédictions</p>
                <p className="text-2xl font-bold">{prediction ? '✓' : '—'}</p>
                <p className="text-xs text-blue-600">En temps réel</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Segment</p>
                <p className="text-2xl font-bold">{segment?.segment || '—'}</p>
                <p className="text-xs text-purple-600">Identifié</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Confiance</p>
                <p className="text-2xl font-bold">
                  {prediction ? `${Math.round(prediction.confidence * 100)}%` : '—'}
                </p>
                <p className="text-xs text-orange-600">Précision</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prédictions Comportementales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prediction ? (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Risque de Départ</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(prediction.churnProbability * 100)}%
                    </span>
                  </div>
                  <Progress value={prediction.churnProbability * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Probabilité d'Achat</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(prediction.purchaseProbability * 100)}%
                    </span>
                  </div>
                  <Progress value={prediction.purchaseProbability * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Engagement Jeux</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(prediction.gameEngagementScore)}%
                    </span>
                  </div>
                  <Progress value={prediction.gameEngagementScore} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Action Recommandée</span>
                    <Badge variant="outline" className={getActionColor(prediction.recommendedAction)}>
                      {prediction.recommendedAction.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune prédiction disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Segment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Segmentation Utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            {segment ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${getSegmentColor(segment.segment)}`}></div>
                  <div>
                    <h3 className="font-medium capitalize">{segment.segment.replace('_', ' ')}</h3>
                    <p className="text-sm text-gray-600">Segment principal</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Caractéristiques</h4>
                  <div className="flex flex-wrap gap-2">
                    {segment.characteristics.map((char, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Fonctionnalités Recommandées</h4>
                  <div className="flex flex-wrap gap-2">
                    {segment.recommendedFeatures.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun segment identifié
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recommandations IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Metrics */}
      {modelMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Métriques des Modèles TensorFlow.js
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Modèles Chargés</p>
                <p className="font-medium">{modelMetrics.modelsLoaded ? 'Oui' : 'Non'}</p>
              </div>
              <div>
                <p className="text-gray-600">Couches Churn</p>
                <p className="font-medium">{modelMetrics.churnModelLayers}</p>
              </div>
              <div>
                <p className="text-gray-600">Couches Achat</p>
                <p className="font-medium">{modelMetrics.purchaseModelLayers}</p>
              </div>
              <div>
                <p className="text-gray-600">Mémoire Utilisée</p>
                <p className="font-medium">{Math.round(modelMetrics.memoryUsage?.numBytes / 1024 / 1024 || 0)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TensorFlowBehaviorDashboard;
