import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Video, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Gift, 
  Users, 
  CreditCard,
  Smartphone,
  Mail,
  Gamepad2,
  Settings,
  Eye,
  Play,
  PlusCircle,
  Trash2,
  Palette,
  Languages,
  Wifi
} from 'lucide-react';

// Types pour la configuration du parcours client
interface StepConfig {
  id: string;
  name: string;
  type: 'auth' | 'engagement' | 'success' | 'extend-time' | 'dashboard' | 'rewards' | 'family-management' | 'payment';
  enabled: boolean;
  required: boolean;
  order: number;
  config: any;
}

interface AuthConfig {
  sms_enabled: boolean;
  email_enabled: boolean;
  referral_enabled: boolean;
  max_attempts: number;
  timeout_seconds: number;
  session_duration_minutes: number;
  auto_disconnect: boolean;
  country_code: string;
  phone_validation: boolean;
}

interface EngagementConfig {
  type: 'video' | 'quiz';
  required: boolean;
  min_completion_rate: number;
  skip_after_seconds?: number;
  content_id?: string;
  auto_advance: boolean;
}

interface VisualConfig {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  border_radius: string;
  gradient_enabled: boolean;
  glass_effect: boolean;
}

interface LanguageConfig {
  default_language: string;
  available_languages: string[];
  auto_detect: boolean;
  rtl_support: boolean;
}

