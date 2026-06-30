
class CacheService {
  constructor() {
    this.cache = new Map();
  }

  generateKey(userId, query) {
    if (!userId || !query) return null;
    const cleanQuery = query.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    return `${userId}:${cleanQuery}`;
  }

  get(key) {
    if (!key || !this.cache.has(key)) return null;

    const entry = this.cache.get(key);
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key, value, ttlSeconds = 300) {
    if (!key) return;
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiry });
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}
export const cacheService = new CacheService();
export default cacheService;
