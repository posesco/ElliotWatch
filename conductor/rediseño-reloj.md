# Plan de Auditoría y Optimización (Fase 2)

## Objetivo
Elevar la calidad del código de la aplicación "Reloj Espacial de Elliot" a estándares profesionales de Frontend, separando responsabilidades, optimizando el rendimiento de las animaciones y mejorando la organización de los archivos. Adicionalmente, implementar un *favicon* galáctico.

## Estado Actual
El proyecto consta de un único archivo `index.html` monolítico de más de 700 líneas.
- CSS y JS están incrustados en `<style>` y `<script>`.
- Los SVG de los avatares (Elliot y Papá) engordan considerablemente el HTML.
- Las actualizaciones de reloj cada segundo usan `setInterval` y múltiples llamadas costosas a `document.getElementById`.

## Pasos de Implementación

### 1. Reestructuración de Directorios
- Crear carpeta `css/` y mover los estilos a `css/main.css`.
- Crear carpeta `js/` y mover la lógica de la aplicación a `js/main.js`.
- Crear carpeta `assets/` para imágenes estáticas, SVGs, o el *favicon*.
- Enlazar los archivos externos en `index.html` (`<link rel="stylesheet">` y `<script src="..." defer>`).

### 2. Optimización de Rendimiento en JS (Caching y RequestAnimationFrame)
- En `js/main.js`, declarar las referencias a elementos del DOM globalmente o dentro de un objeto `const DOM = {}` para evitar hacer *queries* en cada iteración del reloj (ej. `document.getElementById('time-co')`).
- Reemplazar `setInterval(tick, 1000)` con `requestAnimationFrame(loop)`. Esto permitirá que las manecillas del reloj analógico se muevan fluidamente (como un reloj de barrido continuo) en vez de saltar de segundo en segundo, aprovechando los 60Hz del monitor.

### 3. Creación de Favicon
- Generar un archivo `assets/favicon.svg` usando un diseño de planeta, estrella o un mini astronauta Chibi simplificado.
- Enlazar el favicon en el `<head>` del `index.html` mediante `<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">`.

## Pruebas y Validación
- Revisar que la carga en el navegador es igual de rápida pero el código fuente es modular.
- Comprobar que la consola del navegador no muestre errores por archivos no encontrados (404).
- Confirmar que los relojes avanzan suavemente gracias a `requestAnimationFrame`.
- Observar que el favicon aparece en la pestaña del navegador.