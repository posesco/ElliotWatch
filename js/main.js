/**
 * Reloj Espacial de Elliot - Lógica Principal
 * Optimizado con Cache de DOM y RequestAnimationFrame
 */

const CONFIG = {
    starsCount: 150,
    emocionesCiclo: ['feliz', 'triste', 'ira', 'miedo', 'asco', 'sorpresa'],
    timezones: {
        co: 'America/Bogota',
        es: 'Europe/Madrid'
    }
};

// Cache de Elementos del DOM
const DOM = {
    stars: document.getElementById('stars'),
    clocks: {
        co: {
            container: document.querySelector('#col-co .avatar-container'),
            card: document.getElementById('card-co'),
            time: document.getElementById('time-co'),
            secondsText: document.getElementById('sec-text-co'),
            ampm: document.getElementById('ampm-co'),
            icon: document.getElementById('icon-co'),
            date: document.getElementById('date-co')
        },
        es: {
            container: document.querySelector('#col-es .avatar-container'),
            card: document.getElementById('card-es'),
            time: document.getElementById('time-es'),
            secondsText: document.getElementById('sec-text-es'),
            ampm: document.getElementById('ampm-es'),
            icon: document.getElementById('icon-es'),
            date: document.getElementById('date-es')
        }
    }
};

/**
 * Inicialización
 */
async function init() {
    createStars();
    await loadAvatars();
    setupInteractions();
    
    // Iniciar bucle de animación
    requestAnimationFrame(updateAllClocks);
}

/**
 * Carga los SVGs de los avatares desde archivos externos e inyecta en el DOM
 */
async function loadAvatars() {
    const avatars = [
        { prefix: 'co', path: 'assets/elliot.svg' },
        { prefix: 'es', path: 'assets/papa.svg' }
    ];

    for (const avatar of avatars) {
        try {
            const response = await fetch(avatar.path);
            const svgText = await response.text();
            const container = DOM.clocks[avatar.prefix].container;
            if (container) {
                container.innerHTML = svgText;
            }
        } catch (error) {
            console.error(`Error cargando avatar ${avatar.prefix}:`, error);
        }
    }
}

/**
 * Genera el fondo de estrellas animadas
 */
function createStars() {
    for (let i = 0; i < CONFIG.starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        DOM.stars.appendChild(star);
    }
}

/**
 * Configura las interacciones de clic en los astronautas
 */
function setupInteractions() {
    Object.keys(DOM.clocks).forEach(prefix => {
        const { container, card } = DOM.clocks[prefix];
        
        // Clic en el astronauta (Cambio de emoción)
        container.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el clic en el avatar dispare el zoom de la tarjeta si se solapan
            let currentEmotion = CONFIG.emocionesCiclo.find(e => container.classList.contains(`emotion-${e}`)) || 'feliz';
            let nextIndex = (CONFIG.emocionesCiclo.indexOf(currentEmotion) + 1) % CONFIG.emocionesCiclo.length;
            setEmotion(prefix, CONFIG.emocionesCiclo[nextIndex]);
        });

        // Clic en la tarjeta (Efecto Zoom en la hora)
        card.addEventListener('click', () => {
            const timeDisplay = card.querySelector('.time-display');
            if (timeDisplay) {
                timeDisplay.classList.remove('zoom-pulse');
                void timeDisplay.offsetWidth; // Trigger reflow para reiniciar animación
                timeDisplay.classList.add('zoom-pulse');
            }
        });
    });
}

/**
 * Cambia la emoción de un astronauta
 */
function setEmotion(prefix, emotion) {
    const container = DOM.clocks[prefix].container;
    const column = document.getElementById(prefix === 'co' ? 'col-co' : 'col-es');
    if (!container || !column) return;
    
    // Eliminar todas las posibles clases de emoción
    CONFIG.emocionesCiclo.forEach(e => {
        container.classList.remove(`emotion-${e}`);
        column.classList.remove(`emotion-${e}`);
    });
    
    container.classList.add(`emotion-${emotion}`);
    column.classList.add(`emotion-${emotion}`);
}

/**
 * Obtiene el tiempo detallado por zona horaria
 */
function getTimeByZone(timezone) {
    const now = new Date();
    const options = { timeZone: timezone };
    
    // Usamos Intl para obtener la hora exacta en la zona horaria
    const formatter = new Intl.DateTimeFormat('en-US', {
        ...options,
        hour: 'numeric', hour12: false,
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3 // Para suavidad en analógico
    });
    
    const parts = formatter.formatToParts(now);
    let h = 0, m = 0, s = 0, ms = 0;
    parts.forEach(p => {
        if (p.type === 'hour') h = parseInt(p.value);
        if (p.type === 'minute') m = parseInt(p.value);
        if (p.type === 'second') s = parseInt(p.value);
        if (p.type === 'fractionalSecond') ms = parseInt(p.value);
    });
    
    return { hours24: h, minutes: m, seconds: s, ms: ms, date: now };
}

/**
 * Actualiza la UI de un reloj específico
 */
function updateClockUI(prefix) {
    const timezone = CONFIG.timezones[prefix];
    const { hours24, minutes, seconds, ms, date } = getTimeByZone(timezone);
    const clock = DOM.clocks[prefix];

    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    const isDay = hours24 >= 6 && hours24 < 21; 
    const isSolar = (hours24 >= 6 && hours24 < 18);
    const icon = isSolar ? '☀️' : '🌙';

    // Gestión de Estados (Astronauta y Tarjeta)
    const column = document.getElementById(prefix === 'co' ? 'col-co' : 'col-es');
    if (isDay) {
        column.classList.add('awake');
        column.classList.remove('asleep');
        clock.card.classList.add('theme-day');
        clock.card.classList.remove('theme-night');
    } else {
        column.classList.add('asleep');
        column.classList.remove('awake');
        clock.card.classList.add('theme-night');
        clock.card.classList.remove('theme-day');
    }

    // Actualización Reloj Digital
    clock.time.textContent = `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    clock.secondsText.textContent = String(seconds).padStart(2, '0');
    clock.ampm.textContent = ampm;
    clock.icon.textContent = icon;

    // Actualización Fecha
    const dateStr = date.toLocaleDateString('es-ES', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    clock.date.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

/**
 * Bucle de animación principal
 */
function updateAllClocks() {
    updateClockUI('co');
    updateClockUI('es');
    requestAnimationFrame(updateAllClocks);
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', init);