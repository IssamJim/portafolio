# Portafolio de Issam Jiménez

Sitio estático bilingüe construido con HTML5, Tailwind CSS 4 y JavaScript modular. Español es el idioma inicial. No requiere backend propio; el mapa y el informe Power BI utilizan servicios externos. El repositorio contiene las fuentes; el sitio aún no se ha desplegado en un alojamiento público.

## Desarrollo y compilación

Requisitos: Node.js 22 o posterior y npm.

```sh
git clone https://github.com/IssamJim/portafolio.git
cd portafolio
npm ci
npm run dev
```

Abrir `http://127.0.0.1:4173`. El modo de desarrollo recompila al modificar HTML, CSS, traducciones o archivos públicos; refrescar el navegador para ver el cambio.

```sh
npm run build
npm run check
npm run preview
```

`build` genera `dist/` desde una lista explícita de entradas; no copia el proyecto completo. `preview` sirve únicamente `dist/`. Puede cambiarse el puerto con la variable de entorno `PORT`. No abrir el HTML por `file://`: los módulos JavaScript necesitan HTTP.

## Estructura

```text
index.html                      Inicio y contenido inicial en español
src/
  css/input.css                 Tailwind, tokens y estilos propios
  js/main.js                    Menú y arranque
  js/i18n.js                    Idioma, preferencias y metadatos
  js/data.js                    Catálogo de certificados
  locales/es.js                 Textos en español
  locales/en.js                 Textos en inglés
public/assets/
  images/                       Retratos WebP y favicon SVG
  certificates/                 Nueve PDF distintos para consulta
  documents/                    CV español e inglés
projects/
  project-01/index.html
  project-02/index.html
  project-03/index.html
scripts/
  build.mjs                     Compilación y copia pública explícita
  dev.mjs                       Compilación inicial y observador
  serve.mjs                     Servidor local limitado a dist/
  check.mjs                     Comprobaciones de integridad y enlaces
  certificate-sha256.json        Integridad de los certificados públicos
source-materials/               Opcional y privado; excluido de Git y despliegue
  originals/                    Contenido íntegro de la antigua carpeta Files
  inventory.json                Rutas originales y hashes SHA-256
  public-asset-map.json          Relación de certificados originales/públicos
dist/                           Salida generada; única carpeta que se despliega
```

## Fuentes y decisiones editoriales

- Se revisaron los dos CV, la fotografía y los once PDF de `Files/certificados`.
- Se mantiene «estudiante de último año», como indica el CV español. Las fechas de empleo y estudios se reproducen como períodos documentados, sin afirmar un empleo actual o una graduación.
- Los tres espacios iniciales se sustituyeron por proyectos basados en materiales suministrados: Power BI y Power Query, Bayes Lab y un mapa interactivo. Sus fuentes se documentan en los archivos `PROJECT*-INTEGRATION.md`.
- Los certificados se revisaron por extracción de texto y visualmente. Las fechas de Udemy se tomaron de los propios PDF: Python, 16 de octubre de 2025; DevOps, 7 de diciembre de 2022; AJAX/PHP, 9 de enero de 2018.
- `certificado.pdf` es idéntico por SHA-256 al certificado de Apps Móviles; `devops.pdf` es idéntico a `devops udemy.pdf`. Se conserva una sola copia pública por curso. La carta de Cisco se incluye en la misma entrada que su certificado, con su propio par de enlaces para ver y descargar. Resultado: ocho entradas, con enlaces a nueve documentos distintos. Los once archivos originales se conservan en el archivo privado local, fuera de GitHub.
- Los títulos oficiales y nombres propios conservan su idioma. Cambiar el idioma del sitio no traduce los PDF. Los dos CV se ofrecen con el idioma del archivo indicado.
- Se publica correo, GitHub y ciudad. No se repite el teléfono en la página; los CV públicos originales sí contienen el número profesional que suministró el usuario.
- Todos los originales se trasladaron íntegros a `source-materials/originals/`, con comprobación de hashes. No se borraron archivos únicos.

## Actualizar textos e imágenes

Editar ambos archivos de `src/locales/`. Las claves deben coincidir. Los atributos `data-i18n`, `data-i18n-aria`, `data-i18n-alt` y `data-i18n-title` enlazan el HTML con los textos. Al cambiar contenido, actualizar también el texto inicial español del HTML para que el documento siga siendo legible sin JavaScript. Los metadatos y fechas se actualizan al cambiar de idioma.

La preferencia usa `localStorage` con la clave `portfolio-language`; si el navegador bloquea el almacenamiento, el cambio sigue funcionando en la página actual. Sin almacenamiento no es posible recordar una preferencia entre páginas.

Para cambiar el retrato, reemplazar los dos WebP conservando nombres y proporción (aproximadamente 3:4) o actualizar `src`, `srcset`, `width`, `height` y el texto alternativo. No es necesario publicar la fotografía original de alta resolución.

## Agregar certificados

