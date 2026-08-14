const dashboardEl = document.getElementById('dashboard');
const statusEl = document.getElementById('status');

async function renderNasaSection() {
    try {
        const cacheKey = 'wm_nasa_events_v2';
        const cached = localStorage.getItem(cacheKey);
        let eventos = [];

        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() < parsed.expiry) eventos = parsed.data;
        }

        if (eventos.length === 0) {
            const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=5');
            if (response.ok) {
                const data = await response.json();
                if (data && data.events) {
                    eventos = data.events.map(event => ({
                        title: event.title,
                        category: event.categories[0]?.title || 'General',
                        date: new Date(event.geometry[0]?.date).toLocaleDateString()
                    }));
                }
            }
            localStorage.setItem(cacheKey, JSON.stringify({ data: eventos, expiry: Date.now() + 30 * 60 * 1000 }));
        }

        let html = `<div class="card"><h2>🌋 Desastres (NASA)</h2>`;
        if (eventos.length === 0) {
            html += `<p>No hay eventos recientes.</p>`;
        } else {
            eventos.forEach(e => {
                html += `<div style="margin-bottom: 8px; font-size: 0.85rem; border-bottom: 1px solid #30363d; padding-bottom: 5px;">
                            ⚠️ <strong>${e.category}</strong>: ${e.title} <br><small style="color: #8b949e;">${e.date}</small>
                         </div>`;
            });
        }
        html += `</div>`;
        dashboardEl.innerHTML += html;
    } catch (err) {
        console.error("Error NASA", err);
        dashboardEl.innerHTML += `<div class="card"><h2>🌋 Desastres (NASA)</h2><p style="color:#ff7b72;">Error al cargar datos.</p></div>`;
    }
}

function renderNewsSection() {
    try {
        const html = `
        <div class="card">
            <h2>📡 Noticias en Vivo</h2>
            <select id="newsSelect" onchange="changeNews(this.value)" style="width:100%; background:#0d1117; color:#fff; padding:5px; margin-bottom:10px; border:1px solid #30363d; border-radius:4px;">
                <option value="kZJUy3_qH6k">CNN International</option>
                <option value="AC0hW-Z48nU">BBC News</option>
                <option value="hJWkjiUtoUQ">Al Jazeera English</option>
                <option value="dp83H9GS5ig">Bloomberg TV</option>
                <option value="X35qJ6g9o_U">TVE 24h (España)</option>
                <option value="J957d5_5q6k">CNN Brasil</option>
                <option value="kL7r_g21y2w">DW News</option>
                <option value="9Auq9mYxFEE">Sky News</option>
            </select>
            <iframe id="newsPlayer" width="100%" height="200" src="https://www.youtube.com/embed/kZJUy3_qH6k" frameborder="0" allowfullscreen style="border-radius:4px;"></iframe>
        </div>`;
        dashboardEl.innerHTML += html;
    } catch (err) {
        console.error("Error Noticias", err);
    }
}

window.changeNews = function(videoId) {
    const player = document.getElementById('newsPlayer');
    if (player) player.src = "https://www.youtube.com/embed/" + videoId;
};

async function init() {
    try {
        statusEl.innerText = "Cargando sistemas...";
        dashboardEl.innerHTML = "";
        
        await renderNasaSection();
        renderNewsSection();
    } catch (err) {
        console.error("Error en init:", err);
    } finally {
        statusEl.style.display = 'none';
    }
}

init();
