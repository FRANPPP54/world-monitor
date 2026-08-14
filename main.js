const dashboardEl = document.getElementById('dashboard');
const statusEl = document.getElementById('status');

// --- 1. Módulo NASA ---
async function renderNasaSection() {
    try {
        const cacheKey = 'wm_nasa_events';
        const cached = localStorage.getItem(cacheKey);
        let eventos = [];

        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() < parsed.expiry) eventos = parsed.data;
        }

        if (eventos.length === 0) {
            const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=5');
            const data = await response.json();
            if (data && data.events) {
                eventos = data.events.map(event => ({
                    title: event.title,
                    category: event.categories[0]?.title || 'General',
                    date: new Date(event.geometry[0]?.date).toLocaleDateString()
                }));
            }
            localStorage.setItem(cacheKey, JSON.stringify({ data: eventos, expiry: Date.now() + 30 * 60 * 1000 }));
        }

        let html = `<div class="card"><h2>🌋 Desastres (NASA)</h2>`;
        eventos.forEach(e => {
            html += `<div style="margin-bottom: 8px; font-size: 0.85rem; border-bottom: 1px solid #30363d;">
                        ⚠️ <strong>${e.category}</strong>: ${e.title} <br><small style="color: #8b949e;">${e.date}</small>
                     </div>`;
        });
        html += `</div>`;
        dashboardEl.innerHTML += html;
    } catch (err) { console.error("Error NASA", err); }
}

// --- 2. Módulo Noticias en Vivo ---
function renderNewsSection() {
    const html = `
    <div class="card">
        <h2>📡 Noticias en Vivo</h2>
        <select id="newsSelect" onchange="changeNews(this.value)" style="width:100%; background:#0d1117; color:#fff; padding:5px; margin-bottom:10px;">
            <option value="kZJUy3_qH6k">CNN International</option>
            <option value="AC0hW-Z48nU">BBC News</option>
            <option value="kL7r_g21y2w">DW News</option>
            <option value="9Auq9mYxFEE">Sky News</option>
        </select>
        <iframe id="newsPlayer" width="100%" height="200" src="https://www.youtube.com/embed/kZJUy3_qH6k" frameborder="0" allowfullscreen></iframe>
    </div>`;
    dashboardEl.innerHTML += html;
}

// Función global para cambiar el canal en la misma tarjeta
window.changeNews = function(videoId) {
    document.getElementById('newsPlayer').src = "https://www.youtube.com/embed/" + videoId;
};

// --- Inicialización ---
async function init() {
    statusEl.innerText = "Cargando sistemas...";
    dashboardEl.innerHTML = ""; // Limpiamos para evitar duplicados
    
    await renderNasaSection();
    renderNewsSection();
    
    statusEl.style.display = 'none';
}

init();
