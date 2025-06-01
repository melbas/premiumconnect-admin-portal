
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  tensorflowBehaviorService, 
  UserBehaviorData, 
  BehaviorPrediction, 
  UserSegment 
} from '@/services/ai/tensorflowBehaviorService';

export interface BehaviorState {
  prediction: BehaviorPrediction | null;
  segment: UserSegment | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export const useTensorFlowBehavior = () => {
  const { user } = useAuth();
  const [behaviorState, setBehaviorState] = useState<BehaviorState>({
    prediction: null,
    segment: null,
    isLoading: false,
    error: null,
    isInitialized: false
  });

  // Initialize TensorFlow.js service
  useEffect(() => {
    const initializeService = async () => {
      try {
        setBehaviorState(prev => ({ ...prev, isLoading: true }));
        await tensorflowBehaviorService.initialize();
        setBehaviorState(prev => ({ 
          ...prev, 
          isInitialized: true, 
          isLoading: false,
          error: null 
        }));
      } catch (error) {
        setBehaviorState(prev => ({ 
          ...prev, 
          error: 'Failed to initialize TensorFlow.js models',
          isLoading: false 
        }));
      }
    };

    initializeService();

    // Cleanup on unmount
    return () => {
      tensorflowBehaviorService.dispose();
    };
  }, []);

  // Analyze user behavior
  const analyzeBehavior = useCallback(async (behaviorData: UserBehaviorData) => {
    if (!behaviorState.isInitialized) {
      setBehaviorState(prev => ({ 
        ...prev, 
        error: 'TensorFlow.js models not initialized' 
      }));
      return;
    }

    try {
      setBehaviorState(prev => ({ ...prev, isLoading: true, error: null }));

      console.log('🧠 Analyzing user behavior with TensorFlow.js...', behaviorData);

      const [prediction, segment] = await Promise.all([
        tensorflowBehaviorService.predictBehavior(behaviorData),
        tensorflowBehaviorService.segmentUser(behaviorData)
      ]);

      setBehaviorState(prev => ({
        ...prev,
        prediction,
        segment,
        isLoading: false
      }));

      console.log('✅ Behavior analysis complete:', { prediction, segment });

      return { prediction, segment };
    } catch (error) {
      console.error('❌ Error analyzing behavior:', error);
      setBehaviorState(prev => ({
        ...prev,
        error: 'Failed to analyze user behavior',
        isLoading: false
      }));
    }
  }, [behaviorState.isInitialized]);

  // Get real-time recommendations
  const getRecommendations = useCallback((): string[] => {
    if (!behaviorState.prediction || !behaviorState.segment) {
      return ['Complete your profile for personalized recommendations'];
    }

    const recommendations: string[] = [];
    const { prediction, segment } = behaviorState;

    switch (prediction.recommendedAction) {
      case 'offer_premium':
        recommendations.push('🎯 Upgrade to premium for unlimited access');
        recommendations.push('💰 Special offer: 30% off premium plans');
        break;
      case 'suggest_game':
        recommendations.push('🎮 Try our new puzzle games');
        recommendations.push('🏆 Complete daily challenges for rewards');
        break;
      case 'extend_session':
        recommendations.push('⏰ Extend your session for 30 more minutes');
        recommendations.push('📱 Download our app for offline access');
        break;
      default:
        recommendations.push('👋 Welcome! Explore our features');
    }

    // Add segment-specific recommendations
    segment.recommendedFeatures.forEach(feature => {
      switch (feature) {
        case 'loyalty_program':
          recommendations.push('⭐ Join our loyalty program');
          break;
        case 'mini_games':
          recommendations.push('🎲 Play mini-games while browsing');
          break;
        case 'premium_plans':
          recommendations.push('💎 Check out premium benefits');
          break;
      }
    });

    return recommendations.slice(0, 3); // Limit to top 3
  }, [behaviorState.prediction, behaviorState.segment]);

  // Get model performance metrics
  const getModelMetrics = useCallback(async () => {
    if (!behaviorState.isInitialized) return null;
    return await tensorflowBehaviorService.getModelMetrics();
  }, [behaviorState.isInitialized]);

  return {
    ...behaviorState,
    analyzeBehavior,
    getRecommendations,
    getModelMetrics
  };
};
