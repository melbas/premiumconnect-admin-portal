
import { useState, useEffect, useMemo, useCallback } from 'react';

export interface SiteAIData {
  siteId: string;
  optimizationScore: number;
  activeAlertsCount: number;
  lastOptimization?: Date;
  recommendations: string[];
  performanceMetrics: {
    bandwidth: number;
    latency: number;
    userSatisfaction: number;
  };
}

// Cache global pour éviter la régénération constante
const aiDataCache = new Map<string, SiteAIData>();
const lastUpdateTime = new Map<string, number>();

// Fonction pour générer des données stables basées sur l'ID du site
const generateStableAIData = (siteId: string): SiteAIData => {
  // Utiliser l'ID du site comme seed pour avoir des données cohérentes
  const seed = siteId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const score = random(70, 95);
  const alertsCount = random(0, 2);

  return {
    siteId,
    optimizationScore: score,
    activeAlertsCount: alertsCount,
    lastOptimization: new Date(Date.now() - random(1, 7) * 24 * 60 * 60 * 1000),
    recommendations: [
      'Optimiser la bande passante',
      'Mettre à jour les paramètres de sécurité',
      'Améliorer la configuration réseau'
    ].slice(0, random(1, 3)),
    performanceMetrics: {
      bandwidth: random(85, 100),
      latency: random(15, 35),
      userSatisfaction: score
    }
  };
};

export const useSiteAIData = (siteIds: string[]) => {
  const [aiData, setAiData] = useState<Record<string, SiteAIData>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Mémoriser les siteIds pour éviter les re-rendus inutiles
  const memoizedSiteIds = useMemo(() => siteIds, [siteIds.join(',')]);

  // Fonction pour vérifier si les données doivent être mises à jour (toutes les 30 secondes)
  const shouldUpdate = useCallback((siteId: string) => {
    const lastUpdate = lastUpdateTime.get(siteId) || 0;
    return Date.now() - lastUpdate > 30000; // 30 secondes
  }, []);

  useEffect(() => {
    const fetchAIData = () => {
      setIsLoading(true);
      const newAiData: Record<string, SiteAIData> = {};

      for (const siteId of memoizedSiteIds) {
        // Utiliser le cache si les données sont récentes
        if (aiDataCache.has(siteId) && !shouldUpdate(siteId)) {
          newAiData[siteId] = aiDataCache.get(siteId)!;
        } else {
          // Générer de nouvelles données stables
          const siteData = generateStableAIData(siteId);
          aiDataCache.set(siteId, siteData);
          lastUpdateTime.set(siteId, Date.now());
          newAiData[siteId] = siteData;
        }
      }

      setAiData(newAiData);
      setIsLoading(false);
    };

    if (memoizedSiteIds.length > 0) {
      fetchAIData();
    } else {
      setIsLoading(false);
    }
  }, [memoizedSiteIds, shouldUpdate]);

  const refreshSiteData = useCallback(async (siteId: string) => {
    try {
      // Simuler une amélioration après optimisation
      const currentData = aiDataCache.get(siteId);
      if (currentData) {
        const optimizedData: SiteAIData = {
          ...currentData,
          optimizationScore: Math.min(95, currentData.optimizationScore + 5),
          activeAlertsCount: Math.max(0, currentData.activeAlertsCount - 1),
          lastOptimization: new Date(),
          recommendations: [
            'Optimisation appliquée avec succès',
            'Performance améliorée'
          ],
          performanceMetrics: {
            bandwidth: Math.min(100, currentData.performanceMetrics.bandwidth + 5),
            latency: Math.max(10, currentData.performanceMetrics.latency - 3),
            userSatisfaction: Math.min(95, currentData.optimizationScore + 5)
          }
        };

        aiDataCache.set(siteId, optimizedData);
        lastUpdateTime.set(siteId, Date.now());

        setAiData(prev => ({
          ...prev,
          [siteId]: optimizedData
        }));
      }
    } catch (error) {
      console.error(`Erreur refresh données IA pour site ${siteId}:`, error);
    }
  }, []);

  // Fonction pour forcer la mise à jour de tous les sites
  const refreshAllData = useCallback(() => {
    // Vider le cache pour forcer la régénération
    aiDataCache.clear();
    lastUpdateTime.clear();
    
    const newAiData: Record<string, SiteAIData> = {};
    for (const siteId of memoizedSiteIds) {
      const siteData = generateStableAIData(siteId);
      aiDataCache.set(siteId, siteData);
      lastUpdateTime.set(siteId, Date.now());
      newAiData[siteId] = siteData;
    }
    
    setAiData(newAiData);
  }, [memoizedSiteIds]);

  return {
    aiData,
    isLoading,
    refreshSiteData,
    refreshAllData
  };
};
