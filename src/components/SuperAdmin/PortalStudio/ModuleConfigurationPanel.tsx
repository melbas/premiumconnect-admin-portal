
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Wifi, 
  Video, 
  GamepadIcon, 
  MessageSquare, 
  Gift, 
  Star, 
  Users, 
  CreditCard, 
  Bell, 
  Share2, 
  Trophy, 
  Clock,
  Shield,
  Target,
  Zap
} from 'lucide-react';

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'authentication' | 'engagement' | 'monetization' | 'analytics' | 'social';
  enabled: boolean;
  required?: boolean;
  premium?: boolean;
}

const availableModules: ModuleConfig[] = [
  // Authentication Modules
  {
    id: 'auth_wifi',
    name: 'Connexion WiFi',
    description: 'Authentification WiFi de base',
    icon: <Wifi className="w-4 h-4" />,
    category: 'authentication',
    enabled: true,
    required: true
  },
  {
    id: 'auth_social',
    name: 'Connexion Sociale',
    description: 'Connexion via Facebook, Google, etc.',
    icon: <Share2 className="w-4 h-4" />,
    category: 'authentication',
    enabled: false
  },
  {
    id: 'auth_sms',
    name: 'Vérification SMS',
    description: 'Authentification par SMS',
    icon: <MessageSquare className="w-4 h-4" />,
    category: 'authentication',
    enabled: false
  },

  // Engagement Modules
  {
    id: 'video_ads',
    name: 'Publicités Vidéo',
    description: 'Diffusion de vidéos publicitaires',
    icon: <Video className="w-4 h-4" />,
    category: 'engagement',
    enabled: true
  },
  {
    id: 'quiz_module',
    name: 'Quiz Interactifs',
    description: 'Quiz et sondages pour les utilisateurs',
    icon: <Target className="w-4 h-4" />,
    category: 'engagement',
    enabled: false
  },
  {
    id: 'games',
    name: 'Mini-Jeux',
    description: 'Jeux simples pour engager les utilisateurs',
    icon: <GamepadIcon className="w-4 h-4" />,
    category: 'engagement',
    enabled: false
  },
  {
    id: 'loyalty_program',
    name: 'Programme de Fidélité',
    description: 'Points et récompenses',
    icon: <Star className="w-4 h-4" />,
    category: 'engagement',
    enabled: false
  },
  {
    id: 'referral_system',
    name: 'Système de Parrainage',
    description: 'Parrainage d\'amis pour des bonus',
    icon: <Users className="w-4 h-4" />,
    category: 'engagement',
    enabled: false
  },

  // Monetization Modules
  {
    id: 'payment_plans',
    name: 'Plans Payants',
    description: 'Forfaits WiFi premium',
    icon: <CreditCard className="w-4 h-4" />,
    category: 'monetization',
    enabled: false,
    premium: true
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'Intégration Orange Money, Wave',
    icon: <Zap className="w-4 h-4" />,
    category: 'monetization',
    enabled: false,
    premium: true
  },
  {
    id: 'voucher_system',
    name: 'Système de Vouchers',
    description: 'Codes d\'accès WiFi',
    icon: <Gift className="w-4 h-4" />,
    category: 'monetization',
    enabled: false
  },

  // Analytics Modules
  {
    id: 'user_analytics',
    name: 'Analytics Utilisateurs',
    description: 'Suivi du comportement utilisateur',
    icon: <Trophy className="w-4 h-4" />,
    category: 'analytics',
    enabled: true
  },
  {
    id: 'session_tracking',
    name: 'Suivi de Session',
    description: 'Durée et qualité des sessions',
    icon: <Clock className="w-4 h-4" />,
    category: 'analytics',
    enabled: true
  },

  // Social Modules
  {
    id: 'chat_support',
    name: 'Chat Support',
    description: 'Support client intégré',
    icon: <MessageSquare className="w-4 h-4" />,
    category: 'social',
    enabled: false
  },
  {
    id: 'notifications',
    name: 'Notifications Push',
    description: 'Notifications en temps réel',
    icon: <Bell className="w-4 h-4" />,
    category: 'social',
    enabled: false
  },
  {
    id: 'security_alerts',
    name: 'Alertes Sécurité',
    description: 'Alertes de sécurité et fraude',
    icon: <Shield className="w-4 h-4" />,
    category: 'analytics',
    enabled: false,
    premium: true
  }
];

const categoryLabels = {
  authentication: 'Authentification',
  engagement: 'Engagement',
  monetization: 'Monétisation',
  analytics: 'Analytics',
  social: 'Social & Support'
};

const categoryColors = {
  authentication: 'bg-blue-500',
  engagement: 'bg-green-500',
  monetization: 'bg-yellow-500',
  analytics: 'bg-purple-500',
  social: 'bg-pink-500'
};

export function ModuleConfigurationPanel() {
  const [modules, setModules] = useState<ModuleConfig[]>(availableModules);

  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId && !module.required
        ? { ...module, enabled: !module.enabled }
        : module
    ));
  };

  const modulesByCategory = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, ModuleConfig[]>);

  const enabledModulesCount = modules.filter(m => m.enabled).length;
  const totalModulesCount = modules.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Configuration des Modules</h3>
          <p className="text-sm text-muted-foreground">
            Activez ou désactivez les fonctionnalités de votre portail captif
          </p>
        </div>
        <Badge variant="secondary">
          {enabledModulesCount}/{totalModulesCount} modules actifs
        </Badge>
      </div>

      <div className="grid gap-6">
        {Object.entries(modulesByCategory).map(([category, categoryModules]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`} />
                {categoryLabels[category as keyof typeof categoryLabels]}
                <Badge variant="outline" className="ml-auto">
                  {categoryModules.filter(m => m.enabled).length}/{categoryModules.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryModules.map((module, index) => (
                <div key={module.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        {module.icon}
                        <Checkbox
                          id={module.id}
                          checked={module.enabled}
                          onCheckedChange={() => toggleModule(module.id)}
                          disabled={module.required}
                        />
                      </div>
                      <div className="flex-1">
                        <Label 
                          htmlFor={module.id} 
                          className="text-sm font-medium cursor-pointer flex items-center gap-2"
                        >
                          {module.name}
                          {module.required && (
                            <Badge variant="outline" className="text-xs">Requis</Badge>
                          )}
                          {module.premium && (
                            <Badge variant="default" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500">
                              Premium
                            </Badge>
                          )}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => toggleModule(module.id)}
                      disabled={module.required}
                    />
                  </div>
                  {index < categoryModules.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h4 className="font-medium">Configuration Prête</h4>
            <p className="text-sm text-muted-foreground">
              Votre portail captif est configuré avec {enabledModulesCount} modules actifs.
              Les modifications seront appliquées automatiquement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
