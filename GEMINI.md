# Reloj Espacial de Elliot — Project Context

Contexto operativo para el desarrollo y mantenimiento del reloj dual (CO/ES).

## Arquitectura & Stack
- **Frontend:** Vanilla HTML5, CSS3 (Variables nativas, BEM lite), JS (ES6+).
- **Animaciones:** `requestAnimationFrame` para suavidad, CSS Keyframes para estados.
- **Assets:** SVGs dinámicos inyectados vía `fetch` para manipulación de paths.
- **Design System:** Avatar Chibi v2.0 (512x512, trazos 4px, Cel Shading 15%).

## Estados y Lógica
- **Ciclo de Emociones:** `feliz` (default), `triste`, `ira`, `miedo`, `asco`, `sorpresa`.
- **Modos de Tiempo:**
    - **Awake (06:00 - 20:59):** Animación de flotación, colores de emoción activos.
    - **Asleep (21:00 - 05:59):** Animación de respiración lenta, ojos cerrados, penumbra visual (brightness 0.3), Zzz activas.
- **Interacciones de UI:**
    - **Zoom Pulse:** Al tocar las tarjetas de tiempo (`.clock-card`), se dispara una animación de zoom en el display de la hora.
    - **Feedback Táctil:** Cursor puntero en las tarjetas para indicar interactividad.
    - **Footer Personal:** Créditos dinámicos al final de la página.

## Diferenciación
- **Elliot (ID: co):** Escala 0.8x, animaciones rápidas.
- **Papá (ID: es):** Escala 1.0x, animaciones lentas.

## Configuración de Red
- **Timezones:** `America/Bogota` y `Europe/Madrid`.
- **Inyección:** Los SVGs deben cargarse desde `assets/elliot.svg` y `assets/papa.svg`.

## Roadmap / Pendientes
- [ ] Optimización de accesibilidad (aria-labels en estados dinámicos).
- [ ] Auditoría de contraste en modo `asleep`.
- [ ] Implementación de Service Worker para modo offline.

---
*Marco SRE Mentor - Automate or Die.*
