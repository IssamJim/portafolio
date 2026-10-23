/* Adapt the original Folium map without rebuilding its data or geometry. */
(() => {
  const map = window.map_26c305b30d544bc6b0f00f0d4314048b;
  const tiles = window.tile_layer_4a3cd0077376416c84358c74d4b858df;
  const parks = window.feature_group_734965bceab848e6872d86ceee7aa3e8;
  const volcanoes = window.feature_group_1ec733c8580948c5a6e0623106b5f7cd;
  const population = window.feature_group_f12accdf42c849ccbfa1cffdd5df4a4c;
  const control = window.portfolioLayerControl;
  const status = document.getElementById('map-status');
  let language = 'es', failed = false;
  try { if (localStorage.getItem('portfolio-language') === 'en') language = 'en'; } catch { /* Same fallback as portfolio. */ }
  const copy = {
    es:{title:'Mapa interactivo: parques, volcanes y población',parks:'Parques de Hermosillo',park:'Parque o plaza',address:'Dirección',area:'Superficie',volcanoes:'Volcanes',population:'Población · POP2005',layers:'Capas',zoomIn:'Acercar',zoomOut:'Alejar',close:'Cerrar información',volcano:'Información del volcán',height:'Altura',error:'No se pudo cargar el mapa base. Comprueba tu conexión; las capas del proyecto siguen disponibles.',retry:'Reintentar',loading:'Cargando el mapa base…'},
    en:{title:'Interactive Map: Parks, Volcanoes & Population',parks:'Parks in Hermosillo',park:'Park or square',address:'Address',area:'Area',volcanoes:'Volcanoes',population:'Population · POP2005',layers:'Layers',zoomIn:'Zoom in',zoomOut:'Zoom out',close:'Close information',volcano:'Volcano information',height:'Height',error:'The basemap could not load. Check your connection; the project layers remain available.',retry:'Retry',loading:'Loading the basemap…'}
  };
  if (!map || !tiles || !control) { status.hidden=false; status.textContent=copy[language].error; return; }
  map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
  const popupSources = new WeakMap();
  let popupId = 0;
  for (const marker of [...parks.getLayers(), ...volcanoes.getLayers()]) {
    const content = marker.getPopup().getContent();
    if (content.tagName === 'IFRAME') {
      const decoded = atob(content.getAttribute('src').split(',')[1]);
      const match = decoded.match(/Height:\s*([\d.]+)\s*m/);
      if (!match) throw new Error('Unrecognized original volcano popup');
      popupSources.set(marker, {height:match[1], id:++popupId});
    } else {
      const text = content.textContent;
      const fields = text.match(/^Plaza:\s*(.*?)\s+Dirección:\s*(.*?)\s+Superficie:\s*(.*?)\s*m²\s*$/s);
      popupSources.set(marker, {text, id:++popupId, ...(fields && {name:fields[1],address:fields[2],area:fields[3]})});
    }
    marker.getPopup().options.className = 'map-information-popup';
    sizePopup(marker.getPopup());
    marker.on('add', () => accessibleMarker(marker));
    marker.on('popupopen', () => {
      const popup = marker.getPopup();
      sizePopup(popup);
      popup.update();
      const element = popup.getElement();
      element.removeAttribute('aria-hidden');
      element.setAttribute('role','dialog');
      element.setAttribute('aria-labelledby',`map-popup-title-${popupSources.get(marker).id}`);
      element.setAttribute('aria-describedby',`map-popup-details-${popupSources.get(marker).id}`);
      element.tabIndex = -1;
      element.onkeydown = event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); map.closePopup(popup); }
      };
      marker.getElement()?.setAttribute('aria-expanded','true');
      element.focus({preventScroll:true});
    });
    marker.on('popupclose', () => {
      // Leaflet retains the fading element briefly; expose only the open dialog.
      marker.getPopup().getElement()?.setAttribute('aria-hidden','true');
      marker.getElement()?.setAttribute('aria-expanded','false');
      marker.getElement()?.focus({preventScroll:true});
    });
  }
  function popupText(marker) {
    const source = popupSources.get(marker), t = copy[language];
    if (source.height) return `${t.volcano}: ${t.height}: ${source.height} m`;
    return language === 'es' ? source.text : source.text.replace(/^Plaza: /,'Park: ').replace(' Dirección: ',' Address: ').replace(' Superficie: ',' Area: ');
  }
  function accessibleMarker(marker) {
    const path = marker.getElement();
    if (!path) return;
    path.setAttribute('tabindex','0'); path.setAttribute('role','button');
    path.setAttribute('aria-label',popupText(marker));
    path.setAttribute('aria-haspopup','dialog');
    path.setAttribute('aria-expanded',String(marker.isPopupOpen()));
    path.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); marker.openPopup(); } };
  }
  function sizePopup(popup) {
    const size = map.getSize();
    const controls = [...document.querySelectorAll('.leaflet-top .leaflet-control')];
    const top = Math.max(100,...controls.map(element => element.getBoundingClientRect().bottom)) + 12;
    const bottom = status.hidden ? 42 : size.y - status.getBoundingClientRect().top + 12;
    // Leaflet calculates widths numerically; the original "100%" yielded NaN.
    popup.options.maxWidth = Math.max(120,Math.min(320,size.x - 72));
    popup.options.minWidth = Math.min(220,popup.options.maxWidth);
    popup.options.maxHeight = Math.max(120,size.y - top - bottom - 46);
    popup.options.autoPanPaddingTopLeft = L.point(16,top);
    popup.options.autoPanPaddingBottomRight = L.point(16,bottom);
  }
  function popupContent(marker) {
    const source = popupSources.get(marker), t = copy[language];
    const content = document.createElement('section');
    content.className = 'map-popup';
    const heading = document.createElement('h2');
    heading.id = `map-popup-title-${source.id}`;
    heading.className = 'map-popup-name';
    heading.textContent = source.name || (source.height ? t.volcano : t.park);
    const details = document.createElement('dl');
    details.id = `map-popup-details-${source.id}`;
    details.className = 'map-popup-details';
    const fields = source.height ? [[t.height,`${source.height} m`]] : source.name ? [[t.address,source.address],[t.area,`${source.area} m²`]] : [];
    for (const [label,value] of fields) {
      const row = document.createElement('div'), term = document.createElement('dt'), description = document.createElement('dd');
      term.textContent = label; description.textContent = value;
      row.append(term,description); details.append(row);
    }
    // Preserve an unexpected original record verbatim instead of dropping data.
    if (!fields.length) details.textContent = popupText(marker);
    content.append(heading,details);
    return content;
  }
  function updateStatus() {
    status.replaceChildren();
    if (failed) {
      status.hidden=false;
      status.append(document.createTextNode(copy[language].error+' '));
      const button=document.createElement('button');button.type='button';button.textContent=copy[language].retry;
      button.onclick=()=>{failed=false;status.textContent=copy[language].loading;tiles.redraw();checkAfterTimeout();};
      status.append(button);
    } else status.hidden=true;
  }
  function applyLanguage(value) {
    language = value === 'en' ? 'en' : 'es'; const t=copy[language];
    document.documentElement.lang=language;document.title=t.title;document.getElementById('map-heading').textContent=t.title;
    map.getContainer().setAttribute('aria-label',t.title);
    for (const item of control._layers) {
      item.name=item.layer===parks?t.parks:item.layer===volcanoes?t.volcanoes:item.layer===population?t.population:'OpenStreetMap';
    }
    control._update();
    const labels=[['.leaflet-control-layers-toggle',t.layers],['.leaflet-control-zoom-in',t.zoomIn],['.leaflet-control-zoom-out',t.zoomOut],['.leaflet-popup-close-button',t.close]];
    for (const [selector,label] of labels) document.querySelectorAll(selector).forEach(el=>{el.title=label;el.setAttribute('aria-label',label);});
    for (const marker of [...parks.getLayers(), ...volcanoes.getLayers()]) {
      const popup=marker.getPopup(), autoPan=popup.options.autoPan;
      sizePopup(popup);
      popup.options.autoPan=false;popup.setContent(popupContent(marker));popup.options.autoPan=autoPan;
      accessibleMarker(marker);
    }
    updateStatus();
  }
  map.on('resize', () => {
    for (const marker of [...parks.getLayers(),...volcanoes.getLayers()]) {
      if (marker.isPopupOpen()) { sizePopup(marker.getPopup()); marker.getPopup().update(); }
    }
  });
  map.on('popupopen',({popup})=>{const close=popup.getElement().querySelector('.leaflet-popup-close-button');if(close){close.title=copy[language].close;close.setAttribute('aria-label',copy[language].close);}});
  tiles.on('tileerror',()=>{failed=true;updateStatus();});
  tiles.on('load',()=>{const images=[...document.querySelectorAll('.leaflet-tile')];failed=images.length===0||images.some(img=>!img.complete||!img.naturalWidth);updateStatus();});
  function checkAfterTimeout(){setTimeout(()=>{if(!document.querySelector('.leaflet-tile-loaded')){failed=true;updateStatus();}},12000);}
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='portfolio-map-language')return;
    applyLanguage(event.data.language);
  });
  // Expose existing instances for inspection; this does not create replacement map layers.
  window.portfolioMap={map,tiles,parks,volcanoes,population,control};
  applyLanguage(language);checkAfterTimeout();
  if(parent!==window)parent.postMessage({type:'portfolio-map-ready'},location.origin);
})();
