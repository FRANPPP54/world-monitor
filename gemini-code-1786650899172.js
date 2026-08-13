export class CacheManager {
  static get(key) {
    const cached = localStorage.getItem(`wm_cache_${key}`);
    if (!cached) return null;

    const { data, expiry } = JSON.parse(cached);
    // Si la memoria ya caducó, la borramos
    if (Date.now() > expiry) {
      localStorage.removeItem(`wm_cache_${key}`);
      return null;
    }
    return data;
  }

  static set(key, data, ttlInMinutes = 30) {
    // Calculamos en qué momento exacto del futuro caducará esta información
    const expiry = Date.now() + ttlInMinutes * 60 * 1000;
    localStorage.setItem(`wm_cache_${key}`, JSON.stringify({ data, expiry }));
  }
}