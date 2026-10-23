# Proyecto 03 — Practica-Mapa

El mapa existente está integrado en `http://127.0.0.1:4173/projects/project-03/`. La imagen y el botón de la tercera tarjeta abren esa ruta en la misma pestaña.

## Inicio local

Desde la raíz del portafolio:

```powershell
npm run build
npm run check
npm run preview
```

La portada está en `http://127.0.0.1:4173/`. No se necesita Python para visualizar el mapa. No abrir HTML mediante `file://`. Para editar con recompilación automática, detener `preview` y ejecutar `npm run dev`; ambos usan el mismo puerto.

## Fuentes y conservación

Repositorio: https://github.com/IssamJim/Practica-Mapa

Revisión inspeccionada: `32d1d80a1ac4102334a1e349608f86512a5d49b4`.

Los originales `Map1.html`, `map1.py`, `parquesyjardines1.xlsx`, `Volcanoes.txt`, `world.json` y README se guardaron sin modificaciones en `source-materials/practica-mapa/`, fuera de la distribución pública. `evidence.json` conserva la revisión y el inventario remoto.

Se reutiliza el HTML generado por Folium. No se regeneraron los datos ni se reconstruyeron las capas. Las geometrías, coordenadas y estilos de los 894 marcadores conservan los valores del mapa descargado. Los atributos de los popups se conservan y su presentación se organiza en nombre, dirección y superficie. Los archivos contienen 832 registros de parques, 62 volcanes y 246 elementos geográficos. El sombreado utiliza **POP2005**, que no representa población actual. Se conservaron los umbrales y colores originales.

## Archivos de integración

- `projects/project-03/index.html`: página del portafolio, iframe del mismo origen, idioma, retorno y enlace al repositorio.
- `projects/project-03/integration.js`: usa el selector y almacenamiento `portfolio-language` existentes. Envía explícitamente el idioma al iframe mediante `postMessage`, tanto al cambiarlo como al recibir el aviso de que el mapa está listo. Verifica el origen y la ventana emisora.
- `projects/project-03/integration.css`: disposición responsive de la página y tamaño del iframe.
- `projects/project-03/map/index.html`: copia adaptada del mapa generado, con los mismos datos integrados.
- `projects/project-03/map/map-integration.js`: traducciones de capas, etiquetas de popups y controles; conserva posición, zoom y capas seleccionadas. Los popups de volcanes originalmente incrustados en iframes `data:` se presentan como texto traducible, conservando su altura. Añade acceso con teclado a los marcadores y aviso/reintento si falla el mapa base.
- `projects/project-03/map/map.css`: ajustes de controles, popups, foco y aviso de conexión dentro del iframe.
- `projects/project-03/map/vendor/`: Leaflet 1.6.0 y jQuery 1.12.4, las versiones del mapa original, alojadas localmente con sus licencias e imágenes de controles. Se omitieron Bootstrap y complementos de iconos no utilizados por este mapa de círculos.
- `public/assets/images/practica-mapa-preview.webp`: captura real del mapa integrado, 998 × 649 píxeles, aproximadamente 155 KiB. Vista de Hermosillo con parques y población desactivada mediante el control existente. La atribución está visible en la imagen y en la tarjeta. No se carga un mapa interactivo en la portada.
- `index.html`, `src/locales/es.js`, `src/locales/en.js`, `src/css/input.css`: tercera tarjeta, textos bilingües y estilo de su imagen. La búsqueda de clases de Tailwind se limita a las páginas de proyecto para no analizar megabytes de datos geográficos como si fueran clases CSS.
- `scripts/build.mjs`, `scripts/check.mjs`: inclusión explícita de los archivos del mapa y comprobación de sus enlaces; ahora existen cinco documentos HTML públicos, contando el iframe.

## Mapa base y dependencias externas

El endpoint original de Stamen Terrain devolvió HTTP 503 durante la revisión. El retiro del servicio está documentado en https://stamen.com/stamen-x-stadia-the-end-of-the-road-for-stamens-legacy-map-tiles/.

