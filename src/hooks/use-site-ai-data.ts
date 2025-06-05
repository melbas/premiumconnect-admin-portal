
import { useState, useEffect } from 'react';
import { supervisionAgent } from '@/services/ai/SupervisionAgent';
import { optimizationMCP } from '@/services/mcp/OptimizationMCPServer';
import { networkMCP } from '@/services/mcp/NetworkMCPServer';

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
          // Analyser les alertes
          const alerts = await supervisionAgent.analyzeNetworkHealth(siteId);
          
          // Récupérer les optimisations
          const optimizations = await optimizationMCP.getOptimizationContext(siteId);
          
          // Calculer le score d'optimisation
          const score = optimizations 
            ? Math.round(optimizations.performanceMetrics.userSatisfaction)
            : Math.floor(Math.random() * 40) + 60; // Score simulé entre 60-100

          newAiData[siteId] = {
            siteId,
            optimizationScore: score,
            activeAlertsCount: alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length,
            lastOptimization: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Dans les 7 derniers jours
            recommendations: optimizations?.recommendations.immediate || [],
            performanceMetrics: optimizations?.performanceMetrics || {
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
    }
  }, [siteIds]);

  const refreshSiteData = async (siteId: string) => {
    try {
      const alerts = await supervisionAgent.analyzeNetworkHealth(siteId);
      const optimizations = await optimizationMCP.getOptimizationContext(siteId);
      
      const score = optimizations 
        ? Math.round(optimizations.performanceMetrics.userSatisfaction)
        : Math.floor(Math.random() * 40) + 60;

      setAiData(prev => ({
        ...prev,
        [siteId]: {
          ...prev[siteId],
          optimizationScore: score,
          activeAlertsCount: alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length,
          lastOptimization: new Date(),
          recommendations: optimizations?.recommendations.immediate || [],
          performanceMetrics: optimizations?.performanceMetrics || prev[siteId]?.performanceMetrics || {
            bandwidth: 85,
            latency: 25,
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
