
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePortalConfigStore } from '@/stores/portalConfigStore';

export interface PortalTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  cultural?: boolean;
}

const predefinedThemes: PortalTheme[] = [
  {
    id: 'dakar-modern',
    name: 'Dakar Modern',
    description: 'Design moderne avec les couleurs actuelles du projet',
    preview: '🏙️',
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'teranga',
    name: 'Teranga',
    description: 'Couleurs chaudes sénégalaises, esprit accueillant',
    preview: '🌅',
    branding: {
      primaryColor: '#F97316',
      secondaryColor: '#EA580C',
      backgroundColor: '#FFF7ED',
      textColor: '#9A3412',
      fontFamily: 'Inter',
    },
    cultural: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Interface professionnelle sobre et efficace',
    preview: '💼',
    branding: {
      primaryColor: '#1F2937',
      secondaryColor: '#374151',
      backgroundColor: '#F9FAFB',
      textColor: '#111827',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Couleurs vives et interface ludique pour écoles',
    preview: '🎓',
    branding: {
      primaryColor: '#7C3AED',
      secondaryColor: '#5B21B6',
      backgroundColor: '#FAF5FF',
      textColor: '#581C87',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'fun',
    name: 'Fun',
    description: 'Design dynamique avec gamification',
    preview: '🎮',
    branding: {
      primaryColor: '#EC4899',
      secondaryColor: '#BE185D',
      backgroundColor: '#FDF2F8',
      textColor: '#831843',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Inspiré de la Casamance, tons verts naturels',
    preview: '🌿',
    branding: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      backgroundColor: '#F0FDF4',
      textColor: '#064E3B',
      fontFamily: 'Inter',
    },
    cultural: true,
  },
];

const ThemeSelector: React.FC = () => {
  const { currentConfig, updateBranding } = usePortalConfigStore();

  const applyTheme = (theme: PortalTheme) => {
    updateBranding(theme.branding);
  };

  const isCurrentTheme = (theme: PortalTheme) => {
    return currentConfig.branding.primaryColor === theme.branding.primaryColor;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {predefinedThemes.map((theme) => (
          <Card 
            key={theme.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              isCurrentTheme(theme) ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => applyTheme(theme)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme.preview}</span>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {theme.name}
                      {theme.cultural && (
                        <Badge variant="secondary" className="text-xs">
                          Culturel
                        </Badge>
                      )}
                      {isCurrentTheme(theme) && (
                        <Badge variant="default" className="text-xs">
                          Actuel
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Preview des couleurs */}
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: theme.branding.primaryColor }}
                  title="Couleur principale"
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: theme.branding.secondaryColor }}
                  title="Couleur secondaire"
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: theme.branding.backgroundColor }}
                  title="Arrière-plan"
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: theme.branding.textColor }}
                  title="Couleur du texte"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">Personnalisation avancée</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Sélectionnez un thème de base puis utilisez l'onglet "Style" pour personnaliser les couleurs, polices et CSS.
        </p>
        <Button variant="outline" size="sm" disabled>
          Créer un thème personnalisé
          <Badge variant="secondary" className="ml-2">Bientôt</Badge>
        </Button>
      </div>
    </div>
  );
};

export default ThemeSelector;
