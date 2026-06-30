/**
 * Cache Service
 * Simple in-memory Cache with TTL support for repeated query optimization
 */

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Generates a key based on user and prompt context
   */
  generateKey(userId, query) {
    if (!userId || !query) return null;
    const cleanQuery = query.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    return `${userId}:${cleanQuery}`;
  }

  /**
   * Retrieve item from cache if present and not expired
   */
  get(key) {
    if (!key || !this.cache.has(key)) return null;
    
    const entry = this.cache.get(key);
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  /**
   * Store item in cache with specific TTL (default 5 minutes)
   */
  set(key, value, ttlSeconds = 300) {
    if (!key) return;
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiry });
  }

  /**
   * Clears all cache items
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Removes specific key
   */
  delete(key) {
    this.cache.delete(key);
  }
}

export const cacheService = new CacheService();
export default cacheService;