1. Guardar una copia apta para publicación en `public/assets/certificates/`, con nombre kebab-case. Si se mantiene un archivo privado local, guardar también el original en `source-materials/`.
2. Añadir una entrada en `src/js/data.js`: `title`, `issuer`, `issuerId`, `date` ISO `AAAA-MM-DD` y `files`. Usar solo datos comprobados. El catálogo actual contiene únicamente PDF.
3. La compilación genera la lista en el marcador `<!-- CERTIFICATES -->` de `index.html`; no editar `dist/index.html`.
4. Actualizar `scripts/certificate-sha256.json` con el SHA-256 del nuevo PDF. El catálogo, el manifiesto y la carpeta pública deben contener los mismos documentos. Si se mantiene el archivo privado, actualizar también su mapa/inventario.
5. Ejecutar `npm run build` y revisar enlaces. Si se usa un formato que el navegador no puede mostrar, ofrecer descarga explícita y adaptar la etiqueta «PDF» al formato real.

## Páginas de proyectos

Cada ruta es independiente: `projects/project-01/`, `project-02/` y `project-03/`. Mantener estas rutas, el retorno al portafolio y la preferencia de idioma evita romper la navegación. El Proyecto 01 presenta Power BI y un caso de Excel/Power Query; su configuración, fuentes y estado de integración están en [PROJECT1-INTEGRATION.md](PROJECT1-INTEGRATION.md). Actualizar los textos en ambos diccionarios de `src/locales/` y sus correspondientes valores iniciales del HTML.

## Accesibilidad y privacidad

HTML semántico, enlace para saltar al contenido, foco visible, controles de idioma con `aria-pressed`, menú con `aria-expanded`/`inert` y cierre con Escape, textos alternativos, aviso de idioma para lectores de pantalla y respeto a `prefers-reduced-motion`. No hay formularios simulados, analítica ni fuentes remotas. El mapa utiliza teselas externas y el informe Power BI carga contenido desde Microsoft.

El servidor local nunca sirve los originales privados. El `.gitignore` también los excluye, pero esto no sustituye la revisión de permisos al compartir la carpeta completa.

## Repositorio y despliegue

GitHub contiene el código fuente, la documentación y los recursos públicos necesarios para compilar. `.gitignore` excluye `node_modules/`, temporales, variables de entorno, originales privados y el `dist/` de la raíz. El `dashboard/dist/` incluido dentro del Proyecto 02 **sí se versiona**: aporta `app.js`, `model.js`, `data.json` y `styles.css` a la compilación del portafolio. No se necesita instalar las dependencias del dashboard para compilar el portafolio.

Publicar **solo el contenido de `dist/`** en un alojamiento estático con soporte de `index.html` en directorios. Los enlaces son relativos y admiten una subcarpeta. No configurar una redirección global de SPA. Antes de publicar, establecer la URL definitiva para enlaces canónicos y metadatos de compartir; no se ha inventado un dominio. Revisar los documentos públicos, incluidos los datos de contacto de los CV.

## Validación

`npm run check` verifica cinco páginas, exactamente tres tarjetas, claves de traducción (incluidos títulos y metadatos), enlaces y anclas locales, nueve PDF públicos contra su manifiesto SHA-256 y ausencia de materiales privados en `dist/`. Funciona desde una copia limpia del repositorio, sin `source-materials/`.

La auditoría adicional `npm run check:originals` requiere el archivo privado local y compara su inventario y los certificados originales con las copias públicas. No es un requisito para colaboradores o despliegues. Véase `VALIDATION.md` para la revisión visual y de comportamiento realizada; las evidencias históricas de `tmp/` son locales y no forman parte del repositorio.

## Logotipos de certificados

Los cuatro PNG se encuentran en `public/assets/images/issuers/`: `datacamp.png`, `udemy.png`, `google.png` y `cisco.png`. El mapa `certificateIssuers` de `src/js/data.js` relaciona cada `issuerId` con su imagen y su clave de texto alternativo. Al cambiar un logo, reemplazar el PNG conservando su nombre. Para un nuevo emisor, añadir una entrada al mapa y el texto alternativo en ambos archivos de traducción.

Las imágenes se cargan con `loading="lazy"`, mantienen sus proporciones mediante `object-fit: contain` y ocupan un espacio de 45 × 45 px. La nota inferior conserva su contenido y queda centrada. Los certificados repetidos muestran solo el enlace al documento principal; Cisco mantiene un par de enlaces para el certificado y otro para la carta.

## Dashboard de Proyecto 2

El dashboard existente Bayes Lab está integrado en projects/project-02/, con ES/EN y retorno al portafolio. Consulta [PROJECT2-INTEGRATION.md](PROJECT2-INTEGRATION.md) para ejecutar, actualizar y verificar esta integración. Sus fuentes originales permanecen intactas.


## Mapa de Proyecto 03

El mapa original de Practica-Mapa está integrado con capas, popups bilingües y una captura real en la tercera tarjeta. Consulta [PROJECT3-INTEGRATION.md](PROJECT3-INTEGRATION.md) para fuentes, arranque, cambio de proveedor y límites de validación.

