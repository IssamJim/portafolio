# Validación del portafolio

La última comprobación, del 22 de octubre de 2026, se describe al final. Las secciones anteriores documentan estados históricos del proyecto y pueden mencionar archivos o recuentos sustituidos posteriormente.

Revisión realizada el 19 de octubre de 2026 (America/Hermosillo).

## Compilación e integridad

- `npm run build`: correcto, con Tailwind CSS 4.1.18 compilado localmente y dependencias fijadas en `package-lock.json`.
- `npm run check`: correcto.
- Cuatro páginas HTML y exactamente tres tarjetas de proyectos en la portada.
- Ocho entradas de formación: ocho certificados únicos y una carta agrupada con el certificado de Cisco. Se enlazan nueve documentos distintos. Las dos copias idénticas se conservan en disco sin acciones adicionales en las tarjetas.
- Los once PDF de formación publicados coinciden por SHA-256 con los originales.
- Los catorce materiales originales se conservan íntegros y coinciden con el inventario.
- Todos los enlaces locales, archivos y anclas de las cuatro páginas resuelven.
- Los diccionarios español/inglés tienen las mismas claves; todas las claves utilizadas por el HTML existen.
- El contenido de `source-materials/` no aparece en `dist/`. La petición HTTP al inventario privado devuelve 404.

## Navegador y comportamiento

Prueba automatizada con Playwright y Microsoft Edge (Chromium), seguida de inspección visual de capturas.

- Anchos de 1440, 820, 390 y 320 píxeles, en español e inglés: sin desbordamiento horizontal.
- Inspección de la portada completa, cabecera, retrato, secciones, contacto y páginas de proyectos.
- Español por defecto; selección y restauración de inglés tras recargar y navegar.
- Cambio de idioma en cada página de proyecto y retorno al portafolio conservando la preferencia.
- Cambio inmediato de títulos, descripción, atributo `lang`, etiquetas, fechas y estados.
- Cambio de idioma sin desplazamiento al pulsar el control visible de la cabecera fija.
- Al bloquear `localStorage`, la selección funciona durante la visita; una nueva carga usa español.
- Menú móvil: apertura, cierre con Escape, retorno del foco al botón y cierre al seguir enlaces.
- Al abrir el menú, el foco pasa al primer enlace; el menú cerrado usa `inert`.
- Enlace de salto al contenido como primer destino de Tab y contorno de foco visible.
- Tres tarjetas de proyecto, sus páginas individuales y enlaces de retorno verificados.
- Los trece PDF públicos (once de formación y dos CV) responden HTTP 200 y contienen cabecera PDF válida.
- `prefers-reduced-motion` elimina desplazamiento suave y transiciones.
- El contenido y la lista de certificados se entregan en HTML y siguen disponibles sin JavaScript.
- Cero errores de JavaScript, consola o recursos faltantes durante los recorridos.

## Imágenes y alcance

El retrato original de aproximadamente 1.956 KB tiene versiones WebP de 77 KB y 18 KB, seleccionadas con `srcset`. No se cargan fuentes ni bibliotecas desde CDN.

La revisión de navegador cubre Edge/Chromium. No se realizó una auditoría con lector de pantalla ni pruebas en dispositivos físicos o en Safari/Firefox. Los enlaces de correo y GitHub se comprobaron como destinos, sin enviar mensajes ni operar en la cuenta.

El sitio está preparado para alojamiento estático y no ha sido publicado. Solo debe desplegarse `dist/`.

## Ajuste de certificados — 20 de octubre de 2026

- Compilación y comprobaciones estáticas correctas.
- Comparación con el catálogo anterior: mismos ocho certificados, orden, emisores, títulos, fechas y asociaciones de documentos.
- Eliminadas las acciones y claves de traducción de copias duplicadas. Búsqueda sin coincidencias en `src/`, el generador y `dist/`.
- Ocho imágenes cargadas desde los cuatro PNG suministrados: DataCamp, Udemy, Google y Cisco. Alt descriptivo en español/inglés, carga lazy y `object-fit: contain`, dentro del espacio de 45 × 45 px.
- Nota inferior centrada, sin modificar su texto y sin desbordamiento.
- Validación Edge/Chromium en 320, 390, 820 y 1440 px, en ambos idiomas; sin desbordamiento horizontal ni errores de consola o recursos.
- Nueve PDF distintos enlazados en los certificados (18 acciones). Cisco conserva dos pares de visualización/descarga. Todos respondieron HTTP 200 y con contenido PDF válido.
- Foco visible comprobado con Tab.

