
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Eye, 
  Palette,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { usePortalConfigStore } from '@/stores/portalConfigStore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ConfigurationPanel: React.FC = () => {
  const { 
    currentConfig, 
    updateAuthMethod, 
    updateEngagementModule, 
    updatePaymentModule,
    updateBranding,
    saveConfiguration,
    resetConfiguration,
    unsavedChanges
  } = usePortalConfigStore();

  const [openSections, setOpenSections] = React.useState({
    auth: true,
    engagement: true,
    payment: false,
    branding: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Configuration</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetConfiguration}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            size="sm" 
            onClick={saveConfiguration}
            className="relative"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
            {unsavedChanges && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Button>
        </div>
      </div>

      {/* Authentication Methods */}
      <Card>
        <Collapsible 
          open={openSections.auth} 
          onOpenChange={() => toggleSection('auth')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Méthodes d'Authentification</span>
                {openSections.auth ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {currentConfig.authMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={method.id}
                      checked={method.enabled}
                      onCheckedChange={(checked) => 
                        updateAuthMethod(method.id, { enabled: !!checked })
                      }
                    />
                    <Label htmlFor={method.id} className="cursor-pointer">
                      {method.name}
                    </Label>
                  </div>
                  {method.enabled && (
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Engagement Modules */}
      <Card>
        <Collapsible 
          open={openSections.engagement} 
          onOpenChange={() => toggleSection('engagement')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Modules d'Engagement</span>
                {openSections.engagement ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {currentConfig.engagementModules
                .sort((a, b) => a.order - b.order)
                .map(module => (
                <div key={module.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={module.id}
                      checked={module.enabled}
                      onCheckedChange={(checked) => 
                        updateEngagementModule(module.id, { enabled: !!checked })
                      }
                    />
                    <Label htmlFor={module.id} className="cursor-pointer">
                      {module.name}
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      #{module.order}
                    </Badge>
                  </div>
                  {module.enabled && (
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Payment Modules */}
      <Card>
        <Collapsible 
          open={openSections.payment} 
          onOpenChange={() => toggleSection('payment')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Modules de Paiement</span>
                {openSections.payment ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {currentConfig.paymentModules.map(module => (
                <div key={module.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={module.id}
                      checked={module.enabled}
                      onCheckedChange={(checked) => 
                        updatePaymentModule(module.id, { enabled: !!checked })
                      }
                    />
                    <Label htmlFor={module.id} className="cursor-pointer">
                      {module.name}
                    </Label>
                  </div>
                  {module.enabled && (
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Branding */}
      <Card>
        <Collapsible 
          open={openSections.branding} 
          onOpenChange={() => toggleSection('branding')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Style & Branding</span>
                </div>
                {openSections.branding ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Couleur Principale</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={currentConfig.branding.primaryColor}
                      onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                      className="w-12 h-8 p-1 rounded"
                    />
                    <Input
                      value={currentConfig.branding.primaryColor}
                      onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Couleur Secondaire</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={currentConfig.branding.secondaryColor}
                      onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                      className="w-12 h-8 p-1 rounded"
                    />
                    <Input
                      value={currentConfig.branding.secondaryColor}
                      onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fontFamily">Police</Label>
                <Input
                  id="fontFamily"
                  value={currentConfig.branding.fontFamily}
                  onChange={(e) => updateBranding({ fontFamily: e.target.value })}
                  placeholder="Inter, Arial, sans-serif"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default ConfigurationPanel;
