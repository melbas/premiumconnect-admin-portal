
interface CacheEntry<T = any> {
  key: string;
  value: T;
  expiresAt: Date;
  accessCount: number;
  lastAccessed: Date;
  priority: 'low' | 'medium' | 'high';
}

export class OptimizedCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize = 1000;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      return null;
    }

    // Mettre à jour les stats d'accès
    entry.accessCount++;
    entry.lastAccessed = new Date();
    
    return entry.value as T;
  }

  async set<T>(
    key: string, 
    value: T, 
    ttlSeconds: number = 3600, 
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    // Vérifier la taille du cache
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    
    this.cache.set(key, {
      key,
      value,
      expiresAt,
      accessCount: 0,
      lastAccessed: new Date(),
      priority
    });
  }

  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.values());
    
    // Trier par priorité puis par accès
    entries.sort((a, b) => {
      const priorityOrder = { low: 0, medium: 1, high: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.accessCount - b.accessCount;
    });

    // Supprimer 10% des entrées les moins utilisées
    const toRemove = Math.floor(entries.length * 0.1) || 1;
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i].key);
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = new Date();
      let cleanedCount = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (entry.expiresAt < now) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
      }
    }, 60000); // Nettoyage toutes les minutes
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  getStats(): any {
    const entries = Array.from(this.cache.values());
    const now = new Date();
    
    return {
      totalEntries: entries.length,
      expiredEntries: entries.filter(e => e.expiresAt < now).length,
      avgAccessCount: entries.reduce((sum, e) => sum + e.accessCount, 0) / entries.length || 0,
      priorityDistribution: {
        high: entries.filter(e => e.priority === 'high').length,
        medium: entries.filter(e => e.priority === 'medium').length,
        low: entries.filter(e => e.priority === 'low').length
      },
      memoryUsage: this.cache.size
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

export const optimizedCache = new OptimizedCacheService();
