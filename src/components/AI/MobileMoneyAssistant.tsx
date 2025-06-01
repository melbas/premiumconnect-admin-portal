
/**
 * Mobile Money AI Assistant Component
 * Composant Assistant IA Mobile Money
 * 
 * EN: Provides intelligent mobile money assistance with AI-powered recommendations,
 *     cultural context adaptation, and multi-provider optimization for Senegal
 * FR: Fournit une assistance intelligente mobile money avec recommandations IA,
 *     adaptation du contexte culturel, et optimisation multi-providers pour le Sénégal
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Zap, 
  DollarSign,
  Clock,
  Users,
  GraduationCap,
  Building,
  Wifi,
  CheckCircle,
  AlertCircle,
  Globe
} from "lucide-react";
import { EnhancedChatAIService } from "@/services/ai/enhancedChatAIService";
import { toast } from "sonner";

// EN: Interface for payment context types
// FR: Interface pour les types de contexte de paiement
type PaymentContext = 'wifi_payment' | 'family_plan' | 'business_plan' | 'student_plan';

// EN: Interface for mobile money provider recommendations
// FR: Interface pour les recommandations de providers mobile money
interface ProviderRecommendation {
  name: string;
  availability: number;
  fees: number;
  speed: string;
  reliability: number;
  cultural_preference: string;
  recommended: boolean;
}

// EN: Interface for AI mobile money response
// FR: Interface pour la réponse IA mobile money
interface MobileMoneyAIResponse {
  paymentAnalysis: {
    urgency: string;
    typical_amount: number;
    user_type: string;
    amount_category: string;
    payment_strategy: string;
    cultural_considerations: string;
  };
  providerRecommendations: ProviderRecommendation[];
  culturalMessages: {
    main_message: string;
    encouragement: string;
    security: string;
  };
  fraudCheck: {
    amount_reasonable: boolean;
    amount_minimum: boolean;
    risk_score: number;
    status: string;
  };
  alternatives: Array<{
    type: string;
    description: string;
    amounts?: number[];
    suggested_amount?: number;
    savings?: number;
  }>;
  tips: string[];
}

// EN: Props interface for MobileMoneyAssistant component
// FR: Interface des props pour le composant MobileMoneyAssistant
interface MobileMoneyAssistantProps {
  userId?: string;
  initialLanguage?: 'fr' | 'wo';
  location?: string;
}

/**
 * EN: Mobile Money AI Assistant component with intelligent recommendations
 * FR: Composant Assistant IA Mobile Money avec recommandations intelligentes
 */
