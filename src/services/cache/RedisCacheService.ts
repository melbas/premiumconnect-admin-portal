
export interface RealTimeMetric {
  siteId: string;
  timestamp: Date;
  metric: string;
  value: number;
  unit: string;
  context?: any;
}

export class RedisCacheService {
  private realTimeData: Map<string, RealTimeMetric[]> = new Map();
  private recommendations: Map<string, any> = new Map();
  private maxEntries = 1000; // Limite pour éviter la surcharge mémoire

  // Métriques temps réel
  async setRealTimeMetric(metric: RealTimeMetric): Promise<void> {
    const key = `${metric.siteId}_${metric.metric}`;
    let metrics = this.realTimeData.get(key) || [];
    
    // Ajouter la nouvelle métrique
    metrics.push(metric);
    
    // Conserver seulement les 100 dernières valeurs
    if (metrics.length > 100) {
      metrics = metrics.slice(-100);
    }
    
    this.realTimeData.set(key, metrics);
    console.log(`⚡ Redis Cache: Set real-time metric ${metric.metric} for site ${metric.siteId}`);
  }

  async getRealTimeMetrics(siteId: string, metric: string, limit: number = 50): Promise<RealTimeMetric[]> {
    const key = `${siteId}_${metric}`;
    const metrics = this.realTimeData.get(key) || [];
    return metrics.slice(-limit);
  }

  async getLatestMetric(siteId: string, metric: string): Promise<RealTimeMetric | null> {
    const key = `${siteId}_${metric}`;
    const metrics = this.realTimeData.get(key) || [];
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  }

  // Recommandations IA temps réel
  async setRecommendation(siteId: string, agentType: string, recommendation: any): Promise<void> {
    const key = `${siteId}_${agentType}_recommendation`;
    this.recommendations.set(key, {
      ...recommendation,
      timestamp: new Date(),
      siteId,
      agentType
    });
    console.log(`🧠 Redis Cache: Set ${agentType} recommendation for site ${siteId}`);
  }

  async getRecommendation(siteId: string, agentType: string): Promise<any> {
    const key = `${siteId}_${agentType}_recommendation`;
    return this.recommendations.get(key) || null;
  }

  async getAllRecommendations(siteId: string): Promise<any[]> {
    const recommendations = [];
    for (const [key, value] of this.recommendations.entries()) {
      if (key.startsWith(`${siteId}_`)) {
        recommendations.push(value);
      }
    }
    return recommendations;
  }

  // Alertes temps réel
  async publishAlert(siteId: string, alert: any): Promise<void> {
    const key = `alerts_${siteId}`;
    let alerts = this.realTimeData.get(key) || [];
    
    alerts.push({
      ...alert,
      siteId,
      timestamp: new Date(),
      metric: 'alert',
      value: 1,
      unit: 'count'
    } as RealTimeMetric);
    
    // Conserver seulement les 50 dernières alertes
    if (alerts.length > 50) {
      alerts = alerts.slice(-50);
    }
    
    this.realTimeData.set(key, alerts);
    console.log(`🚨 Redis Cache: Published alert for site ${siteId}`);
  }

  async getActiveAlerts(siteId: string): Promise<any[]> {
    const key = `alerts_${siteId}`;
    const alerts = this.realTimeData.get(key) || [];
    
    // Filtrer les alertes des dernières 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return alerts.filter(alert => alert.timestamp > oneDayAgo);
  }

  // Performance tracking
  async trackPerformance(siteId: string, metrics: any): Promise<void> {
    const timestamp = new Date();
    
    Object.entries(metrics).forEach(([metricName, value]) => {
      this.setRealTimeMetric({
        siteId,
        timestamp,
        metric: metricName,
        value: value as number,
        unit: 'unit',
        context: { source: 'performance_tracking' }
      });
    });
  }

  async getPerformanceTrend(siteId: string, metric: string, timeframe: number = 3600): Promise<any> {
    const metrics = await this.getRealTimeMetrics(siteId, metric);
    const since = new Date(Date.now() - timeframe * 1000);
    
    const recentMetrics = metrics.filter(m => m.timestamp > since);
    
    if (recentMetrics.length === 0) return null;
    
    const values = recentMetrics.map(m => m.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
      average: avg,
      minimum: min,
      maximum: max,
      trend: recentMetrics.length > 1 
        ? (values[values.length - 1] - values[0]) / values[0] * 100 
        : 0,
      dataPoints: recentMetrics.length
    };
  }

  // Nettoyage et maintenance
  async cleanup(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let cleanedCount = 0;

    // Nettoyer les métriques anciennes
    for (const [key, metrics] of this.realTimeData.entries()) {
      const filtered = metrics.filter(m => m.timestamp > oneDayAgo);
      if (filtered.length !== metrics.length) {
        this.realTimeData.set(key, filtered);
        cleanedCount += metrics.length - filtered.length;
      }
    }

    // Nettoyer les recommandations anciennes
    for (const [key, recommendation] of this.recommendations.entries()) {
      if (recommendation.timestamp < oneDayAgo) {
        this.recommendations.delete(key);
        cleanedCount++;
      }
    }

    console.log(`🧹 Redis Cache: Cleaned ${cleanedCount} old entries`);
  }

  async getStats(): Promise<any> {
    const metricsSize = Array.from(this.realTimeData.values()).reduce((sum, arr) => sum + arr.length, 0);
    
    return {
      realTimeMetrics: metricsSize,
      recommendations: this.recommendations.size,
      totalMemoryUsage: this.realTimeData.size + this.recommendations.size,
      oldestMetric: this.getOldestTimestamp()
    };
  }

  private getOldestTimestamp(): Date | null {
    let oldest: Date | null = null;
    
    for (const metrics of this.realTimeData.values()) {
      for (const metric of metrics) {
        if (!oldest || metric.timestamp < oldest) {
          oldest = metric.timestamp;
        }
      }
    }
    
    return oldest;
  }

  // Démarrer le nettoyage automatique
  startCleanupInterval(intervalMs: number = 300000): void { // 5 minutes
    setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }
}

export const redisCache = new RedisCacheService();

// Démarrer le nettoyage automatique
redisCache.startCleanupInterval();
