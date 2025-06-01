
import * as tf from '@tensorflow/tfjs';

export interface UserBehaviorData {
  sessionDuration: number;
  pagesVisited: number;
  clickCount: number;
  scrollDepth: number;
  timeOnPage: number;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  connectionTime: string;
  previousSessions: number;
  gameInteractions: number;
  chatInteractions: number;
}

export interface BehaviorPrediction {
  churnProbability: number;
  purchaseProbability: number;
  gameEngagementScore: number;
  recommendedAction: 'offer_premium' | 'suggest_game' | 'extend_session' | 'no_action';
  confidence: number;
}

export interface UserSegment {
  segment: 'casual' | 'engaged' | 'premium_candidate' | 'at_risk';
  characteristics: string[];
  recommendedFeatures: string[];
}

class TensorFlowBehaviorService {
  private churnModel: tf.LayersModel | null = null;
  private purchaseModel: tf.LayersModel | null = null;
  private engagementModel: tf.LayersModel | null = null;
  private isInitialized = false;

  // Initialize TensorFlow.js models
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🧠 Initializing TensorFlow.js behavior models...');
      
      // Create simple models for demonstration
      await this.createChurnPredictionModel();
      await this.createPurchasePredictionModel();
      await this.createEngagementModel();
      
      this.isInitialized = true;
      console.log('✅ TensorFlow.js models initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing TensorFlow.js models:', error);
      throw error;
    }
  }

  // Create churn prediction model
  private async createChurnPredictionModel(): Promise<void> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [9], units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.churnModel = model;
  }

  // Create purchase prediction model
  private async createPurchasePredictionModel(): Promise<void> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [9], units: 12, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.1 }),
        tf.layers.dense({ units: 6, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.purchaseModel = model;
  }

  // Create engagement model
  private async createEngagementModel(): Promise<void> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [9], units: 20, activation: 'relu' }),
        tf.layers.dense({ units: 10, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    this.engagementModel = model;
  }

  // Preprocess user behavior data for model input
  private preprocessBehaviorData(data: UserBehaviorData): number[] {
    return [
      data.sessionDuration / 3600, // Normalize to hours
      data.pagesVisited / 10, // Normalize
      data.clickCount / 100, // Normalize
      data.scrollDepth / 100, // Already percentage
      data.timeOnPage / 300, // Normalize to 5-minute chunks
      data.deviceType === 'mobile' ? 1 : data.deviceType === 'tablet' ? 0.5 : 0,
      data.previousSessions / 20, // Normalize
      data.gameInteractions / 50, // Normalize
      data.chatInteractions / 30 // Normalize
    ];
  }

  // Predict user behavior and recommendations
  async predictBehavior(behaviorData: UserBehaviorData): Promise<BehaviorPrediction> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const features = this.preprocessBehaviorData(behaviorData);
      const inputTensor = tf.tensor2d([features], [1, 9]);

      // Get predictions from all models
      const churnPred = this.churnModel!.predict(inputTensor) as tf.Tensor;
      const purchasePred = this.purchaseModel!.predict(inputTensor) as tf.Tensor;
      const engagementPred = this.engagementModel!.predict(inputTensor) as tf.Tensor;

      const churnProb = await churnPred.data();
      const purchaseProb = await purchasePred.data();
      const engagementScore = await engagementPred.data();

      // Clean up tensors
      inputTensor.dispose();
      churnPred.dispose();
      purchasePred.dispose();
      engagementPred.dispose();

      const churnProbability = churnProb[0];
      const purchaseProbability = purchaseProb[0];
      const gameEngagementScore = Math.max(0, Math.min(100, engagementScore[0] * 100));

      // Determine recommended action
      const recommendedAction = this.getRecommendedAction(
        churnProbability,
        purchaseProbability,
        gameEngagementScore,
        behaviorData
      );

      const confidence = this.calculateConfidence(churnProbability, purchaseProbability);

      return {
        churnProbability,
        purchaseProbability,
        gameEngagementScore,
        recommendedAction,
        confidence
      };
    } catch (error) {
      console.error('Error predicting behavior:', error);
      // Return default prediction
      return {
        churnProbability: 0.5,
        purchaseProbability: 0.3,
        gameEngagementScore: 50,
        recommendedAction: 'no_action',
        confidence: 0.1
      };
    }
  }

  // Determine recommended action based on predictions
  private getRecommendedAction(
    churnProb: number,
    purchaseProb: number,
    engagementScore: number,
    behaviorData: UserBehaviorData
  ): BehaviorPrediction['recommendedAction'] {
    if (churnProb > 0.7) {
      return 'extend_session';
    }
    
    if (purchaseProb > 0.6 && behaviorData.previousSessions > 3) {
      return 'offer_premium';
    }
    
    if (engagementScore > 70 && behaviorData.gameInteractions < 5) {
      return 'suggest_game';
    }
    
    return 'no_action';
  }

  // Calculate confidence score
  private calculateConfidence(churnProb: number, purchaseProb: number): number {
    const churnConfidence = Math.abs(churnProb - 0.5) * 2;
    const purchaseConfidence = Math.abs(purchaseProb - 0.5) * 2;
    return (churnConfidence + purchaseConfidence) / 2;
  }

  // Segment users based on behavior patterns
  async segmentUser(behaviorData: UserBehaviorData): Promise<UserSegment> {
    const prediction = await this.predictBehavior(behaviorData);
    
    if (prediction.churnProbability > 0.7) {
      return {
        segment: 'at_risk',
        characteristics: ['High churn risk', 'Low engagement', 'Needs attention'],
        recommendedFeatures: ['loyalty_program', 'extended_trial', 'support_chat']
      };
    }
    
    if (prediction.purchaseProbability > 0.6) {
      return {
        segment: 'premium_candidate',
        characteristics: ['High purchase intent', 'Engaged user', 'Value-conscious'],
        recommendedFeatures: ['premium_plans', 'exclusive_content', 'priority_support']
      };
    }
    
    if (prediction.gameEngagementScore > 70) {
      return {
        segment: 'engaged',
        characteristics: ['High engagement', 'Interactive user', 'Game lover'],
        recommendedFeatures: ['mini_games', 'achievements', 'social_features']
      };
    }
    
    return {
      segment: 'casual',
      characteristics: ['Regular usage', 'Standard engagement', 'Basic needs'],
      recommendedFeatures: ['basic_features', 'simple_ui', 'quick_access']
    };
  }

  // Train models with new data (simplified for demo)
  async trainWithNewData(trainingData: UserBehaviorData[], labels: number[]): Promise<void> {
    if (!this.isInitialized || trainingData.length === 0) return;

    try {
      const features = trainingData.map(data => this.preprocessBehaviorData(data));
      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels, [labels.length, 1]);

      console.log('🔄 Training models with new data...');
      
      // Train churn model
      if (this.churnModel) {
        await this.churnModel.fit(xs, ys, {
          epochs: 10,
          batchSize: 32,
          verbose: 0
        });
      }

      xs.dispose();
      ys.dispose();
      
      console.log('✅ Models retrained successfully');
    } catch (error) {
      console.error('❌ Error training models:', error);
    }
  }

  // Get model performance metrics
  async getModelMetrics(): Promise<any> {
    return {
      modelsLoaded: this.isInitialized,
      churnModelLayers: this.churnModel?.layers.length || 0,
      purchaseModelLayers: this.purchaseModel?.layers.length || 0,
      engagementModelLayers: this.engagementModel?.layers.length || 0,
      memoryUsage: tf.memory()
    };
  }

  // Clean up resources
  dispose(): void {
    if (this.churnModel) {
      this.churnModel.dispose();
    }
    if (this.purchaseModel) {
      this.purchaseModel.dispose();
    }
    if (this.engagementModel) {
      this.engagementModel.dispose();
    }
    this.isInitialized = false;
  }
}

export const tensorflowBehaviorService = new TensorFlowBehaviorService();
