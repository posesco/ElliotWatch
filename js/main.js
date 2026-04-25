/**
 * Reloj Espacial de Elliot - Lógica Principal
 * Optimizado con Cache de DOM y RequestAnimationFrame
 */

const CONFIG = {
    starsCount: 150,
    emocionesCiclo: ['feliz', 'triste', 'ira'],
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
            date: document.getElementById('date-co'),
            handHour: document.getElementById('hour-co'),
            handMin: document.getElementById('min-co'),
            handSec: document.getElementById('sec-co'),
            analog: document.getElementById('analog-co')
        },
        es: {
            container: document.querySelector('#col-es .avatar-container'),
            card: document.getElementById('card-es'),
            time: document.getElementById('time-es'),
            secondsText: document.getElementById('sec-text-es'),
            ampm: document.getElementById('ampm-es'),
            icon: document.getElementById('icon-es'),
            date: document.getElementById('date-es'),
            handHour: document.getElementById('hour-es'),
            handMin: document.getElementById('min-es'),
            handSec: document.getElementById('sec-es'),
            analog: document.getElementById('analog-es')
        }
    }
};

/**
 * Inicialización
 */
function init() {
    createStars();
    addClockNumbers('co');
    addClockNumbers('es');
    setupInteractions();
    
    // Iniciar bucle de animación
    requestAnimationFrame(updateAllClocks);
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
 * Añade números a los relojes analógicos
 */
function addClockNumbers(prefix) {
    const container = DOM.clocks[prefix].analog;
    for (let i = 1; i <= 12; i++) {
        const num = document.createElement('div');
        num.className = 'clock-number';
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const radius = 65;
        const x = 80 + radius * Math.cos(angle) - 8;
        const y = 80 + radius * Math.sin(angle) - 10;
        num.style.left = x + 'px';
        num.style.top = y + 'px';
        num.textContent = i;
        container.appendChild(num);
    }
}

/**
 * Configura las interacciones de clic en los astronautas
 */
function setupInteractions() {
    Object.keys(DOM.clocks).forEach(prefix => {
        const container = DOM.clocks[prefix].container;
        container.addEventListener('click', () => {
            let currentEmotion = CONFIG.emocionesCiclo.find(e => container.classList.contains(`emotion-${e}`)) || 'feliz';
            let nextIndex = (CONFIG.emocionesCiclo.indexOf(currentEmotion) + 1) % CONFIG.emocionesCiclo.length;
            setEmotion(prefix, CONFIG.emocionesCiclo[nextIndex]);
        });
    });
}

/**
 * Cambia la emoción de un astronauta
 */
function setEmotion(prefix, emotion) {
    const container = DOM.clocks[prefix].container;
    if (!container) return;
    container.classList.remove('emotion-feliz', 'emotion-triste', 'emotion-ira');
    container.classList.add(`emotion-${emotion}`);
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
    if (isDay) {
        clock.container.classList.add('awake');
        clock.container.classList.remove('asleep');
        clock.card.classList.add('theme-day');
        clock.card.classList.remove('theme-night');
    } else {
        clock.container.classList.add('asleep');
        clock.container.classList.remove('awake');
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

    // Actualización Reloj Analógico (Movimiento Suave)
    const smoothSeconds = seconds + (ms / 1000);
    const secDeg = (smoothSeconds / 60) * 360;
    const minDeg = ((minutes + smoothSeconds / 60) / 60) * 360;
    const hourDeg = ((hours24 % 12 + (minutes + smoothSeconds / 60) / 60) / 12) * 360;

    clock.handSec.style.transform = `rotate(${secDeg}deg)`;
    clock.handMin.style.transform = `rotate(${minDeg}deg)`;
    clock.handHour.style.transform = `rotate(${hourDeg}deg)`;
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