
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { recommendationService } from '@/services/ai/recommendationService';
import { fraudDetectionService } from '@/services/ai/fraudDetectionService';
import { behaviorPredictionService } from '@/services/ai/behaviorPredictionService';
import { sentimentAnalysisService } from '@/services/ai/sentimentAnalysisService';

export interface AIInsights {
  recommendations: any[];
  securityThreats: any[];
  behaviorPredictions: any;
  sentimentTrends: any[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useAIInsights = (userId?: string, autoRefresh = true) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsights>({
    recommendations: [],
    securityThreats: [],
    behaviorPredictions: null,
    sentimentTrends: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  const currentUserId = userId || user?.id;

  const loadInsights = async () => {
    if (!currentUserId) return;

    setInsights(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🧠 Loading AI insights for user:', currentUserId);

      // Charger toutes les données en parallèle
      const [recommendations, threats, predictions] = await Promise.allSettled([
        recommendationService.generatePersonalizedRecommendations(currentUserId, {
          language: 'fr',
          spendingPattern: 'medium',
          connectionFrequency: 'regular',
          contentPreferences: [],
          deviceType: 'mobile',
          locationPattern: []
        }),
        fraudDetectionService.detectAnomalies(currentUserId),
        behaviorPredictionService.predictUserBehavior(currentUserId)
      ]);

      setInsights(prev => ({
        ...prev,
        recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
        securityThreats: threats.status === 'fulfilled' ? threats.value : [],
        behaviorPredictions: predictions.status === 'fulfilled' ? predictions.value : null,
        sentimentTrends: [], // À implémenter avec l'historique des sentiments
        isLoading: false,
        lastUpdated: new Date()
      }));

      console.log('✅ AI insights loaded successfully');
    } catch (error) {
      console.error('❌ Error loading AI insights:', error);
      setInsights(prev => ({
        ...prev,
        error: 'Erreur lors du chargement des insights IA',
        isLoading: false
      }));
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadInsights();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (autoRefresh && currentUserId) {
      const interval = setInterval(loadInsights, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, currentUserId]);

  return {
    ...insights,
    refresh: loadInsights
  };
};
