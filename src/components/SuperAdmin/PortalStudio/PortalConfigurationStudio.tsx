
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Eye, 
  EyeOff, 
  Settings,
  Palette,
  Layout
} from 'lucide-react';
import { usePortalConfigStore } from '@/stores/portalConfigStore';
import PortalPreview from './PortalPreview';
import ConfigurationPanel from './ConfigurationPanel';

const PortalConfigurationStudio: React.FC = () => {
  const { 
    previewDevice, 
    isPreviewMode, 
    setPreviewDevice, 
    togglePreviewMode,
    unsavedChanges 
  } = usePortalConfigStore();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Studio de Configuration Portail</h1>
            {unsavedChanges && (
              <Badge variant="destructive">Modifications non sauvegardées</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>

            {/* Preview Toggle */}
            <Button
              variant="outline"
              onClick={togglePreviewMode}
              className="flex items-center gap-2"
            >
              {isPreviewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {isPreviewMode ? 'Mode Preview' : 'Mode Configuration'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Section */}
        {isPreviewMode && (
          <div className="flex-1 bg-gray-50 overflow-auto">
            <div className="p-4">
              <div className="mb-4 text-center">
                <Badge variant="outline" className="mb-2">
                  Preview - {previewDevice === 'mobile' ? 'Mobile' : previewDevice === 'tablet' ? 'Tablette' : 'Desktop'}
                </Badge>
              </div>
              <PortalPreview />
            </div>
          </div>
        )}

        {/* Configuration Section */}
        <div className={`${isPreviewMode ? 'w-96' : 'flex-1'} border-l bg-background`}>
          <div className="h-full">
            <Tabs defaultValue="modules" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-4">
                <TabsTrigger value="modules" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Modules
                </TabsTrigger>
                <TabsTrigger value="style" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Avancé
                </TabsTrigger>
              </TabsList>

              <TabsContent value="modules" className="flex-1 m-4 mt-0">
                <ConfigurationPanel />
              </TabsContent>

              <TabsContent value="style" className="flex-1 m-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Style & Branding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Palette className="h-12 w-12 mx-auto mb-4" />
                      <p>Éditeur de style avancé</p>
                      <p className="text-sm">Bientôt disponible</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="flex-1 m-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration Avancée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-4" />
                      <p>Paramètres avancés</p>
                      <p className="text-sm">Templates, APIs, etc.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalConfigurationStudio;
