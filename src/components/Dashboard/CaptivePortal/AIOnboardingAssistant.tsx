
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  CheckCircle, 
  ArrowRight, 
  Globe, 
  Brain,
  Users,
  Shield,
  Smartphone
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  titleWo?: string;
  description: string;
  descriptionWo?: string;
  icon: React.ReactNode;
  completed: boolean;
  aiTips: string[];
  culturalContext?: string;
}

interface AIOnboardingAssistantProps {
  language?: 'fr' | 'wo';
  userProfile?: {
    isFirstTime: boolean;
    deviceType: 'mobile' | 'desktop';
    connectionQuality: 'slow' | 'medium' | 'fast';
  };
  onStepComplete?: (stepId: string) => void;
}

const AIOnboardingAssistant: React.FC<AIOnboardingAssistantProps> = ({
  language = 'fr',
  userProfile = { isFirstTime: true, deviceType: 'mobile', connectionQuality: 'medium' },
  onStepComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const getSteps = (): OnboardingStep[] => [
    {
      id: 'welcome',
      title: 'Bienvenue sur notre WiFi',
      titleWo: 'Dalal ak WiFi bi',
      description: 'Nous vous souhaitons la bienvenue ! Laissez-nous vous guider.',
      descriptionWo: 'Dalal ngeen ! Nu ko wax la guidance.',
      icon: <Users className="w-6 h-6 text-blue-500" />,
      completed: false,
      aiTips: [
        'Cette connexion est optimisée pour les appareils mobiles sénégalais',
        'Nous respectons votre vie privée et vos données'
      ],
      culturalContext: 'Accueil chaleureux à la sénégalaise'
    },
    {
      id: 'device-check',
      title: 'Vérification de votre appareil',
      titleWo: 'Contrôle sa téléphone',
      description: 'Optimisation automatique pour votre connexion',
      descriptionWo: 'Optimization bu automation pour sa connexion',
      icon: <Smartphone className="w-6 h-6 text-green-500" />,
      completed: false,
      aiTips: userProfile.deviceType === 'mobile' 
        ? ['Connexion mobile détectée - mode économie activé', 'Qualité adaptée à la 3G/4G au Sénégal']
        : ['Connexion desktop - mode performance activé'],
      culturalContext: 'Adaptation locale aux conditions réseau'
    },
    {
      id: 'connection',
      title: 'Connexion WiFi',
      titleWo: 'Connexion WiFi',
      description: 'Établissement de votre connexion sécurisée',
      descriptionWo: 'Def sa connexion bu secured',
      icon: <Wifi className="w-6 h-6 text-purple-500" />,
      completed: false,
      aiTips: [
        'Connexion cryptée pour votre sécurité',
        'Vitesse adaptée selon la charge du réseau'
      ]
    },
    {
      id: 'security',
      title: 'Configuration sécurité',
      titleWo: 'Configuration sécurité',
      description: 'Protection de vos données personnelles',
      descriptionWo: 'Protection sa données personnel yi',
      icon: <Shield className="w-6 h-6 text-red-500" />,
      completed: false,
      aiTips: [
        'Vos données restent privées et ne sont pas partagées',
        'Navigation sécurisée selon les standards internationaux'
      ],
      culturalContext: 'Respect de la confidentialité familiale'
    }
  ];

  const [steps, setSteps] = useState<OnboardingStep[]>(getSteps());

  useEffect(() => {
    // Simulation de progression automatique pour la démo
    const timer = setInterval(() => {
      setSteps(prevSteps => {
        const currentStepIndex = prevSteps.findIndex(step => !step.completed);
        if (currentStepIndex === -1) return prevSteps;

        const updatedSteps = [...prevSteps];
        updatedSteps[currentStepIndex].completed = true;
        
        if (!completedSteps.includes(updatedSteps[currentStepIndex].id)) {
          setCompletedSteps(prev => [...prev, updatedSteps[currentStepIndex].id]);
          onStepComplete?.(updatedSteps[currentStepIndex].id);
        }

        if (currentStepIndex < steps.length - 1) {
          setCurrentStep(currentStepIndex + 1);
        }

        return updatedSteps;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const progress = (completedSteps.length / steps.length) * 100;
  const currentStepData = steps[currentStep];

  const getText = (fr: string, wo?: string) => {
    return language === 'wo' && wo ? wo : fr;
  };

  const getAIRecommendations = () => {
    const recommendations = [];
    
    if (userProfile.deviceType === 'mobile') {
      recommendations.push({
        title: 'Mode économie activé',
        description: 'Votre connexion est optimisée pour préserver votre forfait data'
      });
    }

    if (userProfile.connectionQuality === 'slow') {
      recommendations.push({
        title: 'Optimisation réseau',
        description: 'Contenu adapté pour une connexion plus fluide'
      });
    }

    recommendations.push({
      title: 'Contenu local privilégié',
      description: 'Accès prioritaire aux sites sénégalais et africains'
    });

    return recommendations;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            {getText('Assistant IA d\'accueil', 'Assistant IA bu dalal')}
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {language.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getText('Progression', 'Progression')}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Étape actuelle */}
          {currentStepData && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {currentStepData.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {getText(currentStepData.title, currentStepData.titleWo)}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {getText(currentStepData.description, currentStepData.descriptionWo)}
                  </p>
                  
                  {/* Conseils IA */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-700">
                      {getText('Conseils IA :', 'Conseils IA :')}
                    </p>
                    {currentStepData.aiTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contexte culturel */}
                  {currentStepData.culturalContext && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Contexte local :</strong> {currentStepData.culturalContext}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recommandations IA */}
          <div className="space-y-4">
            <h4 className="font-medium">
              {getText('Recommandations personnalisées', 'Recommendations bu personal')}
            </h4>
            <div className="grid gap-3">
              {getAIRecommendations().map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé des étapes */}
          <div className="space-y-3">
            <h4 className="font-medium">
              {getText('Étapes de connexion', 'Étapes bu connexion')}
            </h4>
            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-100 text-green-600'
                      : idx === currentStep
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    step.completed ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    {getText(step.title, step.titleWo)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIOnboardingAssistant;
