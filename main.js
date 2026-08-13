import { DisastersModule } from './src/modules/DisastersModule.js';

const dashboardEl = document.getElementById('dashboard');
const statusEl = document.getElementById('status');

async function init() {
    try {
        statusEl.innerText = "Conectando con satélites de la NASA...";
        
        // Iniciamos el módulo
        const disastersAPI = new DisastersModule();
        const eventos = await disastersAPI.getEvents(10); // Pedimos 10 eventos
        
        statusEl.style.display = 'none'; // Ocultamos el mensaje de carga
        
        // Creamos el panel visual con HTML crudo y estructurado
        let html = `<div class="panel"><h2>🌋 Desastres (NASA)</h2>`;
        
        if (eventos.length === 0) {
            html += `<p>No hay eventos reportados.</p>`;
        } else {
            eventos.forEach(evento => {
                html += `<div style="margin-bottom: 12px; font-size: 0.95rem;">
                            ⚠️ <strong>${evento.category}</strong>: ${evento.title} <br>
                            <small style="color: #888;">Fecha de reporte: ${evento.date}</small>
                         </div>`;
            });
        }
        
        html += `</div>`;
        
        // Inyectamos el panel en la pantalla
        dashboardEl.innerHTML = html;
        
    } catch (error) {
        statusEl.innerText = `Error crítico: ${error.message}`;
        statusEl.style.color = "red";
    }
}

// Arrancamos el motor
init();
