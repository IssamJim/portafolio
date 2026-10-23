import { initLanguage, translate } from '../../src/js/i18n.js';
import { translateText } from './translations.js';

// Translate text nodes only. Never recreate controls, rerun the model, or change data IDs.
// The original app may replace rendered nodes; remember each node's English source.
const textSources = new WeakMap();
const attributeSources = new WeakMap();
const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
const options = {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:attributes};
const observer = new MutationObserver(localize);

function localized(record, current, language) {
  const source = record && record.last === current ? record.source : current;
  return {source, last:translateText(source, language)};
}

function localize() {
  observer.disconnect();
  const language = document.documentElement.lang;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.data.trim() || node.parentElement.closest('script,style,code,noscript,[data-i18n],#language-status')) continue;
    const record = localized(textSources.get(node), node.data, language);
    textSources.set(node, record);
    if (node.data !== record.last) node.data = record.last;
  }
  for (const element of document.querySelectorAll('[aria-label],[title],[placeholder],[alt]')) {
    const records = attributeSources.get(element) || {};
    for (const attr of attributes) {
      if (!element.hasAttribute(attr) || attr === 'aria-label' && element.hasAttribute('data-i18n-aria')) continue;
      records[attr] = localized(records[attr], element.getAttribute(attr), language);
      if (element.getAttribute(attr) !== records[attr].last) element.setAttribute(attr, records[attr].last);
    }
    attributeSources.set(element, records);
  }
  observer.observe(document.body, options);
}

document.addEventListener('languagechange', () => {
  document.title = `${translate('projects.name2')} | Issam Jiménez`;
  document.querySelector('meta[name="description"]').content = translate('projects.description2');
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = translate('projects.description2');
  localize();
});
initLanguage();
