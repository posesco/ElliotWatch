# Design System: Avatar Chibi Espacial v2.0

## 1. Estilo Visual y Geometría
* **Proporción:** Relación 1:1 (Cabeza/Casco ocupa el 50% de la altura total).
* **Line Art:** Contorno exterior grueso y constante (Stroke: 3pt - 5pt). Esquinas redondeadas (Round Join/Cap).
* **Sombreado:** Estilo *Cel Shading* simple. Un solo tono de sombra interna con 15% de opacidad del color base.

## 2. Paleta de Colores (Referencia Hex)
| Elemento | Código Hex | Uso |
| :--- | :--- | :--- |
| **Traje Principal (Rojo)** | `#E63946` | Base del cuerpo y casco |
| **Traje Principal (Azul)** | `#0077B6` | Base del cuerpo y casco |
| **Traje Principal (Amarillo)**| `#FFB703` | Base del cuerpo y casco |
| **Visor** | `#1A1A1B` | Cristal frontal (Negro mate) |
| **Detalle Visor** | `#FFFFFF` | Reflejo curvo (Opacidad 60%) |
| **Uniones/Gomas** | `#2B2D42` | Cuello, puños y rodillas |
| **Botones Panel** | `#4CAF50`, `#FF5252`, `#FFD700` | Verde, Rojo y Dorado |

## 3. Arquitectura de Capas (Z-Index)
El avatar se construye mediante un sistema de capas superpuestas para permitir cambios de color dinámicos vía CSS o SVG:

1.  **Z-10 (Mochila):** Situada detrás del cuerpo. Incluye antena lateral.
2.  **Z-20 (Base Cuerpo):** Tronco, brazos y piernas (Color dinámico).
3.  **Z-30 (Uniones):** Bandas oscuras en articulaciones.
4.  **Z-40 (Panel de Pecho):** Rectángulo base claro con matriz de botones.
5.  **Z-50 (Casco):** Esfera principal.
6.  **Z-60 (Visor):** Forma ovalada negra con brillo superior.
7.  **Z-70 (Accesorios/Logos):** Capa superior para banderas o iconos en hombros.

## 4. Componentes Modulares
* **Panel de Pecho:** Debe contener al menos 4 botones rectangulares de colores primarios.
* **Visor:** Forma de "D" invertida o circular, siempre con un reflejo en forma de arco en la parte superior izquierda.
* **Mochila de Soporte:** Diseño rectangular con bordes redondeados, acoplada al centro de la espalda.

## 5. Especificaciones de Exportación
* **Formato Nativo:** SVG (Optimizado para manipulación de `fill` por ID).
* **ViewBox:** `0 0 512 512` (Para asegurar escalabilidad perfecta).
* **Naming Convention:** `astro-[color]-[parte].svg` (Ej: `astro-red-helmet.svg`).