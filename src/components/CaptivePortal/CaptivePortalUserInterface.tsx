
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Wifi, 
  Facebook, 
  Globe, 
  Smartphone, 
  MessageCircle,
  CreditCard,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { usePortalConfigStore } from '@/stores/portalConfigStore';
import { MobileMoneyAssistant } from '@/components/AI/MobileMoneyAssistant';
import { EnhancedChatSection } from '@/components/Dashboard/Sections/EnhancedChatSection';
import AIOnboardingAssistant from '@/components/Dashboard/CaptivePortal/AIOnboardingAssistant';
import { useToast } from '@/hooks/use-toast';

interface CaptivePortalUserInterfaceProps {
  configId?: string;
  onConnect?: () => void;
}

enum PortalStep {
  LOADING = 'loading',
  WELCOME = 'welcome',
  AUTH = 'auth',
  MOBILE_MONEY = 'mobile_money',
  AI_CHAT = 'ai_chat',
  ADS = 'ads',
  GAMES = 'games',
  SURVEYS = 'surveys',
  SUCCESS = 'success'
}

const CaptivePortalUserInterface: React.FC<CaptivePortalUserInterfaceProps> = ({
  configId = 'default',
  onConnect
}) => {
  const { currentConfig, loadConfiguration } = usePortalConfigStore();
  const [currentStep, setCurrentStep] = useState<PortalStep>(PortalStep.LOADING);
  const [userData, setUserData] = useState({
    email: '',
    phone: '',
    acceptedTerms: false
  });
  const { toast } = useToast();

  useEffect(() => {
    if (configId) {
      loadConfiguration(configId).then(() => {
        setCurrentStep(PortalStep.WELCOME);
      });
    }
  }, [configId, loadConfiguration]);

  const enabledModules = currentConfig.engagementModules
    .filter(module => module.enabled)
    .sort((a, b) => a.order - b.order);

  const getAuthMethodIcon = (methodId: string) => {
    const icons = {
      facebook: Facebook,
      google: Globe,
      linkedin: Globe,
      twitter: Globe,
      email: MessageCircle,
      sms: Smartphone,
      radius: Wifi,
    };
    return icons[methodId as keyof typeof icons] || Globe;
  };

  const handleNextStep = () => {
    const currentIndex = enabledModules.findIndex(m => m.id === currentStep);
    
    if (currentStep === PortalStep.WELCOME || currentStep === PortalStep.AUTH) {
      // Aller au premier module d'engagement
      if (enabledModules.length > 0) {
        setCurrentStep(enabledModules[0].id as PortalStep);
      } else {
        setCurrentStep(PortalStep.SUCCESS);
      }
    } else if (currentIndex >= 0 && currentIndex < enabledModules.length - 1) {
      // Aller au module suivant
      setCurrentStep(enabledModules[currentIndex + 1].id as PortalStep);
    } else {
      // Terminé - connecter au WiFi
      setCurrentStep(PortalStep.SUCCESS);
      handleWifiConnect();
    }
  };

  const handleWifiConnect = () => {
    toast({
      title: "Connexion WiFi",
      description: "Vous êtes maintenant connecté au réseau WiFi !",
    });
    onConnect?.();
  };

  const handleAuthSubmit = () => {
    if (!userData.acceptedTerms) {
      toast({
        title: "Conditions requises",
        description: "Veuillez accepter les conditions d'utilisation.",
        variant: "destructive"
      });
      return;
    }
    handleNextStep();
  };

  const renderCurrentStep = () => {
    if (currentStep === PortalStep.LOADING) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement du portail...</span>
        </div>
      );
    }

    if (currentStep === PortalStep.WELCOME) {
      return (
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Bienvenue!</h2>
            <p className="text-muted-foreground mb-6">
              Connectez-vous pour profiter d'un internet rapide et gratuit
            </p>
            
            {/* AI Onboarding Assistant si activé */}
            {enabledModules.find(m => m.id === 'ai_onboarding') && (
              <div className="mb-6">
                <AIOnboardingAssistant />
              </div>
            )}
          </div>

          <Button 
            onClick={() => setCurrentStep(PortalStep.AUTH)}
            className="w-full"
            style={{ backgroundColor: currentConfig.branding.primaryColor }}
          >
            Commencer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (currentStep === PortalStep.AUTH) {
      const enabledAuthMethods = currentConfig.authMethods.filter(method => method.enabled);
      
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-center">Méthode de connexion</h3>
          
          {/* Social Login Buttons */}
          {enabledAuthMethods.filter(method => 
            ['facebook', 'google', 'linkedin', 'twitter'].includes(method.id)
          ).map(method => {
            const IconComponent = getAuthMethodIcon(method.id);
            return (
              <Button 
                key={method.id}
                variant="outline" 
                className="w-full flex items-center gap-3"
                style={{ borderColor: currentConfig.branding.primaryColor }}
                onClick={handleAuthSubmit}
              >
                <IconComponent className="h-5 w-5" />
                Continuer avec {method.name.replace(' Login', '')}
              </Button>
            );
          })}

          {/* Email/SMS Auth */}
          {enabledAuthMethods.find(method => method.id === 'email') && (
            <div className="space-y-3">
              <Input 
                placeholder="Votre email" 
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          )}

          {enabledAuthMethods.find(method => method.id === 'sms') && (
            <div className="space-y-3">
              <Input 
                placeholder="Numéro de téléphone" 
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={userData.acceptedTerms}
              onCheckedChange={(checked) => 
                setUserData(prev => ({ ...prev, acceptedTerms: !!checked }))
              }
            />
            <label htmlFor="terms" className="text-sm">
              J'accepte les conditions d'utilisation
            </label>
          </div>

          <Button 
            onClick={handleAuthSubmit}
            className="w-full"
            style={{ backgroundColor: currentConfig.branding.primaryColor }}
            disabled={!userData.acceptedTerms}
          >
            Se connecter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (currentStep === PortalStep.MOBILE_MONEY) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Assistant Mobile Money</h3>
            <Badge variant="secondary">Optionnel</Badge>
          </div>
          
          <MobileMoneyAssistant />
          
          <Button 
            onClick={handleNextStep}
            className="w-full mt-4"
            variant="outline"
          >
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (currentStep === PortalStep.AI_CHAT) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Assistant IA</h3>
            <Badge variant="secondary">Optionnel</Badge>
          </div>
          
          <div className="h-96">
            <EnhancedChatSection />
          </div>
          
          <Button 
            onClick={handleNextStep}
            className="w-full"
            variant="outline"
          >
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (currentStep === PortalStep.SUCCESS) {
      return (
        <div className="text-center space-y-6">
          <div className="text-green-600 mb-4">
            <Wifi className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Connexion réussie!</h2>
            <p className="text-muted-foreground mt-2">
              Vous êtes maintenant connecté au réseau WiFi
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm">
              Profitez de votre navigation internet gratuite
            </p>
          </div>
        </div>
      );
    }

    // Autres modules d'engagement
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-semibold">
          Module: {enabledModules.find(m => m.id === currentStep)?.name}
        </h3>
        <div className="bg-muted/30 p-8 rounded-lg">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Contenu du module à venir...
          </p>
        </div>
        <Button 
          onClick={handleNextStep}
          className="w-full"
          style={{ backgroundColor: currentConfig.branding.primaryColor }}
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md border-2 shadow-lg"
        style={{ 
          backgroundColor: currentConfig.branding.backgroundColor,
          color: currentConfig.branding.textColor,
          fontFamily: currentConfig.branding.fontFamily
        }}
      >
        {/* Header */}
        <div 
          className="p-6 text-center border-b text-white"
          style={{ backgroundColor: currentConfig.branding.primaryColor }}
        >
          <Wifi className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">WiFi {currentConfig.name}</h1>
          <p className="text-sm opacity-90">Internet gratuit et rapide</p>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          {renderCurrentStep()}
        </CardContent>

        {/* Footer */}
        <div className="p-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Powered by WiFi Sénégal
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CaptivePortalUserInterface;
