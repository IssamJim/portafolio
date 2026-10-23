# Proyecto 2: integración de Bayes Lab

## Ejecutar el portafolio

Desde `D:\Documentos\Archivo\Portafolio`:

```powershell
npm run build
npm run check
npm run preview
```

- Portada: http://127.0.0.1:4173/
- Proyecto 2: http://127.0.0.1:4173/projects/project-02/
- Para editar con recompilación automática: detener `preview` y usar `npm run dev`. No ejecutar ambos en el mismo puerto.

Node.js 22 o posterior y las dependencias existentes del portafolio son suficientes. No se añadieron paquetes ni se requiere backend. No abrir el HTML con `file://`, porque el dashboard utiliza módulos y carga JSON mediante HTTP.

## Fuente preservada e integración

El dashboard original está en `projects/project-02/NaiveBayes/NaiveBayes-BreastCancer-main/dashboard/`. Es HTML y JavaScript nativo con Tailwind; sus fuentes, pruebas y archivos compilados se mantienen intactos.

La compilación del portafolio copia únicamente `app.js`, `model.js`, `data.json` y `styles.css` desde el `dist/` original. Las copias son idénticas byte por byte. No se reconstruyen las gráficas ni se modifican los cálculos, el modelo o los datos. El CSS compilado original permite integrar el dashboard sin instalar su versión de Tailwind ni cambiar la versión usada por el portafolio.

La página de integración y los archivos adicionales son:

- `projects/project-02/index.html`: estructura original con retorno al portafolio, botones ES/EN y región de tabla accesible mediante teclado.
- `projects/project-02/integration.js`: usa `initLanguage()` del portafolio y su clave `portfolio-language`; adapta metadatos y textos sin recrear controles ni ejecutar el modelo.
- `projects/project-02/translations.js`: traducciones de textos estáticos, mensajes dinámicos, leyendas, títulos, atributos accesibles y errores. Los identificadores del modelo y la exportación CSV original se conservan.
- `projects/project-02/integration.css`: navegación añadida y ajustes mínimos para que los textos traducidos se adapten a pantallas estrechas. La tabla conserva desplazamiento horizontal dentro de su contenedor.

La capa de idioma recuerda el texto inglés de cada nodo y observa las actualizaciones que produce la aplicación original. El cambio de idioma solo actualiza texto y atributos descriptivos: mantiene valores, muestra seleccionada, filtros, paginación, sección desplegada y resultados. Si se incorporan nuevos textos al dashboard original, deben añadirse al diccionario o a sus patrones de traducción.

La página carga exclusivamente el CSS de Bayes Lab y su complemento de integración; no carga el CSS visual del portafolio. La compilación utiliza una lista explícita de archivos públicos y no copia el repositorio original, sus matrices MATLAB, dependencias, pruebas ni documentación a `dist/`. El servidor redirige rutas de directorio sin barra final para que los recursos relativos funcionen también al navegar directamente.

## Actualizar el dashboard original en el futuro

Solo cuando se quiera regenerar sus datos o estilos, desde su carpeta `dashboard` se pueden usar los comandos originales:

```powershell
npm ci
npm run build
npm test
```

Después, ejecutar `npm run build` desde la raíz del portafolio. `npm ci` en el dashboard es innecesario para servir la copia existente; su `package.json` declara Tailwind/CLI 4.3.0. Los datos se generan con las matrices originales y el exportador comprueba las predicciones guardadas. No se ejecutó MATLAB durante esta integración.

## Validación realizada — 21 de octubre de 2026

- Build y comprobaciones existentes del portafolio correctos; se añadió comparación de hashes de los cuatro archivos originales copiados.
- Las seis pruebas originales pasan, incluida la comparación de las 239 predicciones y puntuaciones normalizadas con los resultados MATLAB guardados.
- Edge/Chromium: tarjeta 2, ruta directa con y sin barra, recarga, enlace de regreso y persistencia de idioma.
- ES → EN y EN → ES: navegación, contenido, características, tabla, leyendas, atributos accesibles y estados dinámicos traducidos.
- Los filtros, valores de entrada, muestra seleccionada y paginación se mantienen; matriz, métricas, puntuaciones y barras no cambian al traducir.
- Selección de muestras, sliders con ratón/teclado, restablecimiento, filtro de errores/solapamientos/clase/ID, paginación, detalles y exportación CSV filtrada comprobados.
- Estados de búsqueda vacía, error HTTP, formato inválido y experimento vacío: mensajes bilingües y recuperación con reintento. Al bloquear almacenamiento, la selección funciona durante la visita y se vuelve a español al recargar, como en el portafolio.
- Pantallas de 320, 390, 820 y 1440 px en ambos idiomas sin desbordamiento horizontal de la página. La tabla se desplaza dentro de su región. Sin errores de JavaScript ni recursos faltantes en el recorrido normal.
- Comparación de originales: fuentes del dashboard intactas; contenido de portada ajeno a la tarjeta 2 y páginas de Proyectos 1 y 3 preservados.

Las pruebas automatizadas y capturas se guardan en `tmp/bayes-check.cjs` y `tmp/review/`, fuera de la distribución pública. No se verificaron Safari/Firefox, dispositivos físicos ni un lector de pantalla real. El proyecto sigue siendo el experimento educativo original; esta integración no aporta validación clínica ni nuevas métricas. No se publicó ni desplegó el sitio.
