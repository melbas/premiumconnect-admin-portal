
import { supabase } from "@/integrations/supabase/client";

export interface SentimentAnalysis {
  text: string;
  language: 'fr' | 'wo' | 'ff' | 'en';
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  culturalContext?: string;
  localInsights?: string[];
}

export interface MultilingualContent {
  original: string;
  language: string;
  translations?: Record<string, string>;
  culturalAdaptations?: Record<string, string>;
}

export const sentimentAnalysisService = {
  /**
   * Analyse le sentiment d'un texte en français et wolof
   */
  async analyzeSentiment(text: string, detectedLanguage?: string): Promise<SentimentAnalysis> {
    try {
      console.log('💭 Analyzing sentiment for text:', text.substring(0, 50));

      const language = detectedLanguage || await this.detectLanguage(text);
      const sentiment = await this.performSentimentAnalysis(text, language);
      const emotions = await this.extractEmotions(text, language);
      const culturalContext = await this.addCulturalContext(text, language);

      const analysis: SentimentAnalysis = {
        text,
        language: language as any,
        sentiment: sentiment.sentiment,
        confidence: sentiment.confidence,
        emotions,
        culturalContext,
        localInsights: await this.generateLocalInsights(text, language, sentiment.sentiment)
      };

      console.log('✅ Sentiment analysis completed:', analysis.sentiment, analysis.confidence);
      return analysis;
    } catch (error) {
      console.error('❌ Error in sentiment analysis:', error);
      return this.getFallbackAnalysis(text);
    }
  },

  /**
   * Détecte la langue du texte (français, wolof, pulaar, anglais)
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      // Mots-clés pour détecter les langues locales
      const wolofKeywords = ['nit', 'yow', 'man', 'waaw', 'dëgg', 'fajaro', 'ñoom', 'yaag', 'wale'];
      const frenchKeywords = ['je', 'tu', 'il', 'nous', 'vous', 'ils', 'le', 'la', 'les', 'un', 'une'];
      const pulaarKeywords = ['mi', 'on', 'ko', 'omo', 'be', 'nde', 'gooto', 'ɗiɗi'];

      const textLower = text.toLowerCase();

      // Comptage des mots-clés par langue
      const wolofCount = wolofKeywords.filter(keyword => textLower.includes(keyword)).length;
      const frenchCount = frenchKeywords.filter(keyword => textLower.includes(keyword)).length;
      const pulaarCount = pulaarKeywords.filter(keyword => textLower.includes(keyword)).length;

      if (wolofCount > frenchCount && wolofCount > pulaarCount) return 'wo';
      if (pulaarCount > frenchCount && pulaarCount > wolofCount) return 'ff';
      if (frenchCount > 0) return 'fr';

      // Appel à l'IA pour une détection plus précise
      const { data } = await supabase.functions.invoke('language-detection', {
        body: { text, context: 'senegal' }
      });

      return data?.language || 'fr';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'fr'; // Par défaut français
    }
  },

  /**
   * Effectue l'analyse de sentiment
   */
  async performSentimentAnalysis(text: string, language: string) {
    try {
      const { data, error } = await supabase.functions.invoke('sentiment-analysis', {
        body: {
          text,
          language,
          context: 'african_market',
          culturalFactors: this.getCulturalFactors(language)
        }
      });

      if (error) throw error;

      return {
        sentiment: data.sentiment || 'neutral',
        confidence: data.confidence || 0.5
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return this.getBasicSentiment(text, language);
    }
  },

  /**
   * Extrait les émotions du texte
   */
  async extractEmotions(text: string, language: string): Promise<string[]> {
    const emotionKeywords: Record<string, Record<string, string[]>> = {
      'fr': {
        'joie': ['content', 'heureux', 'ravi', 'satisfait', 'excellent'],
        'colère': ['mécontent', 'frustré', 'énervé', 'furieux', 'horrible'],
        'tristesse': ['triste', 'déçu', 'malheureux', 'déprimé'],
        'peur': ['inquiet', 'anxieux', 'nerveux', 'effrayé'],
        'surprise': ['surpris', 'étonné', 'choqué', 'impressionné']
      },
      'wo': {
        'joie': ['kontaan', 'bees', 'rafet', 'baax'],
        'colère': ['meetti', 'goor', 'door'],
        'tristesse': ['may', 'ñuul', 'metit'],
        'surprise': ['yépp', 'taaw']
      }
    };

    const emotions: string[] = [];
    const textLower = text.toLowerCase();
    const languageEmotions = emotionKeywords[language] || emotionKeywords['fr'];

    for (const [emotion, keywords] of Object.entries(languageEmotions)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        emotions.push(emotion);
      }
    }

    return emotions.length > 0 ? emotions : ['neutre'];
  },

  /**
   * Ajoute le contexte culturel
   */
  async addCulturalContext(text: string, language: string): Promise<string> {
    const culturalPatterns: Record<string, string[]> = {
      'wo': [
        'Expression wolof traditionnelle',
        'Contexte culturel sénégalais',
        'Communication communautaire'
      ],
      'fr': [
        'Français sénégalais',
        'Influence locale',
        'Contexte urbain'
      ],
      'ff': [
        'Expression pulaar',
        'Culture pastorale',
        'Tradition orale'
      ]
    };

    const patterns = culturalPatterns[language] || ['Expression générale'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  },

  /**
   * Génère des insights locaux
   */
  async generateLocalInsights(text: string, language: string, sentiment: string): Promise<string[]> {
    const insights: string[] = [];

    if (language === 'wo') {
      insights.push('Utilisation de la langue locale - forte connexion culturelle');
      if (sentiment === 'positive') {
        insights.push('Sentiment positif en wolof - satisfaction authentique');
      }
    }

    if (sentiment === 'negative' && language === 'fr') {
      insights.push('Mécontentement exprimé en français - besoin d\'assistance professionnelle');
    }

    if (text.includes('famille') || text.includes('ndey') || text.includes('baay')) {
      insights.push('Contexte familial mentionné - importance du collectif');
    }

    if (text.includes('argent') || text.includes('xaalis') || text.includes('fric')) {
      insights.push('Préoccupation financière - sensibilité au prix importante');
    }

    return insights;
  },

  /**
   * Analyse de sentiment batch pour plusieurs textes
   */
  async analyzeBatchSentiments(texts: string[]): Promise<SentimentAnalysis[]> {
    const analyses = await Promise.all(
      texts.map(text => this.analyzeSentiment(text))
    );
    return analyses;
  },

  /**
   * Traduit le contenu en tenant compte du contexte culturel
   */
  async translateWithCulturalContext(
    content: MultilingualContent,
    targetLanguage: string
  ): Promise<string> {
    try {
      const { data } = await supabase.functions.invoke('cultural-translation', {
        body: {
          content: content.original,
          sourceLanguage: content.language,
          targetLanguage,
          culturalContext: 'senegal'
        }
      });

      return data?.translation || content.original;
    } catch (error) {
      console.error('Translation error:', error);
      return content.original;
    }
  },

  /**
   * Obtient les facteurs culturels pour une langue
   */
  getCulturalFactors(language: string) {
    const factors: Record<string, any> = {
      'wo': {
        indirectness: 'high',
        collectivism: 'high',
        hierarchyRespect: 'high',
        emotionalExpression: 'moderate'
      },
      'fr': {
        indirectness: 'moderate',
        collectivism: 'moderate',
        hierarchyRespect: 'moderate',
        emotionalExpression: 'moderate'
      },
      'ff': {
        indirectness: 'high',
        collectivism: 'very_high',
        hierarchyRespect: 'very_high',
        emotionalExpression: 'low'
      }
    };

    return factors[language] || factors['fr'];
  },

  /**
   * Analyse de sentiment basique sans IA
   */
  getBasicSentiment(text: string, language: string) {
    const positiveWords = language === 'wo' 
      ? ['baax', 'rafet', 'kontaan', 'bees']
      : ['bon', 'bien', 'excellent', 'super', 'parfait'];

    const negativeWords = language === 'wo'
      ? ['bon', 'metit', 'door']
      : ['mauvais', 'mal', 'horrible', 'nul', 'terrible'];

    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;

    if (positiveCount > negativeCount) {
      return { sentiment: 'positive' as const, confidence: 0.6 };
    } else if (negativeCount > positiveCount) {
      return { sentiment: 'negative' as const, confidence: 0.6 };
    }
    return { sentiment: 'neutral' as const, confidence: 0.5 };
  },

  /**
   * Analyse de secours
   */
  getFallbackAnalysis(text: string): SentimentAnalysis {
    return {
      text,
      language: 'fr',
      sentiment: 'neutral',
      confidence: 0.5,
      emotions: ['neutre'],
      culturalContext: 'Analyse basique',
      localInsights: ['Analyse limitée disponible']
    };
  }
};
