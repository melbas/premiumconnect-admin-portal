
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ThemeService } from '@/services/themeService';
import { ThemeJson } from '@/types/theme';
import { 
  Upload, 
  Download, 
  Palette, 
  Eye, 
  Trash2, 
  Copy,
  FileJson,
  Check,
  AlertCircle
} from 'lucide-react';

const ThemeJsonManager: React.FC = () => {
  const [themes, setThemes] = useState<ThemeJson[]>(ThemeService.getStoredThemes());
  const [selectedTheme, setSelectedTheme] = useState<ThemeJson | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    
    const result = await ThemeService.importTheme(file);
    
    if (result.success && result.theme) {
      ThemeService.saveTheme(result.theme);
      setThemes(ThemeService.getStoredThemes());
      toast({
        title: "Thème importé",
        description: `Le thème "${result.theme.name}" a été importé avec succès`,
      });
    } else {
      setImportError(result.error || 'Erreur lors de l\'importation');
      toast({
        title: "Erreur d'importation",
        description: result.error,
        variant: "destructive",
      });
    }

    // Reset input
    event.target.value = '';
  }, [toast]);

  const handleExportTheme = (theme: ThemeJson) => {
    ThemeService.exportTheme(theme);
    toast({
      title: "Thème exporté",
      description: `Le thème "${theme.name}" a été téléchargé`,
    });
  };

  const handleApplyTheme = (theme: ThemeJson) => {
    ThemeService.applyTheme(theme);
    setSelectedTheme(theme);
    setPreviewMode(true);
    toast({
      title: "Thème appliqué",
      description: `Le thème "${theme.name}" est maintenant actif`,
    });
  };

  const handleDeleteTheme = (themeName: string) => {
    ThemeService.deleteTheme(themeName);
    setThemes(ThemeService.getStoredThemes());
    toast({
      title: "Thème supprimé",
      description: `Le thème "${themeName}" a été supprimé`,
    });
  };

  const handleDuplicateTheme = (theme: ThemeJson) => {
    const duplicatedTheme: ThemeJson = {
      ...theme,
      name: `${theme.name} (Copie)`,
      metadata: {
        ...theme.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    
    ThemeService.saveTheme(duplicatedTheme);
    setThemes(ThemeService.getStoredThemes());
    toast({
      title: "Thème dupliqué",
      description: `Le thème "${duplicatedTheme.name}" a été créé`,
    });
  };

  const resetPreview = () => {
    const existingStyle = document.getElementById('dynamic-theme');
    if (existingStyle) {
      existingStyle.remove();
    }
    setPreviewMode(false);
    setSelectedTheme(null);
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions principales */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestionnaire de Thèmes JSON</h3>
          <p className="text-sm text-muted-foreground">
            Importez, exportez et gérez vos thèmes personnalisés
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="pointer-events-none">
              <Upload className="h-4 w-4 mr-2" />
              Importer JSON
            </Button>
          </div>
          
          {previewMode && (
            <Button variant="outline" onClick={resetPreview}>
              Réinitialiser Aperçu
            </Button>
          )}
        </div>
      </div>

      {/* Erreur d'importation */}
      {importError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Erreur d'importation:</span>
            </div>
            <pre className="mt-2 text-sm bg-muted p-2 rounded">{importError}</pre>
          </CardContent>
        </Card>
      )}

      {/* Thème actuellement appliqué */}
      {previewMode && selectedTheme && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Thème actif: {selectedTheme.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Version {selectedTheme.version} • {selectedTheme.culturalContext}
                  </p>
                </div>
              </div>
              <Badge>Aperçu Actif</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des thèmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card key={theme.name} className="relative group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{theme.name}</CardTitle>
                <Badge variant="outline">v{theme.version}</Badge>
              </div>
              {theme.description && (
                <p className="text-sm text-muted-foreground">{theme.description}</p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Preview des couleurs */}
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Couleur primaire"
                />
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Couleur secondaire"
                />
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: theme.colors.background }}
                  title="Arrière-plan"
                />
              </div>

              {/* Métadonnées */}
              <div className="text-xs text-muted-foreground space-y-1">
                {theme.culturalContext && (
                  <div>Contexte: {theme.culturalContext}</div>
                )}
                {theme.author && (
                  <div>Auteur: {theme.author}</div>
                )}
                <div>Police: {theme.typography.fontFamily}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleApplyTheme(theme)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Aperçu
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportTheme(theme)}
                >
                  <Download className="h-3 w-3" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDuplicateTheme(theme)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteTheme(theme.name)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Card pour créer un nouveau thème */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileJson className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-2">Créer un Nouveau Thème</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Importez un fichier JSON ou créez un thème depuis zéro
            </p>
            <div className="relative">
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="pointer-events-none">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {themes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun thème personnalisé</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par importer un fichier de thème JSON
            </p>
            <div className="relative">
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="pointer-events-none">
                <Upload className="h-4 w-4 mr-2" />
                Importer votre premier thème
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThemeJsonManager;
