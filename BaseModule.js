import { CacheManager } from '../core/CacheManager.js';

export class BaseModule {
  constructor(name, cacheTtl = 30) {
    this.name = name;
    this.cacheTtl = cacheTtl; // Cuántos minutos guarda los datos
  }

  async fetchData(endpoint, cacheKey) {
    // 1. Revisa si ya tenemos los datos guardados para ahorrar batería y red
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`[${this.name}] Cargado al instante desde memoria`);
      return { source: 'cache', data: cachedData };
    }

    // 2. Si no los tenemos, se conecta a la API correspondiente (NASA, etc.)
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      
      // 3. Guarda los datos nuevos en la memoria
      CacheManager.set(cacheKey, data, this.cacheTtl);
      console.log(`[${this.name}] Datos nuevos descargados de internet`);
      return { source: 'api', data };
    } catch (error) {
      console.error(`[${this.name}] Falla al conectar:`, error);
      return { source: 'error', data: null, error: error.message };
    }
  }
}
