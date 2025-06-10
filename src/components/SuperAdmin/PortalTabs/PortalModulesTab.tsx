
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from 'lucide-react';

interface Module {
  name: string;
  display: string;
  category: string;
  icon: any;
  enabled: boolean;
}

interface PortalModulesTabProps {
  modules: Module[];
}

const PortalModulesTab: React.FC<PortalModulesTabProps> = ({ modules }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Gestion des Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Modules Obligatoires</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modules.filter(m => m.category === 'mandatory').map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <Card key={module.name} className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-green-600" />
                            <div>
                              <h4 className="font-medium">{module.display}</h4>
                              <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-green-500">Actif</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Modules Optionnels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modules.filter(m => m.category === 'optional').map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <Card key={module.name} className="border-blue-200 bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{module.display}</h4>
                              <Badge variant="outline" className="text-xs">Optionnel</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={module.enabled ? 'default' : 'secondary'}>
                              {module.enabled ? 'Actif' : 'Inactif'}
                            </Badge>
                            <Button size="sm" variant="outline">
                              Configurer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalModulesTab;
