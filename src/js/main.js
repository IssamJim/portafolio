import { initLanguage, translate } from './i18n.js';

initLanguage();
const menuButton = document.querySelector('#menu-toggle');
const nav = document.querySelector('#navigation');
if (menuButton && nav) {
  menuButton.hidden = false;
  const media = window.matchMedia('(min-width: 960px)');
  let open = false;
  function update() {
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',translate(open ? 'nav.close' : 'nav.open'));
    menuButton.querySelector('[data-menu-text]').textContent = translate(open ? 'nav.close' : 'nav.open');
    nav.classList.toggle('is-open',open);
    nav.inert = !media.matches && !open;
  }
  function close(returnFocus = false) {
    open = false; update();
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click',()=> {
    open = !open;
    update();
    if (open) nav.querySelector('a').focus();
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>close()));
  document.addEventListener('keydown',event=> { if (event.key === 'Escape' && open) close(true); });
  document.addEventListener('click',event=> {
    if (open && !nav.contains(event.target) && !menuButton.contains(event.target)) close();
  });
  document.addEventListener('focusin',event=> {
    if (open && !nav.contains(event.target) && !menuButton.contains(event.target)) close();
  });
  media.addEventListener('change',()=>close());
  document.addEventListener('languagechange',update);
  update();
}
