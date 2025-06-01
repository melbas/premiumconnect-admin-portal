
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { sentimentAnalysisService, type SentimentAnalysis } from '@/services/ai/sentimentAnalysisService';
import { Heart, Frown, Meh, Languages, MessageSquare } from 'lucide-react';

interface SentimentAnalysisWidgetProps {
  onAnalysisComplete?: (analysis: SentimentAnalysis) => void;
  placeholder?: string;
  supportedLanguages?: string[];
}

const SentimentAnalysisWidget: React.FC<SentimentAnalysisWidgetProps> = ({
  onAnalysisComplete,
  placeholder = "Écrivez votre message ici... (Français, Wolof, Pulaar supportés)",
  supportedLanguages = ['fr', 'wo', 'ff', 'en']
}) => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState<SentimentAnalysis[]>([]);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await sentimentAnalysisService.analyzeSentiment(text);
      setAnalysis(result);
      setRecentAnalyses(prev => [result, ...prev.slice(0, 4)]); // Garder 5 analyses max
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Heart className="w-4 h-4 text-green-600" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-600" />;
      default: return <Meh className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      'fr': '🇫🇷',
      'wo': '🇸🇳',
      'ff': '🇸🇳',
      'en': '🇬🇧'
    };
    return flags[language] || '🌍';
  };

  const getLanguageName = (language: string) => {
    const names: Record<string, string> = {
      'fr': 'Français',
      'wo': 'Wolof',
      'ff': 'Pulaar',
      'en': 'Anglais'
    };
    return names[language] || language;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Analyse de sentiment multilingue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px]"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Languages className="w-3 h-3" />
                <span>Supporte: Français, Wolof, Pulaar</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {text.length} caractères
              </span>
            </div>
          </div>

          <Button 
            onClick={analyzeText} 
            disabled={!text.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser le sentiment'}
          </Button>

          {analysis && (
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(analysis.sentiment)}
                  <Badge className={getSentimentColor(analysis.sentiment)}>
                    {analysis.sentiment}
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(analysis.confidence * 100)}% confiance
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span>{getLanguageFlag(analysis.language)}</span>
                  <span className="text-sm text-muted-foreground">
                    {getLanguageName(analysis.language)}
                  </span>
                </div>
              </div>

              {analysis.emotions.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Émotions détectées :</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.emotions.map((emotion, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis.culturalContext && (
                <div className="text-sm">
                  <span className="font-medium">Contexte culturel :</span>
                  <p className="text-muted-foreground">{analysis.culturalContext}</p>
                </div>
              )}

              {analysis.localInsights && analysis.localInsights.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Insights locaux :</span>
                  <ul className="list-disc list-inside text-muted-foreground mt-1">
                    {analysis.localInsights.map((insight, idx) => (
                      <li key={idx} className="text-xs">{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {recentAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Analyses récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAnalyses.map((recent, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border border-border rounded text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getSentimentIcon(recent.sentiment)}
                    <span className="truncate">{recent.text.substring(0, 40)}...</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{getLanguageFlag(recent.language)}</span>
                    <Badge className={getSentimentColor(recent.sentiment)}>
                      {recent.sentiment}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SentimentAnalysisWidget;
