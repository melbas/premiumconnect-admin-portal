
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  defaultTTL: number;
  maxRetries: number;
  retryDelay: number;
}

export class CacheService {
  private static cache = new Map<string, CacheEntry<any>>();
  private static config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxRetries: 3,
    retryDelay: 1000, // 1 second
  };

  static set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };
    this.cache.set(key, entry);
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  static clear(): void {
    this.cache.clear();
  }

  static async withCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
    fallbackData?: T
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key);
    if (cached) {
      // Refresh cache in background if more than half TTL has passed
      const entry = this.cache.get(key);
      if (entry && Date.now() - entry.timestamp > entry.ttl / 2) {
        this.refreshInBackground(key, fetchFn, ttl);
      }
      return cached;
    }

    // Not in cache, fetch with retry logic
    try {
      const data = await this.fetchWithRetry(fetchFn);
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`Failed to fetch data for key ${key}:`, error);
      
      // Return fallback data if available
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      
      throw error;
    }
  }

  private static async fetchWithRetry<T>(
    fetchFn: () => Promise<T>,
    retries = 0
  ): Promise<T> {
    try {
      return await fetchFn();
    } catch (error) {
      if (retries < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, retries); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(fetchFn, retries + 1);
      }
      throw error;
    }
  }

  private static async refreshInBackground<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<void> {
    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
    } catch (error) {
      console.warn(`Background refresh failed for key ${key}:`, error);
    }
  }
}