const CustomerJourneyPanel: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string>('auth');
  
  // Configuration par défaut des étapes
  const [journeySteps, setJourneySteps] = useState<StepConfig[]>([
    {
      id: 'auth',
      name: 'Authentification',
      type: 'auth',
      enabled: true,
      required: true,
      order: 1,
      config: {
        sms_enabled: true,
        email_enabled: true,
        referral_enabled: false,
        max_attempts: 3,
        timeout_seconds: 300,
        session_duration_minutes: 60,
        auto_disconnect: true,
        country_code: '+221',
        phone_validation: true
      }
    },
    {
      id: 'engagement',
      name: 'Contenu Engagement',
      type: 'engagement',
      enabled: true,
      required: true,
      order: 2,
      config: {
        type: 'video',
        required: true,
        min_completion_rate: 80,
        skip_after_seconds: 30,
        auto_advance: true
      }
    },
    {
      id: 'success',
      name: 'Accès Accordé',
      type: 'success',
      enabled: true,
      required: true,
      order: 3,
      config: {
        show_speed_test: true,
        show_support_button: true,
        whatsapp_support: true,
        auto_redirect_seconds: 5
      }
    }
  ]);

  // Configuration visuelle basée sur l'image
  const [visualConfig, setVisualConfig] = useState<VisualConfig>({
    primary_color: '#5B4DFF', // Bleu-violet du gradient
    secondary_color: '#FF4D6A', // Rose-rouge du gradient
    background_color: '#F5F6FA',
    text_color: '#1A1A1A',
    font_family: 'Montserrat',
    border_radius: '0.75rem',
    gradient_enabled: true,
    glass_effect: true
  });

  // Configuration multilingue
  const [languageConfig, setLanguageConfig] = useState<LanguageConfig>({
    default_language: 'fr',
    available_languages: ['fr', 'en', 'ar', 'wo'], // Wolof pour le Sénégal
    auto_detect: true,
    rtl_support: true
  });

  const updateStepConfig = (stepId: string, configKey: string, value: any) => {
    setJourneySteps(steps => 
      steps.map(step => 
        step.id === stepId 
          ? { ...step, config: { ...step.config, [configKey]: value } }
          : step
      )
    );
  };

  const updateVisualConfig = (key: keyof VisualConfig, value: any) => {
    setVisualConfig(prev => ({ ...prev, [key]: value }));
  };

  const renderAuthConfig = () => {
    const authStep = journeySteps.find(s => s.id === 'auth');
    if (!authStep) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Méthodes d'Authentification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-auth">Authentification SMS</Label>
              <Switch
                id="sms-auth"
                checked={authStep.config.sms_enabled}
                onCheckedChange={(checked) => updateStepConfig('auth', 'sms_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-auth">Authentification Email</Label>
              <Switch
                id="email-auth"
                checked={authStep.config.email_enabled}
                onCheckedChange={(checked) => updateStepConfig('auth', 'email_enabled', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country-code">Code Pays par Défaut</Label>
                <Select
                  value={authStep.config.country_code}
                  onValueChange={(value) => updateStepConfig('auth', 'country_code', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+221">🇸🇳 +221 (Sénégal)</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33 (France)</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1 (USA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max-attempts">Tentatives Maximum</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  value={authStep.config.max_attempts}
                  onChange={(e) => updateStepConfig('auth', 'max_attempts', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeout">Timeout (secondes)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={authStep.config.timeout_seconds}
                  onChange={(e) => updateStepConfig('auth', 'timeout_seconds', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="session-duration">Durée Session (minutes)</Label>
                <Input
                  id="session-duration"
                  type="number"
                  value={authStep.config.session_duration_minutes}
                  onChange={(e) => updateStepConfig('auth', 'session_duration_minutes', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEngagementConfig = () => {
    const engagementStep = journeySteps.find(s => s.id === 'engagement');
    if (!engagementStep) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Configuration du Contenu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="engagement-type">Type de Contenu</Label>
              <Select
                value={engagementStep.config.type}
                onValueChange={(value) => updateStepConfig('engagement', 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vidéo Publicitaire</SelectItem>
                  <SelectItem value="quiz">Quiz Interactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="content-required">Contenu Obligatoire</Label>
              <Switch
                id="content-required"
                checked={engagementStep.config.required}
                onCheckedChange={(checked) => updateStepConfig('engagement', 'required', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="completion-rate">Taux de Completion Min (%)</Label>
                <Input
                  id="completion-rate"
                  type="number"
                  value={engagementStep.config.min_completion_rate}
                  onChange={(e) => updateStepConfig('engagement', 'min_completion_rate', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="skip-after">Skip Après (secondes)</Label>
                <Input
                  id="skip-after"
                  type="number"
                  value={engagementStep.config.skip_after_seconds}
                  onChange={(e) => updateStepConfig('engagement', 'skip_after_seconds', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVisualConfig = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Configuration Visuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-color">Couleur Primaire</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={visualConfig.primary_color}
                    onChange={(e) => updateVisualConfig('primary_color', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={visualConfig.primary_color}
                    onChange={(e) => updateVisualConfig('primary_color', e.target.value)}
                    placeholder="#5B4DFF"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary-color">Couleur Secondaire</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={visualConfig.secondary_color}
                    onChange={(e) => updateVisualConfig('secondary_color', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={visualConfig.secondary_color}
                    onChange={(e) => updateVisualConfig('secondary_color', e.target.value)}
                    placeholder="#FF4D6A"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="font-family">Police de Caractères</Label>
              <Select
                value={visualConfig.font_family}
                onValueChange={(value) => updateVisualConfig('font_family', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Montserrat">Montserrat (Recommandé)</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="gradient-enabled">Gradient d'Arrière-plan</Label>
              <Switch
                id="gradient-enabled"
                checked={visualConfig.gradient_enabled}
                onCheckedChange={(checked) => updateVisualConfig('gradient_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="glass-effect">Effet de Verre (Glass)</Label>
              <Switch
                id="glass-effect"
                checked={visualConfig.glass_effect}
                onCheckedChange={(checked) => updateVisualConfig('glass_effect', checked)}
              />
            </div>

            {/* Aperçu des couleurs */}
            <div className="p-4 rounded-lg border">
              <Label className="text-sm font-medium">Aperçu du Gradient</Label>
              <div 
                className="h-20 rounded-lg mt-2"
                style={{
                  background: visualConfig.gradient_enabled 
                    ? `linear-gradient(135deg, ${visualConfig.primary_color} 0%, ${visualConfig.secondary_color} 100%)`
                    : visualConfig.primary_color
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLanguageConfig = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Configuration Multilingue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default-language">Langue par Défaut</Label>
              <Select
                value={languageConfig.default_language}
                onValueChange={(value) => setLanguageConfig(prev => ({ ...prev, default_language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                  <SelectItem value="wo">🇸🇳 Wolof</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-detect">Détection Automatique</Label>
              <Switch
                id="auto-detect"
                checked={languageConfig.auto_detect}
                onCheckedChange={(checked) => setLanguageConfig(prev => ({ ...prev, auto_detect: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="rtl-support">Support RTL (Arabe)</Label>
              <Switch
                id="rtl-support"
                checked={languageConfig.rtl_support}
                onCheckedChange={(checked) => setLanguageConfig(prev => ({ ...prev, rtl_support: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Parcours Client WiFi</h3>
          <p className="text-sm text-muted-foreground">
            Configuration complète du flow utilisateur selon les spécifications techniques
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          React 18.3.1 + TypeScript
        </Badge>
      </div>

      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Auth
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Visuel
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Langues
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Technique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auth">
          {renderAuthConfig()}
        </TabsContent>

        <TabsContent value="engagement">
          {renderEngagementConfig()}
        </TabsContent>

        <TabsContent value="visual">
          {renderVisualConfig()}
        </TabsContent>

        <TabsContent value="language">
          {renderLanguageConfig()}
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration Technique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Framework Frontend</Label>
                  <Badge variant="outline">React 18.3.1</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Build Tool</Label>
                  <Badge variant="outline">Vite</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Styling</Label>
                  <Badge variant="outline">Tailwind CSS</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Components</Label>
                  <Badge variant="outline">Shadcn/ui + Radix UI</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Variables CSS Générées</Label>
                <div className="bg-muted p-3 rounded-lg text-xs font-mono">
                  <div>--primary: {visualConfig.primary_color};</div>
                  <div>--secondary: {visualConfig.secondary_color};</div>
                  <div>--background: {visualConfig.background_color};</div>
                  <div>--radius: {visualConfig.border_radius};</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions de sauvegarde */}
      <div className="flex gap-2 pt-4 border-t">
        <Button className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          Prévisualiser
        </Button>
        <Button variant="outline" className="flex-1">
          Exporter Config
        </Button>
      </div>
    </div>
  );
};

export default CustomerJourneyPanel;