## Integración de Proyecto 2 — 21 de octubre de 2026

Se verificaron las seis pruebas originales del modelo, navegación, idiomas, persistencia, filtros, CSV, estados de error y diseño responsive en Edge/Chromium. El detalle y las limitaciones están en [PROJECT2-INTEGRATION.md](PROJECT2-INTEGRATION.md). La compilación comprueba que app.js, model.js, data.json y styles.css coinciden con el dashboard original.


## Integración de Proyecto 03

La compilación incluye cinco documentos HTML (la portada, tres proyectos y el iframe del mapa). Se verificaron los datos geográficos originales, los enlaces y la captura real con teselas cargadas. Las fuentes, cambios y pruebas de navegador se documentan en [PROJECT3-INTEGRATION.md](PROJECT3-INTEGRATION.md).

## Sustitución del Proyecto 01 — 21 de octubre de 2026

- `npm run build` y `npm run check`: correctos. Cinco documentos HTML, tres tarjetas, diccionarios consistentes, enlaces locales válidos y originales conservados.
- Integrado `Practica2(Videojuegos)` con la URL exacta del iframe suministrado, conservada también en el enlace alternativo. Se retiró el panel anterior y sus cinco archivos exclusivos; no quedan referencias activas a esos recursos en las fuentes ni en `dist/`.
- Evidencia de Power Query: la consulta original define 24 columnas y selecciona tres campos. El bloque de código publicado coincide con el archivo `.pq` original. No se atribuye un ahorro de tiempo no medido.
- Edge/Chromium: textos, metadatos, nombres accesibles, alt y título del iframe comprobados en ES/EN; el código M conserva sus identificadores originales.
- Diseño de la página probado en 1440, 820, 700, 390 y 320 px en ambos idiomas, sin desbordamiento horizontal. El código se desplaza dentro de su propia región; el iframe conserva lienzo 16:9 más 56 px para controles.
- Preview real en portada: imagen cargada, hover visible, foco visible con Tab y navegación con Enter a la misma ruta que el enlace inferior.
- Acciones superiores en el mismo orden y con los mismos estilos que los proyectos 02 y 03. GitHub se abre en otra pestaña sin `window.opener`; comprobados también los enlaces de retorno y la navegación ES/EN de los otros proyectos.
- Lectura sin JavaScript y enlace alternativo disponibles. Comprobadas carga lenta, retirada del placeholder y recuperación posterior con una respuesta de iframe simulada únicamente en la prueba.
- Informe real: seleccionar Europa en el gráfico cambia el total de `8.82K` a `2.41K`; cambiar el idioma del sitio conserva la selección y la URL. Enter sobre la región seleccionada restaura `8.82K`.
- Pruebas y capturas: `tmp/project01-review.cjs`, `tmp/project01-live-review.cjs` y `tmp/review/`. No se detectaron errores de recursos locales o JavaScript en la prueba aislada.

Las etiquetas internas de Power BI permanecen en el idioma del informe. La revisión visible muestra datos agregados de videojuegos; no constituye una auditoría del modelo subyacente. El alcance de navegador es Edge/Chromium, sin lector de pantalla ni dispositivos físicos. No se ha desplegado el portafolio. Véase [PROJECT1-INTEGRATION.md](PROJECT1-INTEGRATION.md) para inventario y detalles de integración.

## Información y legibilidad del Proyecto 03 — 21 de octubre de 2026

