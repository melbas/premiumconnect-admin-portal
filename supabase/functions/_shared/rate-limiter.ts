// Rate limiting utility for Edge Functions
// Simple in-memory rate limiter with sliding window

interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

interface RateLimitStore {
  [key: string]: {
    requests: number[];
    lastReset: number;
  };
}

// In-memory store (resets when function restarts)
const store: RateLimitStore = {};

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request should be rate limited
   * @param key - Unique identifier (IP, user ID, etc.)
   * @returns true if request should be blocked, false if allowed
   */
  isLimited(key: string): boolean {
    const now = Date.now();
    
    // Initialize if first request for this key
    if (!store[key]) {
      store[key] = {
        requests: [now],
        lastReset: now
      };
      return false;
    }

    const bucket = store[key];
    
    // Remove requests outside the window
    bucket.requests = bucket.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    // Check if we're at the limit
    if (bucket.requests.length >= this.config.maxRequests) {
      console.log(`Rate limit exceeded for key: ${key}`);
      return true;
    }

    // Add current request
    bucket.requests.push(now);
    return false;
  }

  /**
   * Get rate limit info for headers
   */
  getRateLimitInfo(key: string): { remaining: number; resetTime: number } {
    if (!store[key]) {
      return {
        remaining: this.config.maxRequests - 1,
        resetTime: Date.now() + this.config.windowMs
      };
    }

    const now = Date.now();
    const bucket = store[key];
    
    // Clean old requests
    bucket.requests = bucket.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    return {
      remaining: Math.max(0, this.config.maxRequests - bucket.requests.length),
      resetTime: Math.min(...bucket.requests) + this.config.windowMs
    };
  }
}

// Predefined rate limiters for different use cases
export const chatRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,   // 1 minute
  maxRequests: 20        // 20 requests per minute
});

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 5             // 5 login attempts per 15 minutes
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,   // 1 minute
  maxRequests: 60        // 60 requests per minute
});

/**
 * Get client IP from request headers
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || realIP || (forwarded?.split(',')[0]) || 'unknown';
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(info: { remaining: number; resetTime: number }) {
  return {
    'X-RateLimit-Remaining': info.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(info.resetTime / 1000).toString(),
  };
}