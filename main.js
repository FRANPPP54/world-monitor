const dashboardEl = document.getElementById('dashboard');
const statusEl = document.getElementById('status');

async function init() {
    try {
        statusEl.innerText = "Conectando con satélites de la NASA...";
        
        const cacheKey = 'wm_nasa_events';
        const cached = localStorage.getItem(cacheKey);
        let eventos = [];

        // Verificar caché local
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() < parsed.expiry) {
                eventos = parsed.data;
            }
        }

        // Si no hay caché válido, consultar API de la NASA
        if (eventos.length === 0) {
            const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=10');
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();
            
            if (data && data.events) {
                eventos = data.events.map(event => ({
                    title: event.title,
                    category: event.categories[0]?.title || 'General',
                    date: new Date(event.geometry[0]?.date).toLocaleDateString()
                }));
            }

            // Guardar en caché por 30 minutos
            localStorage.setItem(cacheKey, JSON.stringify({
                data: eventos,
                expiry: Date.now() + 30 * 60 * 1000
            }));
        }

        statusEl.style.display = 'none';
        
        let html = `<div class="panel" style="padding: 15px; background: #161b22; border-radius: 8px; color: #c9d1d9;"><h2>🌋 Desastres (NASA)</h2>`;
        
        if (eventos.length === 0) {
            html += `<p>No hay eventos reportados en este momento.</p>`;
        } else {
            eventos.forEach(evento => {
                html += `<div style="margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid #30363d; padding-bottom: 8px;">
                            ⚠️ <strong>${evento.category}</strong>: ${evento.title} <br>
                            <small style="color: #8b949e;">Fecha: ${evento.date}</small>
                         </div>`;
            });
        }
        
        html += `</div>`;
        dashboardEl.innerHTML = html;
        
    } catch (error) {
        statusEl.innerText = `Error crítico: ${error.message}`;
        statusEl.style.color = "ff7b72";
        console.error(error);
    }
}

init();
