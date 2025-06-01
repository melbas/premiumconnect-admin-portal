
import React from 'react';
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
  Gift,
  ArrowRight
} from 'lucide-react';
import { usePortalConfigStore } from '@/stores/portalConfigStore';

const PortalPreview: React.FC = () => {
  const { currentConfig, previewDevice } = usePortalConfigStore();
  const { branding, authMethods, engagementModules, paymentModules } = currentConfig;

  const enabledAuthMethods = authMethods.filter(method => method.enabled);
  const enabledModules = engagementModules
    .filter(module => module.enabled)
    .sort((a, b) => a.order - b.order);

  const getDeviceClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      case 'desktop':
        return 'w-full h-[600px] max-w-4xl';
      default:
        return 'w-[375px] h-[667px]';
    }
  };

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

  return (
    <div className="flex justify-center p-4">
      <Card 
        className={`${getDeviceClass()} border-2 shadow-lg overflow-hidden`}
        style={{ 
          backgroundColor: branding.backgroundColor,
          color: branding.textColor,
          fontFamily: branding.fontFamily
        }}
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div 
            className="p-6 text-center border-b"
            style={{ backgroundColor: branding.primaryColor, color: 'white' }}
          >
            <Wifi className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">WiFi Coumba Lamb</h1>
            <p className="text-sm opacity-90">Ngir am jokko pur internet bi</p>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Welcome Module */}
            {enabledModules.find(m => m.id === 'welcome') && (
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Bienvenue!</h2>
                <p className="text-sm text-muted-foreground">
                  Connectez-vous pour profiter d'un internet rapide et gratuit
                </p>
              </div>
            )}

            {/* Authentication Methods */}
            <div className="space-y-4">
              <h3 className="font-medium">Choisir votre méthode de connexion</h3>
              
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
                    style={{ borderColor: branding.primaryColor }}
                  >
                    <IconComponent className="h-5 w-5" />
                    Continuer avec {method.name.replace(' Login', '')}
                  </Button>
                );
              })}

              {/* Email/SMS Auth */}
              {enabledAuthMethods.find(method => method.id === 'email') && (
                <div className="space-y-3">
                  <Input placeholder="Votre email" />
                  <Input type="password" placeholder="Mot de passe" />
                </div>
              )}

              {enabledAuthMethods.find(method => method.id === 'sms') && (
                <div className="space-y-3">
                  <Input placeholder="Numéro de téléphone" />
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ borderColor: branding.primaryColor }}
                  >
                    Recevoir le code
                  </Button>
                </div>
              )}
            </div>

            {/* Engagement Modules Preview */}
            {enabledModules.map(module => (
              <div key={module.id} className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  {module.id === 'ads' && <Gift className="h-4 w-4" />}
                  {module.id === 'games' && <Smartphone className="h-4 w-4" />}
                  {module.id === 'mobile_money' && <CreditCard className="h-4 w-4" />}
                  {module.id === 'ai_chat' && <MessageCircle className="h-4 w-4" />}
                  <span className="text-sm font-medium">{module.name}</span>
                  <Badge variant="secondary" className="ml-auto">Optionnel</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {module.id === 'ads' && 'Regardez une courte publicité pour gagner du temps gratuit'}
                  {module.id === 'games' && 'Jouez à des mini-jeux pour débloquer des récompenses'}
                  {module.id === 'mobile_money' && 'Achetez des pass internet avec Mobile Money'}
                  {module.id === 'ai_chat' && 'Besoin d\'aide? Notre assistant IA est là pour vous'}
                </p>
              </div>
            ))}

            {/* Terms & Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm">
                J'accepte les conditions d'utilisation
              </label>
            </div>

            {/* Connect Button */}
            <Button 
              className="w-full"
              style={{ backgroundColor: branding.primaryColor }}
            >
              Se connecter au WiFi
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Powered by WiFi Sénégal
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalPreview;
