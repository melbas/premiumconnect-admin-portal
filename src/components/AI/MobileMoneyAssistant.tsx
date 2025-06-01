
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  CreditCard, 
  Zap, 
  Shield,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { mobileMoneyAIService, type PaymentRecommendation, type UserPaymentProfile } from '@/services/ai/mobileMoneyAIService';
import { useAuth } from '@/context/AuthContext';

interface MobileMoneyAssistantProps {
  amount?: number;
  context?: string;
  language?: 'fr' | 'wo';
  onPaymentSelected?: (provider: string, amount: number) => void;
}

const MobileMoneyAssistant: React.FC<MobileMoneyAssistantProps> = ({
  amount = 500,
  context = 'wifi_payment',
  language = 'fr',
  onPaymentSelected
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<PaymentRecommendation[]>([]);
  const [userProfile, setUserProfile] = useState<UserPaymentProfile>({
    preferredLanguage: language,
    averageTransactionAmount: amount,
    frequencyPattern: 'regular',
    deviceType: 'smartphone',
    locationPattern: ['dakar'],
    familyGroup: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [amount, language]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const recs = await mobileMoneyAIService.recommendProvider(
        amount,
        { ...userProfile, preferredLanguage: language },
        context
      );
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    if (onPaymentSelected) {
      onPaymentSelected(providerId, amount);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'orange_money': return '🟠';
      case 'wave': return '🌊';
      case 'free_money': return '🆓';
      case 'wizall': return '✨';
      default: return '📱';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const texts = {
    fr: {
      title: 'Assistant Mobile Money IA',
      subtitle: 'Recommandations personnalisées pour vos paiements',
      amount: 'Montant',
      recommendations: 'Recommandations IA',
      fees: 'Frais',
      instructions: 'Instructions',
      payWith: 'Payer avec',
      optimal: 'Optimal',
      popular: 'Populaire',
      cultural: 'Contexte culturel',
      loading: 'Analyse en cours...'
    },
    wo: {
      title: 'Assistant Mobile Money IA',
      subtitle: 'Takkuwaay yi nga mën a jëfandikoo',
      amount: 'Xaalis',
      recommendations: 'Takkuwaay IA',
      fees: 'Màqaddu',
      instructions: 'Takku',
      payWith: 'Def ak',
      optimal: 'Gën a baax',
      popular: 'Bu bees',
      cultural: 'Àdduna',
      loading: 'Daj naa...'
    }
  };

  const t = texts[language];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 animate-pulse text-blue-500" />
            <span className="text-muted-foreground">{t.loading}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-500" />
          {t.title}
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {language.toUpperCase()}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Montant affiché */}
        <Alert>
          <CreditCard className="w-4 h-4" />
          <AlertDescription>
            <span className="font-medium">{t.amount}:</span> {amount.toLocaleString()} FCFA
          </AlertDescription>
        </Alert>

        {/* Recommandations */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            {t.recommendations}
          </h4>

          {recommendations.map((rec, index) => (
            <div 
              key={rec.provider.id}
              className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                selectedProvider === rec.provider.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleProviderSelect(rec.provider.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getProviderIcon(rec.provider.id)}</span>
                  <div>
                    <h5 className="font-medium">{rec.provider.name}</h5>
                    <p className="text-xs text-muted-foreground">{rec.reason}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getConfidenceColor(rec.confidence)}>
                    {Math.round(rec.confidence * 100)}%
                  </Badge>
                  {rec.isOptimal && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t.optimal}
                    </Badge>
                  )}
                  {index === 0 && !rec.isOptimal && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      {t.popular}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Frais */}
              <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">{t.fees}:</span> {rec.estimatedFees} FCFA
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">USSD:</span> {rec.provider.ussdCode}
                </div>
              </div>

              {/* Contexte culturel */}
              {rec.culturalContext && (
                <div className="bg-blue-50 p-2 rounded border border-blue-200 text-xs">
                  <div className="flex items-start gap-2">
                    <Shield className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800">{t.cultural}</p>
                      <p className="text-blue-700">{rec.culturalContext}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                <p className="text-xs font-medium text-green-800">{t.instructions}:</p>
                <p className="text-xs text-green-700">
                  {mobileMoneyAIService.generatePaymentInstructions(
                    rec.provider,
                    amount,
                    language
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de paiement */}
        {selectedProvider && (
          <Button 
            className="w-full" 
            onClick={() => {
              const provider = recommendations.find(r => r.provider.id === selectedProvider);
              if (provider) {
                console.log('🚀 Payment initiated with:', provider.provider.name);
                // Ici, implémenter l'intégration réelle avec l'API de paiement
              }
            }}
          >
            {t.payWith} {recommendations.find(r => r.provider.id === selectedProvider)?.provider.name}
          </Button>
        )}

        {/* Aide IA */}
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            {language === 'fr' 
              ? "💡 L'IA a analysé vos habitudes pour vous recommander les meilleurs options de paiement."
              : "💡 IA bi seet na sa yoon yi ngir joxe la takkuwaay yu gën a baax."
            }
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default MobileMoneyAssistant;
