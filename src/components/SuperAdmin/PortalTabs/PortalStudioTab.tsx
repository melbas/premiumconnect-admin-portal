
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Plus, Globe } from 'lucide-react';

interface Theme {
  name: string;
  color: string;
  description: string;
}

interface PortalStudioTabProps {
  themes: Theme[];
}

const PortalStudioTab: React.FC<PortalStudioTabProps> = ({ themes }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Studio de Personnalisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thèmes Culturels Sénégalais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <Card key={theme.name} className="border-2 hover:border-blue-200 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.color }}></div>
                        <h4 className="font-medium">{theme.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{theme.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Créer un Nouveau Thème
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview en Temps Réel</h3>
              <Card className="aspect-video bg-gradient-to-br from-orange-100 to-yellow-50 border-2 border-dashed border-orange-300">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                    <h4 className="text-lg font-medium text-orange-800">Preview du Portail</h4>
                    <p className="text-sm text-orange-600">Sélectionnez un thème pour voir l'aperçu</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalStudioTab;
