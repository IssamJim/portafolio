# Proyecto 01: Power BI y Power Query

La página presenta dos piezas independientes, en este orden:

1. El informe público `Practica2(Videojuegos)` de Power BI, proporcionado por el usuario. Sustituye la referencia inicial a `SalesFunnelReport.pbix`.
2. El caso de estudio de Excel y Power Query, basado en las dos consultas originales de `IssamJim/PortfolioLinks`.

## Ejecutar y revisar

```powershell
npm run build
npm run check
npm run preview
```

Abrir `http://127.0.0.1:4173/projects/project-01/`. Para desarrollo con recompilación, usar `npm run dev` en lugar de `preview`. Publicar únicamente `dist/`; esta tarea no publica ni despliega el sitio.

## Power BI

La URL del iframe suministrado se conserva literalmente, sin añadir parámetros de idioma, filtros ni autenticación. El enlace de respaldo usa la misma URL. La estructura está en `projects/project-01/index.html`, dentro de `#powerbi-template`.

`embed.js` registra los eventos antes de insertar el iframe, para evitar perder el evento de carga. Incluye título descriptivo traducible, `loading="lazy"`, `allowfullscreen` y `frameborder="0"`. El contenedor `.powerbi-embed` mantiene una relación 16:9 para el lienzo y reserva 56 px para los controles de Power BI; el CSS adapta las dimensiones originales de 600 × 373.5 sin modificar la URL.

El placeholder muestra «Cargando dashboard…» al iniciarse la integración. Se oculta al cargar el documento del iframe. Power BI gestiona después su propia carga de datos. Si el documento tarda más de 20 segundos desde que se aproxima al área visible, se retira la cubierta y aparece un mensaje junto al enlace alternativo; una carga posterior normal elimina ese mensaje. Sin JavaScript, se mantiene una explicación y el enlace externo accesible.

El selector ES/EN traduce los textos de la página, metadatos, nombres accesibles y título del iframe. No recarga el iframe ni altera sus filtros. Las etiquetas internas del informe permanecen en el idioma configurado por su autor en Power BI.

## Caso de Excel: fuentes y precisión

