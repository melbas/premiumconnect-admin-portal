
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Palette,
  Settings,
  Eye,
  Play,
  Smartphone,
  Route
} from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import ModuleConfigurationPanel from './ModuleConfigurationPanel';
import CustomerJourneyPanel from './CustomerJourneyPanel';

const PortalConfigurationStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theme');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Studio de Configuration Portail</h3>
          <p className="text-sm text-muted-foreground">
            Configurez l'apparence et le comportement de votre portail captif
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          Studio v2.0
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Thème
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="parcours" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Parcours
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Aperçu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <ThemeSelector />
        </TabsContent>

        <TabsContent value="modules">
          <ModuleConfigurationPanel />
        </TabsContent>

        <TabsContent value="parcours">
          <CustomerJourneyPanel />
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Aperçu du Portail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    L'aperçu du portail apparaîtra ici
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Prévisualiser
                </Button>
                <Button variant="outline">
                  Tester sur Appareil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalConfigurationStudio;
