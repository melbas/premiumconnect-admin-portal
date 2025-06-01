
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, MapPin, Plus, Settings } from 'lucide-react';
import { usePortalConfigStore } from '@/stores/portalConfigStore';

const SiteSelector: React.FC = () => {
  const {
    sites,
    wholesalers,
    selectedSite,
    selectedWholesaler,
    availableConfigs,
    setSelectedSite,
    setSelectedWholesaler,
    createConfigurationForSite
  } = usePortalConfigStore();

  const currentSite = sites.find(s => s.id === selectedSite);
  const currentWholesaler = wholesalers.find(w => w.id === selectedWholesaler);
  const siteConfigs = availableConfigs.filter(config => config.siteId === selectedSite);

  const handleCreateConfiguration = () => {
    if (!selectedSite) return;
    
    const name = prompt(`Créer une nouvelle configuration pour ${currentSite?.name}:`);
    if (name) {
      createConfigurationForSite(selectedSite, name);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Sélection du Site
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wholesaler Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Grossiste</label>
          <Select value={selectedWholesaler} onValueChange={setSelectedWholesaler}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un grossiste" />
            </SelectTrigger>
            <SelectContent>
              {wholesalers.map(wholesaler => (
                <SelectItem key={wholesaler.id} value={wholesaler.id}>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {wholesaler.name}
                    <Badge variant="outline" className="ml-auto">
                      {wholesaler.sites.length} sites
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Site Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Site</label>
          <Select 
            value={selectedSite} 
            onValueChange={setSelectedSite}
            disabled={!selectedWholesaler}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un site" />
            </SelectTrigger>
            <SelectContent>
              {selectedWholesaler && 
                wholesalers
                  .find(w => w.id === selectedWholesaler)
                  ?.sites.map(site => (
                    <SelectItem key={site.id} value={site.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <div>
                          <div>{site.name}</div>
                          {site.location && (
                            <div className="text-xs text-muted-foreground">
                              {site.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>

        {/* Current Selection Info */}
        {currentSite && (
          <div className="border rounded-lg p-3 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{currentSite.name}</span>
            </div>
            {currentSite.location && (
              <p className="text-sm text-muted-foreground mb-2">
                {currentSite.location}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {siteConfigs.length} configuration(s)
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateConfiguration}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Nouveau
              </Button>
            </div>
          </div>
        )}

        {/* Configurations for selected site */}
        {selectedSite && siteConfigs.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Configurations existantes</label>
            <div className="space-y-1">
              {siteConfigs.map(config => (
                <div key={config.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{config.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Modifié le {config.lastModified.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {config.isActive && (
                      <Badge variant="default" className="text-xs">Actif</Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SiteSelector;
