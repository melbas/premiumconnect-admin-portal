
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { recommendationService, type UserRecommendation } from '@/services/ai/recommendationService';
import { useAuth } from '@/context/AuthContext';
import { Star, TrendingUp, Gift, Gamepad2, Zap } from 'lucide-react';

interface PersonalizedRecommendationsProps {
  userId?: string;
  language?: 'fr' | 'wo' | 'ff' | 'en';
  maxRecommendations?: number;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  userId,
  language = 'fr',
  maxRecommendations = 4
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = userId || user?.id;

  useEffect(() => {
    if (currentUserId) {
      loadRecommendations();
    }
  }, [currentUserId, language]);

  const loadRecommendations = async () => {
    if (!currentUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const userPreferences = {
        language,
        spendingPattern: 'medium' as const,
        connectionFrequency: 'regular' as const,
        contentPreferences: ['wifi', 'entertainment'],
        deviceType: 'mobile' as const,
        locationPattern: ['dakar', 'senegal']
      };

      const marketContext = {
        averageIncome: 150000, // FCFA
        popularPaymentMethods: ['orange_money', 'wave', 'cash'],
        culturalEvents: ['tabaski', 'korité', 'magal'],
        seasonalTrends: ['ramadan_connectivity', 'family_gatherings'],
        localCompetitors: ['sonatel', 'tigo', 'expresso']
      };

      const recs = await recommendationService.generatePersonalizedRecommendations(
        currentUserId,
        userPreferences,
        marketContext
      );

      setRecommendations(recs.slice(0, maxRecommendations));
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Impossible de charger les recommandations');
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'plan': return <TrendingUp className="w-5 h-5" />;
      case 'game': return <Gamepad2 className="w-5 h-5" />;
      case 'offer': return <Gift className="w-5 h-5" />;
      case 'content': return <Zap className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getRecommendationColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 0.6) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const handleRecommendationClick = (recommendation: UserRecommendation) => {
    console.log('🎯 Recommendation clicked:', recommendation);
    // Ici, implémenter la logique de navigation ou d'action
  };

  if (!currentUserId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Connectez-vous pour voir vos recommandations personnalisées
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Recommandations pour vous
          {language === 'wo' && <Badge variant="outline">Wolof</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={loadRecommendations} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Aucune recommandation disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleRecommendationClick(rec)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {getRecommendationIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={getRecommendationColor(rec.score)}
                        >
                          {Math.round(rec.score * 100)}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {rec.reason}
                        </p>
                        {rec.localizedPrice && (
                          <Badge variant="secondary">
                            {rec.localizedPrice}
                          </Badge>
                        )}
                      </div>
                      {rec.culturalContext && (
                        <p className="text-xs text-blue-600 mt-1">
                          🌍 {rec.culturalContext}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Button 
                onClick={loadRecommendations} 
                variant="outline" 
                className="w-full"
                size="sm"
              >
                Actualiser les recommandations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