La copia integrada utiliza `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, con atribución enlazada a https://www.openstreetmap.org/copyright. Se verificó la carga de teselas reales. Se mantienen las cachés y el Referer normales del navegador; no hay descargas masivas, funciones offline, credenciales ni servicios de pago. Política del proveedor: https://operations.osmfoundation.org/policies/tiles/.

El mapa base requiere Internet. Si falla, aparece un aviso bilingüe y un botón de reintento; las capas locales permanecen disponibles. Los scripts, estilos y datos se sirven desde el portafolio y quedan aislados dentro del iframe. El mapa no carga scripts externos de CDN. No se añadieron paquetes npm ni se actualizaron frameworks.

## Regeneración futura

No se ejecutó `map1.py` para esta integración. Solo es necesario si se desea generar otro mapa desde Excel y los demás datos; utiliza Folium, pandas y un lector Excel compatible. Antes de ejecutarlo en una copia de trabajo hay que corregir `pandas.read_csv("volcanoes.txt")` a `pandas.read_csv("Volcanoes.txt")` y reemplazar su configuración antigua de Stamen por un proveedor vigente. Después se deben volver a aplicar las adaptaciones de integración y comprobar las traducciones; no sobrescribir directamente la página adaptada con un HTML recién generado.

## Verificación y límites

- Build y comprobaciones estáticas del portafolio; enlaces locales y copias públicas.
- Comparación de datos del mapa y archivos de Proyectos 01/02 y secciones ajenas a la tercera tarjeta.
- Carga real de teselas y captura auténtica del mapa integrado, con atribución.
- Pruebas de navegador completadas: imagen y botón de la tarjeta, ruta directa y recarga, retorno, ES/EN en página e iframe, conservación de centro/zoom/capas al traducir, popups de parques y volcanes, zoom/desplazamiento, controles de capas, aviso/reintento de fallo y anchos 320/390/820/1440 px sin desbordamiento. Sin errores de integración ni recursos requeridos con 404. Guardadas en `tmp/map-check.cjs`. Tras comprobar las teselas reales, las solicitudes posteriores de esa sesión de pruebas se interceptan para no generar tráfico repetitivo al proveedor al probar movimiento y tamaños. Esta interceptación existe solo en la prueba, nunca en el sitio ni en la captura de portada.

La validación de navegador cubre Edge/Chromium. No se comprobaron Safari/Firefox, dispositivos físicos ni un lector de pantalla real. Se preserva la información del repositorio sin verificar de nuevo su exactitud geográfica ni actualizar sus fechas. No se publicó ni desplegó el portafolio.

## Mejora de información y popups — 21 de octubre de 2026

El usuario aprobó el contenido propuesto en `tmp/project03-content-proposal.md` antes de incorporarlo. Se conserva la introducción, la nota sobre POP2005 y los textos anteriores. Las nuevas secciones ES/EN incluyen objetivo, tecnologías, funcionamiento, función Python original y resultados basados en los archivos existentes.

La guía «Cómo leer el mapa» está inmediatamente después del mapa. Explica cada capa, su magnitud y unidad, los controles y el radio constante de los puntos. Los umbrales coinciden con `map1.py` y con el estilo de las 246 geometrías integradas:

| Capa | Verde | Naranja | Rojo |
| --- | --- | --- | --- |
| Parques: superficie | < 960 m² | ≥ 960 y < 3 350 m² | ≥ 3 350 m² |
| Volcanes: altura | < 960 m | ≥ 960 y < 3 350 m | ≥ 3 350 m |
| Población total en 2005 | < 10 millones | ≥ 10 y < 20 millones | ≥ 20 millones |

Los nombres de los colores y los intervalos aparecen como texto. La guía aclara que los colores no indican calidad ni riesgo volcánico, que la población no es densidad y que los ceros del archivo no garantizan ausencia de habitantes. Las cifras 832 / 62 / 246 se identifican como recuentos de registros, no como lugares únicos.

### Corrección de legibilidad

Los popups originales pasaban `maxWidth: "100%"` a Leaflet, cuyo cálculo requiere un número. La integración establece un máximo numérico de hasta 320 px, acotado por el ancho del mapa. Se reserva espacio para los controles y la atribución, y se recalculan dimensiones al cambiar el tamaño de la ventana. La altura se limita al espacio disponible; si hace falta, el contenido se desplaza dentro de la ventana.

El nombre tiene 18 px, peso 650 y fondo blanco; dirección y superficie se presentan con etiquetas separadas. El texto puede partir líneas sin elipsis. Los valores se insertan con `textContent` y se mantienen íntegros, salvo espacios de separación sin significado visual. Un registro con formato inesperado conserva su texto original como alternativa.

Los marcadores mantienen acceso con Tab y Enter/Espacio. La ventana tiene `role="dialog"`, nombre y descripción asociados, recibe foco y se cierra con Escape. Al cerrar, el foco vuelve al marcador y el diálogo se oculta a tecnologías de asistencia durante la animación de retirada de Leaflet. La traducción del botón de cierre se aplica al popup que acaba de abrirse, incluso al cambiar rápidamente entre marcadores.

### Reutilización e inventario de esta mejora

Nuevo:

- `public/assets/project-detail.css`: componentes existentes del Proyecto 01 extraídos sin cambiar sus declaraciones; se reutilizan encabezados, navegación, paneles, pasos, resultados y código.

Modificados:

- `projects/project-03/index.html`: estructura y contenido aprobado, guía y bloque de código.
- `projects/project-03/integration.css`: leyenda, listas, cuadrícula responsive y tamaño del mapa.
- `projects/project-03/map/map-integration.js`: popups estructurados, dimensiones y foco accesible.
- `projects/project-03/map/map.css`: tipografía, contraste, espaciado y cierre de popups.
- `src/locales/es.js` y `src/locales/en.js`: nuevas claves `map.details.*`; todas las traducciones anteriores se conservan.
- `projects/project-01/index.html`: carga de la hoja compartida.
- `projects/project-01/project.css`: conserva solo los estilos específicos de Power BI; el resto está en la hoja compartida.
- `PROJECT1-INTEGRATION.md`, `PROJECT3-INTEGRATION.md` y `VALIDATION.md`: documentación.

No se eliminan archivos de producción. El HTML de datos del mapa, proveedores, bibliotecas, portada y Proyecto 02 no se modifican. `dist/` se regenera. Las copias anteriores y los artefactos de revisión están en `tmp/project03-ux-before/` y `tmp/review/`.

### Propuestas adicionales pendientes

Estas propuestas **no están implementadas** y requieren autorización del usuario:

1. **Buscador y lista textual de parques.** Evitar recorrer cientos de marcadores con Tab y facilitar la consulta por nombre. Impacto esperado: alto en accesibilidad y rapidez de consulta.
2. **Accesos a Hermosillo, volcanes y vista mundial.** Encuadrar cada capa sin tener que localizarla mediante desplazamiento manual. Impacto esperado: medio/alto en orientación y descubrimiento.
3. **Revisión de calidad y procedencia de los datos.** Identificar duplicados, valores cero y fechas; decidir con el usuario cómo representarlos antes de corregir registros. Impacto esperado: alto en claridad y confianza.
4. **Carga diferida del mapa y medición de rendimiento.** El HTML actual del mapa ocupa 3 278 268 bytes sin comprimir. Evaluar la carga al acercarse a la sección y medir el resultado en móvil; no se promete un porcentaje de mejora. La [documentación de web.dev](https://web.dev/articles/iframe-lazy-loading) explica cómo diferir iframes fuera de pantalla. Impacto esperado: menor trabajo inicial, sujeto a medición.
