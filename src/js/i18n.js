import es from '../locales/es.js';
import en from '../locales/en.js';
import { certificates, certificateFileTitle } from './data.js';

const dictionaries = { es, en };
const storageKey = 'portfolio-language';
let current = 'es';
export function translate(key) { return dictionaries[current][key] ?? es[key] ?? key; }
export function applyLanguage(language, announce = true) {
  if (!dictionaries[language]) language = 'es';
  const scrollX = window.scrollX, scrollY = window.scrollY;
  current = language;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = translate(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label',translate(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = translate(el.dataset.i18nAlt); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = translate(el.dataset.i18nTitle); });
  document.querySelectorAll('[data-language]').forEach(el => { el.setAttribute('aria-pressed',String(el.dataset.language === language)); });
  document.querySelectorAll('[data-date]').forEach(el => {
    el.textContent = new Intl.DateTimeFormat(language,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(el.dataset.date));
  });
  document.querySelectorAll('[data-cert-link]').forEach(el => {
    el.setAttribute('aria-label',translate('cert.viewLabel').replace('{title}',certificateFileTitle(certificates[Number(el.dataset.certLink)], Number(el.dataset.certFile || 0), translate)));
  });
  document.querySelectorAll('[data-cert-download]').forEach(el => {
    el.setAttribute('aria-label',translate('cert.downloadLabel').replace('{title}',certificateFileTitle(certificates[Number(el.dataset.certDownload)], Number(el.dataset.certFile || 0), translate)));
  });
  const project = document.body.dataset.project;
  const titleKey = document.body.dataset.metaTitle;
  const descriptionKey = document.body.dataset.metaDescription;
  const title = titleKey ? translate(titleKey) : project ? translate('project.metaTitle').replace('{project}',translate(`projects.name${project}`)) : translate('meta.title');
  const description = descriptionKey ? translate(descriptionKey) : project ? translate('project.metaDescription').replace('{project}',translate(`projects.name${project}`)) : translate('meta.description');
  document.title = title;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:locale"]').content = language === 'es' ? 'es_MX' : 'en_US';
  try { localStorage.setItem(storageKey,language); } catch { /* Storage can be blocked; switching still works. */ }
  document.dispatchEvent(new Event('languagechange'));
  if (announce) {
    document.querySelector('#language-status').textContent = translate('language.changed');
    window.scrollTo({left:scrollX,top:scrollY,behavior:'instant'});
  }
}
export function initLanguage() {
  let language = 'es';
  try { language = localStorage.getItem(storageKey) || 'es'; } catch { /* Default Spanish. */ }
  applyLanguage(language, false);
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click',()=>applyLanguage(button.dataset.language));
  });
}