- Contenido faltante propuesto y aprobado por el usuario antes de incorporarse. Introducción, nota y traducciones anteriores conservadas.
- `npm run build` y `npm run check`: correctos. Durante la revisión se detuvo temporalmente el observador de desarrollo para evitar compilaciones simultáneas sobre `dist/`.
- Comparación de los 832 popups: nombre, dirección y superficie coinciden con los originales, normalizando únicamente los espacios de separación. Se mantienen 62 volcanes y 246 geometrías de población.
- Umbrales de la guía cotejados con `map1.py` y con los colores de las 246 geometrías; ninguna discrepancia. Bloque Python tomado de la función original.
- Edge/Chromium en ES/EN, con anchos de 1440, 820, 390 y 320 px: nombres largos completos, título a 18 px, campos separados, sin desbordamiento de texto ni solapamiento con controles. Prueba adicional de apertura junto a las cuatro esquinas a 320 × 667 px.
- Apertura por clic, Enter y Espacio; diálogo con nombre/descripción accesibles, foco inicial, cierre con Escape y retorno al marcador. Los diálogos cerrados se excluyen del árbol accesible durante su retirada visual.
- Cambio ES/EN conserva nombre propio, centro, zoom y capas. Verificados popup de volcán, zoom, selector de población, aviso/reintento del mapa base y navegación de ida/vuelta al portafolio. Sin errores de JavaScript ni recursos locales faltantes.
- Estilos computados de diez componentes del Proyecto 01 comparados antes/después en 1440 y 390 px: idénticos tras extraer la hoja compartida. Su HTML solo añade el enlace a esa hoja.
- Guía y metodología legibles sin JavaScript. Captura móvil final con teselas reales de OpenStreetMap; durante las pruebas repetitivas las teselas se sustituyen exclusivamente en el contexto de prueba para evitar solicitudes innecesarias al proveedor.
- Prueba reproducible: `tmp/project03-ux-review.cjs`; captura real y lectura sin JavaScript mediante `node tmp/project03-ux-review.cjs --live`. Capturas en `tmp/review/project03-*`.

La revisión cubre Edge/Chromium; no certifica una auditoría con lector de pantalla ni pruebas en dispositivos físicos. Las propuestas adicionales quedan documentadas en [PROJECT3-INTEGRATION.md](PROJECT3-INTEGRATION.md), pendientes de aprobación y sin implementar.

## Preparación para GitHub — 22 de octubre de 2026

- Limpieza aprobada expresamente: eliminadas dos copias públicas idénticas de certificados y una captura temporal de inspección (1.854.647 bytes). Los originales privados y un respaldo local permanecen conservados.
- Retiradas 17 reglas CSS de las antiguas páginas provisionales, siete traducciones sin uso por idioma y las referencias de catálogo a los duplicados. No se cambió contenido visible.
- `.gitignore` excluye la salida `dist/` de la raíz y conserva los recursos `dashboard/dist/` que necesita el Proyecto 02. Dependencias, temporales y materiales privados quedan fuera del repositorio.
- `npm run build` y `npm run check:originals`: correctos. Cinco documentos HTML, tres proyectos, ocho entradas de certificados y nueve PDF de formación distintos, más dos CV.
- Prueba desde una copia limpia de los archivos preparados para Git, sin `source-materials/` ni dependencias heredadas: `npm ci --ignore-scripts --no-audit --no-fund`, `npm run build` y `npm run check` correctos. El manifiesto versionado permite comprobar los PDF sin acceso a los originales privados.
- Las seis pruebas originales del modelo Naive Bayes pasan, incluidas las 239 predicciones y sus puntuaciones normalizadas.
- Comparación binaria de la salida anterior y posterior: solo cambian CSS, catálogo y diccionarios; únicamente desaparecen las dos copias de certificados aprobadas. Los cinco HTML, imágenes, PDF conservados y recursos funcionales coinciden byte a byte.
- Edge/Chromium: estilos computados de la portada idénticos en ES/EN a 1440, 820, 390 y 320 px. Tres previews con imágenes cargadas; once PDF enlazados responden correctamente. Páginas de los tres proyectos sin desbordamiento a 1440, 390 y 320 px; enlaces de retorno y GitHub conservados; sin errores de JavaScript ni recursos locales faltantes.
- Revisión del conjunto preparado para Git: 87 archivos, sin carpetas privadas, temporales, dependencias ni compilación raíz. La búsqueda de patrones de claves privadas y credenciales comunes no encontró coincidencias; no constituye una auditoría exhaustiva de seguridad.
- Evidencias locales: `tmp/github-cleanup-review.cjs`, `tmp/github-upload-files.json`, `tmp/github-cleanup-before/` y capturas `tmp/review/github-cleanup-projects-*.png`. Estas evidencias y respaldos no se suben a GitHub.

El alcance sigue siendo Edge/Chromium. Durante la comprobación local se simularon exclusivamente las respuestas externas de Power BI y las teselas; los recursos del portafolio se sirvieron desde la compilación real. Subir las fuentes a GitHub no habilita GitHub Pages ni despliega el sitio.