- Consulta de transformación: `source-materials/portfolio-links/Excel Automatización Power Querypq.txt`.
- Consulta de tipos: `source-materials/portfolio-links/AutomatizacionPQExcel.pq`.
- Fuentes enlazadas al commit `68d62aef92c6d22b52a5a8a1bd3b48b9efda83c8` de [PortfolioLinks](https://github.com/IssamJim/PortfolioLinks).
- La consulta de transformación define los tipos de 24 columnas y conserva `date`, `city` y `sale_dollars`. Agrupa por período y ciudad. La consulta `.pq` define los tipos de `YearMonth`, `City` y `TotalSales` en otra tabla; no se afirma que ambos archivos estén conectados automáticamente.
- Resultado documentado: **24 columnas → 3 campos de trabajo**, **2 criterios de agrupación** y **2 consultas**. No se atribuyen ahorros de tiempo ni un impacto empresarial medido.
- El bloque de código reproduce íntegramente la consulta `.pq`. Se conserva su idioma y sus identificadores para no modificar el programa al traducir la página.
- `power-query-source.png` es una captura real del código original en GitHub, identificada como tal; no representa una ejecución del editor de Excel. El mismo código se ofrece como texto seleccionable y accesible.

El botón «Ver el código en GitHub» apunta al repositorio de estas consultas. El iframe de videojuegos es el recurso independiente proporcionado por el usuario; no se atribuye su archivo PBIX a ese repositorio.

## Archivos nuevos

- `projects/project-01/project.css`: estilos específicos del iframe de Power BI y sus estados de carga. Los componentes de página, pasos, resultados y código se extraen sin cambiar sus declaraciones a `public/assets/project-detail.css`, compartido con el Proyecto 03.
- `projects/project-01/embed.js`: carga del iframe, placeholder, estado de respuesta lenta y título localizado.
- `public/assets/images/project-01/power-query-source.png`: captura del código original.
- `public/assets/images/project-01/powerbi-videogames-preview.png`: captura real del informe público, utilizada en la portada.
- `PROJECT1-INTEGRATION.md`: esta documentación.

## Archivos modificados

- `projects/project-01/index.html`: reemplazo completo de la página anterior.
- `index.html`: preview clicable, imagen y descripción actualizadas al informe de videojuegos; conserva la misma URL que el enlace inferior de la tarjeta.
- `src/css/input.css`: retirada de los estilos exclusivos de la ilustración conceptual eliminada.
- `src/locales/es.js` y `src/locales/en.js`: claves `project1.*`, actualización de la tarjeta y retirada de claves del panel anterior.
- `src/js/i18n.js`: títulos de elementos traducibles y selección de metadatos mediante atributos genéricos; se retira la excepción del panel anterior.
- `scripts/build.mjs`: copia explícita de los dos archivos nuevos del Proyecto 01 y retirada del generador anterior.
- `scripts/check.mjs`: validación de las claves de título y metadatos, además de las comprobaciones existentes.
- `README.md` y `VALIDATION.md`: configuración y registro de validación actualizados.

`dist/` se regenera con la compilación; no debe editarse manualmente.

## Archivos eliminados

- `src/css/analytics.css`
- `src/js/dashboard.js`
- `src/locales/analytics.js`
- `scripts/render-analytics.mjs`
- `public/assets/images/data-automation-concept.svg`

Se retiraron también sus imports, marcadores de generación, clases y traducciones exclusivas. No quedan referencias a esos recursos en las fuentes activas ni en la distribución.

Los originales de `source-materials/portfolio-links/` se conservan como evidencia privada, incluido el antiguo `SalesFunnelReport.pbix`, que no se utiliza en la página nueva ni se copia a la distribución. Las versiones anteriores, capturas y scripts auxiliares bajo `tmp/` son archivos de revisión, no recursos del sitio. La copia anterior a esta tarea está en `tmp/project01-rebuild-before/`.

## Responsive y accesibilidad

Se reutilizan la cabecera, el selector ES/EN, `.project-actions`, `.project-card`, `.project-art` y `.project-preview`. La nueva página utiliza las mismas acciones de navegación que los proyectos 02 y 03, con `target="_blank"` y `rel="noopener noreferrer"` para los enlaces externos.

Las secciones tienen encabezados y anclas propios. Los enlaces son navegables con teclado y tienen foco visible; la imagen del preview conserva el foco dentro de su contenedor. El código permite desplazamiento horizontal dentro de su propia región, accesible con teclado, sin ensanchar la página. Imágenes con dimensiones explícitas, texto alternativo traducido y carga diferida.

## Privacidad y alcance de la revisión

Se revisó el contenido visible del informe público: ventas agregadas de videojuegos y filtros de año, región, género, editorial y plataforma. No se incorporaron archivos Excel descargables ni datos de registros al sitio. La captura de Power Query contiene código y nombres de columnas.

No se puede certificar el contenido completo del modelo de Power BI únicamente desde la vista pública. Antes de publicar el portafolio, revisar en Power BI los datos subyacentes y confirmar que son públicos, ficticios o anonimizados. Microsoft indica que [Publicar en la web permite acceso público también a los datos subyacentes](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web). Esta tarea no cambia permisos ni publica informes.

## Revisión reproducible

`tmp/project01-review.cjs` comprueba i18n, metadatos, evidencia del código, navegación, foco, enlaces, responsive, lectura sin JavaScript y los estados de carga lenta/recuperación con un iframe de prueba interceptado. Esa prueba no modifica el HTML de producción.

`tmp/project01-live-review.cjs` revisa por separado el informe real integrado, la selección de región en el gráfico, su conservación al cambiar ES/EN y el ajuste de tamaños. Las capturas de revisión se guardan en `tmp/review/`. El alcance de navegador es Edge/Chromium; no se realizó una auditoría con lector de pantalla ni pruebas en dispositivos físicos.
