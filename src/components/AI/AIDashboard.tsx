
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIInsights } from '@/hooks/use-ai-insights';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import SentimentAnalysisWidget from './SentimentAnalysisWidget';
import SecurityAlerts from './SecurityAlerts';
import { Brain, Shield, MessageSquare, TrendingUp, Users, Globe } from 'lucide-react';

interface AIDashboardProps {
  userId?: string;
  language?: 'fr' | 'wo' | 'ff' | 'en';
}

const AIDashboard: React.FC<AIDashboardProps> = ({ 
  userId, 
  language = 'fr' 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    recommendations, 
    securityThreats, 
    behaviorPredictions,
    sentimentTrends,
    isLoading, 
    error,
    lastUpdated,
    refresh 
  } = useAIInsights(userId);

  const getWelcomeMessage = () => {
    const messages = {
      'fr': 'Tableau de bord IA - Optimisé pour l\'Afrique',
      'wo': 'Dashboard IA - Optimisé ci Afrique',
      'ff': 'Dashboard IA - Optimisé e Afrika',
      'en': 'AI Dashboard - Optimized for Africa'
    };
    return messages[language] || messages['fr'];
  };

  const getTabLabels = () => {
    const labels = {
      'fr': {
        overview: 'Vue d\'ensemble',
        recommendations: 'Recommandations',
        security: 'Sécurité',
        sentiment: 'Sentiment',
        insights: 'Insights'
      },
      'wo': {
        overview: 'Génn yu yépp',
        recommendations: 'Waxtaanu',
        security: 'Kiifu',
        sentiment: 'Xel',
        insights: 'Xam-xam'
      }
    };
    return labels[language] || labels['fr'];
  };

  const tabLabels = getTabLabels();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{getWelcomeMessage()}</h1>
            <p className="text-muted-foreground">
              Intelligence artificielle adaptée au contexte sénégalais
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            🇸🇳 Marché africain
          </Badge>
          <Button onClick={refresh} variant="outline" size="sm">
            Actualiser
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Recommandations</p>
                <p className="text-2xl font-bold">{recommendations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Alertes sécurité</p>
                <p className="text-2xl font-bold">{securityThreats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Analyses sentiment</p>
                <p className="text-2xl font-bold">{sentimentTrends.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Prédictions</p>
                <p className="text-2xl font-bold">
                  {behaviorPredictions ? '1' : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{tabLabels.overview}</TabsTrigger>
          <TabsTrigger value="recommendations">{tabLabels.recommendations}</TabsTrigger>
          <TabsTrigger value="security">{tabLabels.security}</TabsTrigger>
          <TabsTrigger value="sentiment">{tabLabels.sentiment}</TabsTrigger>
          <TabsTrigger value="insights">{tabLabels.insights}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Insights contextuels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {behaviorPredictions && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">Prédiction comportementale</h4>
                    <p className="text-sm text-muted-foreground">
                      Utilisateur actif avec {behaviorPredictions.activityLevel} d'engagement
                    </p>
                  </div>
                )}
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Contexte local</h4>
                  <p className="text-sm text-muted-foreground">
                    Optimisé pour les patterns de consommation sénégalais
                  </p>
                </div>

                {lastUpdated && (
                  <div className="border-l-4 border-gray-500 pl-4">
                    <h4 className="font-medium">Dernière mise à jour</h4>
                    <p className="text-sm text-muted-foreground">
                      {lastUpdated.toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Language Support */}
            <Card>
              <CardHeader>
                <CardTitle>Support multilingue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2">🇫🇷</div>
                    <p className="font-medium">Français</p>
                    <p className="text-sm text-muted-foreground">Langue principale</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2">🇸🇳</div>
                    <p className="font-medium">Wolof</p>
                    <p className="text-sm text-muted-foreground">Langue locale</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2">🇸🇳</div>
                    <p className="font-medium">Pulaar</p>
                    <p className="text-sm text-muted-foreground">Support régional</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2">🇬🇧</div>
                    <p className="font-medium">English</p>
                    <p className="text-sm text-muted-foreground">International</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <PersonalizedRecommendations 
            userId={userId} 
            language={language}
            maxRecommendations={6}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityAlerts 
            userId={userId}
            language={language}
          />
        </TabsContent>

        <TabsContent value="sentiment">
          <SentimentAnalysisWidget 
            supportedLanguages={['fr', 'wo', 'ff', 'en']}
            placeholder={
              language === 'wo' 
                ? "Bind sa mbind fii... (Français, Wolof, Pulaar nga ko def)"
                : "Écrivez votre message ici... (Français, Wolof, Pulaar supportés)"
            }
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights avancés</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Chargement des insights...</p>
              ) : error ? (
                <p className="text-red-500">Erreur: {error}</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Patterns de connexion</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyse des habitudes de connexion typiques du marché sénégalais
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Préférences culturelles</h4>
                      <p className="text-sm text-muted-foreground">
                        Recommandations basées sur le contexte local
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Optimisation mobile</h4>
                      <p className="text-sm text-muted-foreground">
                        Adapté aux habitudes de consommation mobile africaines
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Paiements locaux</h4>
                      <p className="text-sm text-muted-foreground">
                        Intégration Orange Money, Wave et autres solutions locales
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDashboard;
