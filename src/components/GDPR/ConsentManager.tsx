import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, Cookie, Users, BarChart3, Mail, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  geolocation: boolean;
  dataRetention: number; // en jours
  cookieExpiry: number; // en jours
  lastUpdated: string;
}

interface ConsentManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConsentUpdate: (settings: ConsentSettings) => void;
  currentSettings?: ConsentSettings;
}

const ConsentManager: React.FC<ConsentManagerProps> = ({
  open,
  onOpenChange,
  onConsentUpdate,
  currentSettings
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ConsentSettings>({
    necessary: true, // Toujours requis
    analytics: false,
    marketing: false,
    functional: false,
    geolocation: false,
    dataRetention: 365,
    cookieExpiry: 30,
    lastUpdated: new Date().toISOString(),
    ...currentSettings
  });

  const [showDetails, setShowDetails] = useState(false);

  const consentCategories = [
    {
      id: 'necessary',
      title: 'Cookies nécessaires',
      description: 'Requis pour le fonctionnement du portail WiFi',
      icon: Shield,
      required: true,
      details: 'Ces cookies sont essentiels pour vous permettre de naviguer sur le site et d\'utiliser ses fonctionnalités, comme l\'accès aux zones sécurisées.'
    },
    {
      id: 'analytics',
      title: 'Cookies analytiques',
      description: 'Nous aident à améliorer nos services',
      icon: BarChart3,
      required: false,
      details: 'Ces cookies collectent des informations sur la façon dont les visiteurs utilisent le site, par exemple les pages les plus consultées.'
    },
    {
      id: 'marketing',
      title: 'Cookies marketing',
      description: 'Pour personnaliser votre expérience',
      icon: Mail,
      required: false,
      details: 'Ces cookies sont utilisés pour vous proposer des publicités pertinentes et personnalisées.'
    },
    {
      id: 'functional',
      title: 'Cookies fonctionnels',
      description: 'Améliorent votre expérience utilisateur',
      icon: Users,
      required: false,
      details: 'Ces cookies permettent au site de mémoriser vos choix et de fournir des fonctionnalités améliorées.'
    },
    {
      id: 'geolocation',
      title: 'Géolocalisation',
      description: 'Pour des services basés sur votre position',
      icon: MapPin,
      required: false,
      details: 'Nous utilisons votre position pour vous proposer des services adaptés à votre localisation.'
    }
  ];

  const handleConsentChange = (categoryId: keyof ConsentSettings, value: boolean) => {
    if (categoryId === 'necessary') return; // Toujours requis
    
    setSettings(prev => ({
      ...prev,
      [categoryId]: value,
      lastUpdated: new Date().toISOString()
    }));
  };

  const handleSaveConsent = () => {
    onConsentUpdate(settings);
    localStorage.setItem('wifisenegal_consent', JSON.stringify(settings));
    
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences de confidentialité ont été mises à jour.",
    });
    
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      geolocation: true,
      dataRetention: 365,
      cookieExpiry: 30,
      lastUpdated: new Date().toISOString()
    };
    
    setSettings(allAccepted);
    onConsentUpdate(allAccepted);
    localStorage.setItem('wifisenegal_consent', JSON.stringify(allAccepted));
    
    toast({
      title: "Tous les cookies acceptés",
      description: "Merci ! Cela nous aide à améliorer votre expérience.",
    });
    
    onOpenChange(false);
  };

  const handleRejectOptional = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      geolocation: false,
      dataRetention: 30,
      cookieExpiry: 7,
      lastUpdated: new Date().toISOString()
    };
    
    setSettings(minimalConsent);
    onConsentUpdate(minimalConsent);
    localStorage.setItem('wifisenegal_consent', JSON.stringify(minimalConsent));
    
    toast({
      title: "Préférences minimales appliquées",
      description: "Seuls les cookies nécessaires seront utilisés.",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Gestion de la confidentialité
          </DialogTitle>
          <DialogDescription>
            Nous respectons votre vie privée. Choisissez quelles données nous pouvons collecter et utiliser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Résumé des paramètres actuels */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">État actuel</CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Mis à jour: {new Date(settings.lastUpdated).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              {Object.entries(settings).filter(([key]) => 
                ['necessary', 'analytics', 'marketing', 'functional', 'geolocation'].includes(key)
              ).map(([key, value]) => (
                <Badge 
                  key={key} 
                  variant={value ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {consentCategories.find(c => c.id === key)?.title} 
                  {value ? ' ✓' : ' ✗'}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* Catégories de consentement */}
          <div className="space-y-3">
            {consentCategories.map((category) => {
              const Icon = category.icon;
              const isChecked = settings[category.id as keyof ConsentSettings] as boolean;
              
              return (
                <Card key={category.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        <Icon className={`h-5 w-5 mt-0.5 ${
                          isChecked ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{category.title}</h4>
                            {category.required && (
                              <Badge variant="destructive" className="text-xs">Requis</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          {showDetails && (
                            <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              {category.details}
                            </p>
                          )}
                        </div>
                      </div>
                      <Checkbox
                        checked={isChecked}
                        disabled={category.required}
                        onCheckedChange={(checked) => 
                          handleConsentChange(category.id as keyof ConsentSettings, checked as boolean)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Options avancées */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Options avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Rétention des données</span>
                <Badge variant="outline">{settings.dataRetention} jours</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Durée des cookies</span>
                <Badge variant="outline">{settings.cookieExpiry} jours</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button onClick={handleAcceptAll} className="flex-1">
                Tout accepter
              </Button>
              <Button onClick={handleRejectOptional} variant="outline" className="flex-1">
                Rejeter optionnels
              </Button>
            </div>
            <Button onClick={handleSaveConsent} variant="secondary" className="w-full">
              Sauvegarder mes choix
            </Button>
            <Button 
              onClick={() => setShowDetails(!showDetails)} 
              variant="ghost" 
              className="w-full text-xs"
            >
              {showDetails ? 'Masquer' : 'Voir'} les détails
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentManager;