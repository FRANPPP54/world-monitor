import { BaseModule } from '../../BaseModule.js';

export class DisastersModule extends BaseModule {
  constructor() {
    // Le decimos al molde que guarde estos datos por 60 minutos en la memoria
    super('NASA-Disasters', 60); 
    this.apiUrl = 'https://eonet.gsfc.nasa.gov/api/v3/events';
  }

  async getEvents(limit = 10) {
    const cacheKey = `nasa_events_${limit}`;
    const endpoint = `${this.apiUrl}?status=open&limit=${limit}`;
    
    // Usamos el poder del molde para buscar la información
    const result = await this.fetchData(endpoint, cacheKey);
    
    if (!result.data || !result.data.events) return [];

    // Filtramos la información cruda de la NASA para dejar solo lo que nos sirve
    return result.data.events.map(event => {
      return {
        title: event.title,
        category: event.categories[0]?.title || 'General',
        date: new Date(event.geometry[0]?.date).toLocaleDateString()
      };
    });
  }
}
