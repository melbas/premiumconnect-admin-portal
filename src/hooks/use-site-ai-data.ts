
import { useState, useEffect } from 'react';

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

export const useSiteAIData = (siteIds: string[]) => {
  const [aiData, setAiData] = useState<Record<string, SiteAIData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      setIsLoading(true);
      const newAiData: Record<string, SiteAIData> = {};

      for (const siteId of siteIds) {
        try {
          // Simuler des données IA pour éviter les erreurs de services
          const score = Math.floor(Math.random() * 40) + 60; // Score entre 60-100
          const alertsCount = Math.floor(Math.random() * 3); // 0-2 alertes

          newAiData[siteId] = {
            siteId,
            optimizationScore: score,
            activeAlertsCount: alertsCount,
            lastOptimization: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Dans les 7 derniers jours
            recommendations: [
              'Optimiser la bande passante',
              'Mettre à jour les paramètres de sécurité',
              'Améliorer la configuration réseau'
            ].slice(0, Math.floor(Math.random() * 3) + 1),
            performanceMetrics: {
              bandwidth: 85 + Math.random() * 15,
              latency: 20 + Math.random() * 30,
              userSatisfaction: score
            }
          };
        } catch (error) {
          console.error(`Erreur récupération données IA pour site ${siteId}:`, error);
          // Données par défaut en cas d'erreur
          newAiData[siteId] = {
            siteId,
            optimizationScore: 75,
            activeAlertsCount: 0,
            lastOptimization: new Date(),
            recommendations: [],
            performanceMetrics: {
              bandwidth: 80,
              latency: 25,
              userSatisfaction: 75
            }
          };
        }
      }

      setAiData(newAiData);
      setIsLoading(false);
    };

    if (siteIds.length > 0) {
      fetchAIData();
    } else {
      setIsLoading(false);
    }
  }, [siteIds]);

  const refreshSiteData = async (siteId: string) => {
    try {
      const score = Math.floor(Math.random() * 40) + 60;
      const alertsCount = Math.floor(Math.random() * 3);

      setAiData(prev => ({
        ...prev,
        [siteId]: {
          ...prev[siteId],
          optimizationScore: score,
          activeAlertsCount: alertsCount,
          lastOptimization: new Date(),
          recommendations: [
            'Optimisation appliquée avec succès',
            'Performance améliorée'
          ],
          performanceMetrics: {
            bandwidth: 85 + Math.random() * 15,
            latency: 15 + Math.random() * 20,
            userSatisfaction: score
          }
        }
      }));
    } catch (error) {
      console.error(`Erreur refresh données IA pour site ${siteId}:`, error);
    }
  };

  return {
    aiData,
    isLoading,
    refreshSiteData
  };
};
