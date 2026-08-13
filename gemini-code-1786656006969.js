import { DisastersModule } from './src/modules/DisastersModule.js';

const dashboardEl = document.getElementById('dashboard');
const statusEl = document.getElementById('status');

async function init() {
    try {
        statusEl.innerText = "Conectando con satélites de la NASA...";
        
        const disastersAPI = new DisastersModule();
        const eventos = await disastersAPI.getEvents(10);
        
        statusEl.style.display = 'none';
        
        let html = `<div class="panel"><h2>🌋 Desastres (NASA)</h2>`;
        
        if (!eventos || eventos.length === 0) {
            html += `<p>No hay eventos reportados.</p>`;
        } else {
            eventos.forEach(evento => {
                html += `<div style="margin-bottom: 12px; font-size: 0.95rem;">
                            ⚠️ <strong>${evento.category}</strong>: ${evento.title} <br>
                            <small style="color: #888;">Fecha: ${evento.date}</small>
                         </div>`;
            });
        }
        
        html += `</div>`;
        dashboardEl.innerHTML = html;
        
    } catch (error) {
        statusEl.innerText = `Error en el sistema: ${error.message}`;
        statusEl.style.color = "red";
        console.error(error);
    }
}

init();