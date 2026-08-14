const dashboardEl = document.getElementById('dashboard');
const statusEl = document.getElementById('status');

// --- 1. Módulo NASA (Este funciona bien) ---
async function renderNasaSection() {
    try {
        const cacheKey = 'wm_nasa_events_v3';
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

// --- 2. Módulo Noticias en Vivo (CORREGIDO: Ahora son enlaces directos) ---
function renderNewsSection() {
    try {
        const html = `
        <div class="card">
            <h2>📡 Noticias en Vivo (Global)</h2>
            <p style="font-size: 0.8rem; color: #8b949e; margin-bottom: 15px; line-height: 1.4;">
                YouTube y las cadenas bloquean los vídeos en vivo dentro de otras páginas web. Selecciona un canal para abrir la señal oficial en una pestaña nueva:
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <a href="https://www.youtube.com/watch?v=dp83H9GS5ig" target="_blank" style="background: #21262d; color: #58a6ff; padding: 12px 15px; text-decoration: none; border-radius: 6px; border: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: bold; transition: background 0.2s;">
                    <span>🔴 Bloomberg TV</span> <span style="font-size: 0.8rem; font-weight: normal; color: #8b949e;">Ver directo ↗</span>
                </a>
                <a href="https://www.youtube.com/watch?v=hJWkjiUtoUQ" target="_blank" style="background: #21262d; color: #58a6ff; padding: 12px 15px; text-decoration: none; border-radius: 6px; border: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: bold; transition: background 0.2s;">
                    <span>🔴 Al Jazeera English</span> <span style="font-size: 0.8rem; font-weight: normal; color: #8b949e;">Ver directo ↗</span>
                </a>
                <a href="https://www.youtube.com/watch?v=kZJUy3_qH6k" target="_blank" style="background: #21262d; color: #58a6ff; padding: 12px 15px; text-decoration: none; border-radius: 6px; border: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: bold; transition: background 0.2s;">
                    <span>🔴 CNN International</span> <span style="font-size: 0.8rem; font-weight: normal; color: #8b949e;">Ver directo ↗</span>
                </a>
                <a href="https://www.youtube.com/watch?v=AC0hW-Z48nU" target="_blank" style="background: #21262d; color: #58a6ff; padding: 12px 15px; text-decoration: none; border-radius: 6px; border: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: bold; transition: background 0.2s;">
                    <span>🔴 BBC News</span> <span style="font-size: 0.8rem; font-weight: normal; color: #8b949e;">Ver directo ↗</span>
                </a>
                <a href="https://www.youtube.com/watch?v=X35qJ6g9o_U" target="_blank" style="background: #21262d; color: #58a6ff; padding: 12px 15px; text-decoration: none; border-radius: 6px; border: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: bold; transition: background 0.2s;">
                    <span>🔴 TVE 24h (España)</span> <span style="font-size: 0.8rem; font-weight: normal; color: #8b949e;">Ver directo ↗</span>
                </a>
                <a href="https://www.youtube.com/watch?v=J957d5_5q6k" target="_blank" style="background: #21262d; color: #58a6ff; padding: 12px 15px; text-decoration: none; border-radius: 6px; border: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: bold; transition: background 0.2s;">
                    <span>🔴 CNN Brasil</span> <span style="font-size: 0.8rem; font-weight: normal; color: #8b949e;">Ver directo ↗</span>
                </a>
                 <a href="https://www.youtube.com/watch?v=kL7r_g21y2w" target="_blank" style="background: #21262d; color: #58a6ff; padding: 12px 15px; text-decoration: none; border-radius: 6px; border: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: bold; transition: background 0.2s;">
                    <span>🔴 DW News</span> <span style="font-size: 0.8rem; font-weight: normal; color: #8b949e;">Ver directo ↗</span>
                </a>
            </div>
        </div>`;
        dashboardEl.innerHTML += html;
    } catch (err) {
        console.error("Error Noticias", err);
    }
}

async function init() {
    try {
        statusEl.innerText = "Cargando sistemas...";
        dashboardEl.innerHTML = "";
        
        await renderNasaSection();
        renderNewsSection();
    } catch (err) {
        console.error("Error en init:", err);
    } finally {
        // Esto se ejecuta siempre, garantizando que el texto de carga desaparezca
        statusEl.style.display = 'none';
    }
}

init();
