
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap
} from 'lucide-react';
import { behaviorPredictionService } from '@/services/ai/behaviorPredictionService';
import { sentimentAnalysisService } from '@/services/ai/sentimentAnalysisService';

interface AIInsight {
  id: string;
  type: 'prediction' | 'sentiment' | 'behavior' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  culturalContext?: string;
  actionable: boolean;
  timestamp: Date;
}

interface MetricCard {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  aiPrediction?: string;
}

const AIInsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'wo'>('fr');

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    setIsLoading(true);
    try {
      // Simulation des insights IA
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'prediction',
          title: 'Pic de connexions prévu',
          description: 'L\'IA prédit une augmentation de 40% des connexions entre 18h-20h',
          confidence: 0.85,
          priority: 'high',
          culturalContext: 'Heure de retour du travail et des cours',
          actionable: true,
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'sentiment',
          title: 'Satisfaction utilisateur élevée',
          description: 'Sentiment positif détecté dans 78% des interactions en wolof',
          confidence: 0.78,
          priority: 'medium',
          culturalContext: 'Communication en langue locale appréciée',
          actionable: false,
          timestamp: new Date()
        },
        {
          id: '3',
          type: 'behavior',
          title: 'Pattern familial détecté',
          description: 'Usage partagé d\'appareils observé - recommandation de forfait famille',
          confidence: 0.72,
          priority: 'medium',
          culturalContext: 'Structure familiale élargie typique',
          actionable: true,
          timestamp: new Date()
        },
        {
          id: '4',
          type: 'recommendation',
          title: 'Optimisation réseau mobile',
          description: 'Recommandation d\'activer le mode économie pour 65% des utilisateurs',
          confidence: 0.90,
          priority: 'high',
          culturalContext: 'Préservation du forfait data mobile',
          actionable: true,
          timestamp: new Date()
        }
      ];

      const mockMetrics: MetricCard[] = [
        {
          label: 'Connexions actives',
          value: '234',
          change: 12.5,
          trend: 'up',
          aiPrediction: '+15% dans 1h (heure de pointe)'
        },
        {
          label: 'Satisfaction IA',
          value: '4.2/5',
          change: 8.3,
          trend: 'up',
          aiPrediction: 'Amélioration continue détectée'
        },
        {
          label: 'Interactions Wolof',
          value: '42%',
          change: 5.7,
          trend: 'up',
          aiPrediction: 'Adoption croissante langue locale'
        },
        {
          label: 'Temps de réponse IA',
          value: '1.2s',
          change: -18.4,
          trend: 'down',
          aiPrediction: 'Optimisation continue active'
        }
      ];

      setInsights(mockInsights);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="w-4 h-4" />;
      case 'sentiment': return <Activity className="w-4 h-4" />;
      case 'behavior': return <Users className="w-4 h-4" />;
      case 'recommendation': return <Zap className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteur de langue */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Insights IA en Temps Réel</h2>
        </div>
        <div className="flex gap-2">
          <Badge 
            variant={selectedLanguage === 'fr' ? 'default' : 'outline'}
            onClick={() => setSelectedLanguage('fr')}
            className="cursor-pointer"
          >
            Français
          </Badge>
          <Badge 
            variant={selectedLanguage === 'wo' ? 'default' : 'outline'}
            onClick={() => setSelectedLanguage('wo')}
            className="cursor-pointer"
          >
            Wolof
          </Badge>
        </div>
      </div>

      {/* Métriques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className={`${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-muted-foreground">vs hier</span>
                  </div>
                  {metric.aiPrediction && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-1 rounded">
                      IA: {metric.aiPrediction}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights IA */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Insights IA Actionables</h3>
        {insights.map((insight) => (
          <Alert key={insight.id} className="relative">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(insight.confidence * 100)}% confiance
                  </Badge>
                  {insight.actionable && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Actionable
                    </Badge>
                  )}
                </div>
                
                <AlertDescription>
                  {insight.description}
                </AlertDescription>

                {insight.culturalContext && (
                  <div className="bg-orange-50 p-3 rounded border border-orange-200">
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">Contexte culturel</p>
                        <p className="text-sm text-orange-700">{insight.culturalContext}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Généré le {insight.timestamp.toLocaleString('fr-FR')}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>

      {/* Actions recommandées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Actions Recommandées par l'IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.filter(i => i.actionable).map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded">
                <div className="flex items-center gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <p className="font-medium text-sm">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Implémenter
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsDashboard;
