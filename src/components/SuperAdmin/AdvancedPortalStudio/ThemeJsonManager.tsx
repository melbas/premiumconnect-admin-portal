
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ThemeService } from '@/services/themeService';
import { ThemeJson } from '@/types/theme';
import { defaultThemes } from '@/data/defaultThemes';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Upload, 
  Download, 
  Palette, 
  Eye, 
  Trash2, 
  Copy,
  FileJson,
  Check,
  AlertCircle,
  RefreshCw,
  Plus
} from 'lucide-react';

const ThemeJsonManager: React.FC = () => {
  const [themes, setThemes] = useState<ThemeJson[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeJson | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger les thèmes au montage du composant
  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    setIsLoading(true);
    try {
      let storedThemes = ThemeService.getStoredThemes();
      
      // Si aucun thème n'existe, charger les thèmes par défaut
      if (storedThemes.length === 0) {
        console.log('🎨 Chargement des thèmes par défaut...');
        defaultThemes.forEach(theme => {
          try {
            ThemeService.saveTheme(theme);
          } catch (error) {
            console.error('Erreur lors de la sauvegarde du thème:', theme.name, error);
          }
        });
        storedThemes = ThemeService.getStoredThemes();
        
        toast({
          title: "Thèmes initialisés",
          description: `${storedThemes.length} thèmes par défaut ont été chargés`,
        });
      }
      
      setThemes(storedThemes);
    } catch (error) {
      console.error('Erreur lors du chargement des thèmes:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les thèmes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setActionLoading('import');
    setImportError(null);
    
    try {
      const result = await ThemeService.importTheme(file);
      
      if (result.success && result.theme) {
        // Vérifier si le thème existe déjà
        const existingTheme = themes.find(t => t.name === result.theme!.name);
        if (existingTheme) {
          // Demander confirmation pour remplacer
          const confirmed = window.confirm(`Le thème "${result.theme.name}" existe déjà. Voulez-vous le remplacer ?`);
          if (!confirmed) {
            setActionLoading(null);
            event.target.value = '';
            return;
          }
        }

        ThemeService.saveTheme(result.theme);
        await loadThemes();
        
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
    } catch (error) {
      setImportError('Erreur inattendue lors de l\'importation');
      toast({
        title: "Erreur critique",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      event.target.value = '';
    }
  }, [themes, toast]);

  const handleExportTheme = async (theme: ThemeJson) => {
    setActionLoading(`export-${theme.name}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Petit délai pour UX
      ThemeService.exportTheme(theme);
      
      toast({
        title: "Thème exporté",
        description: `Le thème "${theme.name}" a été téléchargé`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'exportation",
        description: "Impossible d'exporter le thème",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplyTheme = async (theme: ThemeJson) => {
    setActionLoading(`apply-${theme.name}`);
    
    try {
      // Petite validation avant application
      const validation = ThemeService.validateTheme(theme);
      if (!validation.isValid) {
        throw new Error(validation.errors?.join(', ') || 'Thème invalide');
      }

      ThemeService.applyTheme(theme);
      setSelectedTheme(theme);
      setPreviewMode(true);
      
      toast({
        title: "Thème appliqué",
        description: `Le thème "${theme.name}" est maintenant actif`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'application",
        description: error.message || "Impossible d'appliquer le thème",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTheme = async (themeName: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer le thème "${themeName}" ?`);
    if (!confirmed) return;

    setActionLoading(`delete-${themeName}`);
    
    try {
      ThemeService.deleteTheme(themeName);
      await loadThemes();
      
      // Si le thème supprimé était en prévisualisation, réinitialiser
      if (selectedTheme?.name === themeName) {
        resetPreview();
      }
      
      toast({
        title: "Thème supprimé",
        description: `Le thème "${themeName}" a été supprimé`,
      });
    } catch (error) {
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer le thème",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicateTheme = async (theme: ThemeJson) => {
    setActionLoading(`duplicate-${theme.name}`);
    
    try {
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
      await loadThemes();
      
      toast({
        title: "Thème dupliqué",
        description: `Le thème "${duplicatedTheme.name}" a été créé`,
      });
    } catch (error) {
      toast({
        title: "Erreur de duplication",
        description: "Impossible de dupliquer le thème",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const resetPreview = () => {
    const existingStyle = document.getElementById('dynamic-theme');
    if (existingStyle) {
      existingStyle.remove();
    }
    setPreviewMode(false);
    setSelectedTheme(null);
    
    toast({
      title: "Aperçu réinitialisé",
      description: "Le thème par défaut a été restauré",
    });
  };

  const clearImportError = () => {
    setImportError(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Chargement des thèmes...</h3>
            <p className="text-sm text-muted-foreground">
              Initialisation du gestionnaire de thèmes
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <Button variant="outline" onClick={loadThemes} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <div className="relative">
            <Input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={actionLoading === 'import'}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="pointer-events-none" disabled={actionLoading === 'import'}>
              {actionLoading === 'import' ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
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
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <div>
                  <span className="font-medium">Erreur d'importation:</span>
                  <pre className="mt-2 text-sm bg-destructive/10 p-2 rounded whitespace-pre-wrap">
                    {importError}
                  </pre>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearImportError}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
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
          <Card key={theme.name} className="relative group hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{theme.name}</CardTitle>
                <div className="flex gap-1">
                  <Badge variant="outline">v{theme.version}</Badge>
                  {theme.culturalContext && (
                    <Badge variant="secondary" className="text-xs">
                      Culturel
                    </Badge>
                  )}
                </div>
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
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: theme.colors.text }}
                  title="Couleur du texte"
                />
              </div>

              {/* Métadonnées */}
              <div className="text-xs text-muted-foreground space-y-1">
                {theme.author && (
                  <div>Auteur: {theme.author}</div>
                )}
                <div>Police: {theme.typography.fontFamily}</div>
                <div>Créé: {new Date(theme.metadata.createdAt).toLocaleDateString()}</div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleApplyTheme(theme)}
                  disabled={actionLoading === `apply-${theme.name}`}
                  className="w-full"
                >
                  {actionLoading === `apply-${theme.name}` ? (
                    <LoadingSpinner size="sm" className="mr-1" />
                  ) : (
                    <Eye className="h-3 w-3 mr-1" />
                  )}
                  Aperçu
                </Button>
                
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleExportTheme(theme)}
                    disabled={actionLoading === `export-${theme.name}`}
                    className="flex-1"
                  >
                    {actionLoading === `export-${theme.name}` ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDuplicateTheme(theme)}
                    disabled={actionLoading === `duplicate-${theme.name}`}
                    className="flex-1"
                  >
                    {actionLoading === `duplicate-${theme.name}` ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteTheme(theme.name)}
                    disabled={actionLoading === `delete-${theme.name}`}
                    className="flex-1 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    {actionLoading === `delete-${theme.name}` ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Card pour créer un nouveau thème */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
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
                disabled={actionLoading === 'import'}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="pointer-events-none" disabled={actionLoading === 'import'}>
                {actionLoading === 'import' ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Importer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {themes.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun thème disponible</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Importez un fichier de thème JSON ou rechargez les thèmes par défaut
            </p>
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="pointer-events-none">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer un thème
                </Button>
              </div>
              
              <Button variant="outline" onClick={loadThemes}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recharger
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThemeJsonManager;