export function MobileMoneyAssistant({ 
  userId, 
  initialLanguage = 'fr',
  location 
}: MobileMoneyAssistantProps) {
  // EN: State management for mobile money functionality
  // FR: Gestion d'état pour les fonctionnalités mobile money
  const [amount, setAmount] = useState<string>('');
  const [context, setContext] = useState<PaymentContext>('wifi_payment');
  const [language, setLanguage] = useState<'fr' | 'wo'>(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<MobileMoneyAIResponse | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  // EN: Context options with bilingual labels
  // FR: Options de contexte avec libellés bilingues
  const contextOptions = {
    wifi_payment: {
      fr: 'Paiement WiFi',
      wo: 'Fey WiFi',
      icon: Wifi,
      color: 'text-blue-600'
    },
    family_plan: {
      fr: 'Plan Familial',
      wo: 'Sàñ-sàñ bu mbokk',
      icon: Users,
      color: 'text-green-600'
    },
    business_plan: {
      fr: 'Plan Business',
      wo: 'Sàñ-sàñ bu liggéey',
      icon: Building,
      color: 'text-purple-600'
    },
    student_plan: {
      fr: 'Plan Étudiant',
      wo: 'Sàñ-sàñ bu jàngkat',
      icon: GraduationCap,
      color: 'text-orange-600'
    }
  };

  /**
   * EN: Handles getting AI assistance for mobile money payment
   * FR: Gère l'obtention d'assistance IA pour le paiement mobile money
   */
  const handleGetAssistance = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(
        language === 'wo' ? 'Bind xaalis bi' : 'Veuillez entrer un montant',
        {
          description: language === 'wo' 
            ? 'Xaalis bi dafa war a bari'
            : 'Le montant doit être supérieur à 0'
        }
      );
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('💳 Requesting mobile money AI assistance:', {
        amount: parseFloat(amount),
        context,
        language,
        userId,
        location
      });

      // EN: Call the mobile money AI service
      // FR: Appeler le service IA mobile money
      const response = await EnhancedChatAIService.getMobileMoneyAssistance(
        parseFloat(amount),
        context,
        language,
        userId,
        location
      );

      setAiResponse(response);
      
      // EN: Auto-select the first recommended provider
      // FR: Sélectionner automatiquement le premier provider recommandé
      if (response.providerRecommendations && response.providerRecommendations.length > 0) {
        setSelectedProvider(response.providerRecommendations[0].name);
      }

      toast.success(
        language === 'wo' ? 'Sañ-sañ yu baax am' : 'Recommandations prêtes',
        {
          description: language === 'wo'
            ? `${response.providerRecommendations.length} provider yu baax`
            : `${response.providerRecommendations.length} providers recommandés`
        }
      );

    } catch (error) {
      console.error('❌ Error getting mobile money assistance:', error);
      
      toast.error(
        language === 'wo' ? 'Problema am' : 'Erreur',
        {
          description: language === 'wo'
            ? 'Jànga koy seeti'
            : 'Veuillez réessayer'
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * EN: Toggles between French and Wolof languages
   * FR: Bascule entre les langues française et wolof
   */
  const toggleLanguage = () => {
    const newLanguage = language === 'fr' ? 'wo' : 'fr';
    setLanguage(newLanguage);
    
    // EN: Clear previous results when changing language
    // FR: Effacer les résultats précédents lors du changement de langue
    setAiResponse(null);
    
    toast.info(
      newLanguage === 'wo' ? 'Wolof la' : 'Français sélectionné',
      {
        description: newLanguage === 'wo' 
          ? 'Yàgg nga mobile money assistance'
          : 'Assistance mobile money disponible'
      }
    );
  };

  /**
   * EN: Gets the risk level color based on fraud check
   * FR: Obtient la couleur du niveau de risque basé sur la vérification de fraude
   */
  const getRiskLevelColor = (riskScore: number) => {
    if (riskScore <= 25) return 'text-green-600';
    if (riskScore <= 50) return 'text-yellow-600';
    if (riskScore <= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* EN: Main input card / FR: Carte de saisie principale */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              {language === 'wo' ? 'Assistant Mobile Money' : 'Assistant Mobile Money'}
            </CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              {language.toUpperCase()}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* EN: Amount input / FR: Saisie du montant */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'wo' ? 'Xaalis bi' : 'Montant'} (FCFA)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={language === 'wo' ? 'Bind xaalis bi...' : 'Entrez le montant...'}
              className="text-lg"
            />
          </div>

          {/* EN: Context selection / FR: Sélection du contexte */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'wo' ? 'Fey lu tax?' : 'Type de paiement'}
            </label>
            <Select value={context} onValueChange={(value: PaymentContext) => setContext(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(contextOptions).map(([key, option]) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${option.color}`} />
                        {option[language]}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* EN: Get assistance button / FR: Bouton d'obtention d'assistance */}
          <Button 
            onClick={handleGetAssistance} 
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading && <Zap className="h-4 w-4 mr-2 animate-spin" />}
            <Smartphone className="h-4 w-4 mr-2" />
            {language === 'wo' ? 'Yàgg assistance' : 'Obtenir une assistance'}
          </Button>
        </CardContent>
      </Card>

      {/* EN: AI Response display / FR: Affichage de la réponse IA */}
      {aiResponse && (
        <div className="space-y-4">
          {/* EN: Cultural message / FR: Message culturel */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-blue-600">
                  {aiResponse.culturalMessages.main_message}
                </p>
                <p className="text-sm text-gray-600">
                  {aiResponse.culturalMessages.encouragement}
                </p>
                <Badge variant="outline" className="inline-flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {aiResponse.culturalMessages.security}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* EN: Fraud check and risk assessment / FR: Vérification de fraude et évaluation des risques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {language === 'wo' ? 'Xalaat sécurité' : 'Vérification Sécurité'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {aiResponse.fraudCheck.amount_reasonable ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">
                    {language === 'wo' ? 'Xaalis bu baax' : 'Montant raisonnable'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-medium ${getRiskLevelColor(aiResponse.fraudCheck.risk_score)}`}>
                    {language === 'wo' ? 'Risque:' : 'Risque:'} {aiResponse.fraudCheck.risk_score}%
                  </div>
                </div>
              </div>
              
              <Badge 
                variant={aiResponse.fraudCheck.status === 'approved' ? 'default' : 'destructive'}
                className="mt-2"
              >
                {aiResponse.fraudCheck.status === 'approved' 
                  ? (language === 'wo' ? 'Mën na' : 'Approuvé')
                  : (language === 'wo' ? 'Xalaat la' : 'Révision requise')
                }
              </Badge>
            </CardContent>
          </Card>

          {/* EN: Provider recommendations / FR: Recommandations de providers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                {language === 'wo' ? 'Providers yu baax' : 'Providers Recommandés'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiResponse.providerRecommendations.map((provider, index) => (
                  <div 
                    key={provider.name}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProvider === provider.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProvider(provider.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            {provider.speed}
                            <Separator orientation="vertical" className="h-3" />
                            <span>{provider.reliability}% {language === 'wo' ? 'fiable' : 'fiable'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign className="h-4 w-4" />
                          {provider.fees} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          {language === 'wo' ? 'fees' : 'frais'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* EN: Tips and alternatives / FR: Conseils et alternatives */}
          {(aiResponse.tips.length > 0 || aiResponse.alternatives.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {language === 'wo' ? 'Sañ-sañ ak tips' : 'Conseils et Alternatives'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* EN: Tips section / FR: Section conseils */}
                {aiResponse.tips.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === 'wo' ? 'Tips yu nees' : 'Conseils Utiles'}
                    </h4>
                    <ul className="space-y-1">
                      {aiResponse.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* EN: Alternatives section / FR: Section alternatives */}
                {aiResponse.alternatives.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === 'wo' ? 'Yeneen sàñ-sañ' : 'Alternatives'}
                    </h4>
                    <div className="space-y-2">
                      {aiResponse.alternatives.map((alternative, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">{alternative.description}</p>
                          {alternative.amounts && (
                            <p className="text-xs text-gray-600 mt-1">
                              {language === 'wo' ? 'Paiement:' : 'Paiements:'} {alternative.amounts.join(' + ')} FCFA
                            </p>
                          )}
                          {alternative.savings && (
                            <Badge variant="outline" className="mt-1">
                              {language === 'wo' ? 'Économie:' : 'Économie:'} {alternative.savings} FCFA
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
