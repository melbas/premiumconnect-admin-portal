
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PortalFeature {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

export const usePortalFeatures = () => {
  const [features, setFeatures] = useState<PortalFeature[]>([
    {
      id: 'theme_manager',
      name: 'Gestionnaire de Thèmes',
      enabled: true,
      config: { autoLoad: true, validateOnImport: true }
    },
    {
      id: 'workflow_builder',
      name: 'Constructeur de Workflows',
      enabled: true,
      config: { maxNodes: 50, autoSave: true }
    },
    {
      id: 'api_monitoring',
      name: 'Monitoring API',
      enabled: true,
      config: { realTimeUpdates: true, retentionDays: 30 }
    },
    {
      id: 'openapi_docs',
      name: 'Documentation OpenAPI',
      enabled: true,
      config: { autoGenerate: true, includeExamples: true }
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleFeature = async (featureId: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulation API
      
      setFeatures(prev => prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled: !feature.enabled }
          : feature
      ));

      const feature = features.find(f => f.id === featureId);
      toast({
        title: `Fonctionnalité ${feature?.enabled ? 'désactivée' : 'activée'}`,
        description: `${feature?.name} est maintenant ${feature?.enabled ? 'désactivée' : 'activée'}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la fonctionnalité",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeatureConfig = async (featureId: string, config: Record<string, any>) => {
    setFeatures(prev => prev.map(feature =>
      feature.id === featureId
        ? { ...feature, config: { ...feature.config, ...config } }
        : feature
    ));
  };

  return {
    features,
    isLoading,
    toggleFeature,
    updateFeatureConfig
  };
};
