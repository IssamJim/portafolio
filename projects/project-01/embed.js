import { translate } from '../../src/js/i18n.js';

const container = document.querySelector('.powerbi-embed');
const template = document.querySelector('#powerbi-template');
const sourceFrame = template?.content.querySelector('iframe');

// No report URL is guessed: the provided embed is the only source of truth.
if (container && sourceFrame) {
  const frame = sourceFrame.cloneNode(true);
  const placeholder = container.querySelector('.embed-placeholder');
  const message = container.querySelector('[data-embed-message]');
  const feedback = document.querySelector('.embed-feedback');
  let timer;
  let finished = false;
  let observer;

  const finish = (failed = false) => {
    finished = true;
    clearTimeout(timer);
    observer?.disconnect();
    container.setAttribute('aria-busy', 'false');
    placeholder.hidden = true;
    feedback.hidden = !failed;
  };
  const updateTitle = () => { frame.title = translate(frame.dataset.i18nTitle); };

  message.dataset.i18n = 'project1.powerbi.loading';
  message.textContent = translate(message.dataset.i18n);
  container.setAttribute('aria-busy', 'true');
  frame.addEventListener('load', () => finish(), { once:true });
  frame.addEventListener('error', () => finish(true), { once:true });
  document.addEventListener('languagechange', updateTitle);
  updateTitle();
  template.replaceWith(frame);

  // Start the slow-load fallback when the lazy iframe approaches the viewport.
  observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    if (!finished) timer = setTimeout(() => finish(true), 20000);
  }, { rootMargin:'200px' });
  observer.observe(container);
}
