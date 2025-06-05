
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  expiresAt: Date;
  tags: string[];
  metadata?: any;
}

export class MongoDBCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private isEnabled = true;

  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      return null;
    }

    console.log(`🔍 MongoDB Cache: Hit for key ${key}`);
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 3600, tags: string[] = []): Promise<void> {
    if (!this.isEnabled) return;

    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    
    this.cache.set(key, {
      key,
      value,
      expiresAt,
      tags,
      metadata: {
        createdAt: new Date(),
        accessCount: 0
      }
    });

    console.log(`💾 MongoDB Cache: Set key ${key} with TTL ${ttlSeconds}s`);
  }

  async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
    console.log(`🗑️ MongoDB Cache: Invalidated key ${key}`);
  }

  async invalidateByTags(tags: string[]): Promise<void> {
    let invalidatedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    console.log(`🗑️ MongoDB Cache: Invalidated ${invalidatedCount} entries by tags: ${tags.join(', ')}`);
  }

  async clear(): Promise<void> {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🧹 MongoDB Cache: Cleared ${size} entries`);
  }

  async getStats(): Promise<any> {
    const entries = Array.from(this.cache.values());
    const now = new Date();
    
    return {
      totalEntries: entries.length,
      expiredEntries: entries.filter(e => e.expiresAt < now).length,
      cacheSize: this.cache.size,
      tags: [...new Set(entries.flatMap(e => e.tags))],
      oldestEntry: entries.reduce((oldest, entry) => 
        !oldest || entry.metadata?.createdAt < oldest.metadata?.createdAt ? entry : oldest
      , null as CacheEntry | null)?.metadata?.createdAt
    };
  }

  // Méthodes spécifiques pour les optimisations réseau
  async cacheNetworkOptimization(siteId: string, optimization: any): Promise<void> {
    await this.set(`network_opt_${siteId}`, optimization, 1800, ['network', 'optimization', siteId]);
  }

  async getCachedNetworkOptimization(siteId: string): Promise<any> {
    return await this.get(`network_opt_${siteId}`);
  }

  async cacheBehaviorPattern(siteId: string, pattern: any): Promise<void> {
    await this.set(`behavior_${siteId}`, pattern, 3600, ['behavior', 'patterns', siteId]);
  }

  async getCachedBehaviorPattern(siteId: string): Promise<any> {
    return await this.get(`behavior_${siteId}`);
  }

  async cacheMaintenancePrediction(siteId: string, predictions: any): Promise<void> {
    await this.set(`maintenance_${siteId}`, predictions, 86400, ['maintenance', 'predictions', siteId]);
  }

  async getCachedMaintenancePrediction(siteId: string): Promise<any> {
    return await this.get(`maintenance_${siteId}`);
  }

  // Nettoyage automatique des entrées expirées
  startCleanupInterval(intervalMs: number = 300000): void { // 5 minutes par défaut
    setInterval(() => {
      this.cleanupExpired();
    }, intervalMs);
  }

  private cleanupExpired(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 MongoDB Cache: Auto-cleaned ${cleanedCount} expired entries`);
    }
  }
}

export const mongoDBCache = new MongoDBCacheService();

// Démarrer le nettoyage automatique
mongoDBCache.startCleanupInterval();
