import {initLanguage,translate} from '../../src/js/i18n.js';
const frame=document.getElementById('project-map');
function synchronize(){
  document.title=`${translate('projects.name3')} | Issam Jiménez`;
  document.querySelector('meta[name="description"]').content=translate('projects.description3');
  document.querySelector('meta[property="og:title"]').content=document.title;
  document.querySelector('meta[property="og:description"]').content=translate('projects.description3');
  frame.title=translate('projects.name3');
  frame.contentWindow?.postMessage({type:'portfolio-map-language',language:document.documentElement.lang},location.origin);
}
document.addEventListener('languagechange',synchronize);
frame.addEventListener('load',synchronize);
window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===frame.contentWindow&&event.data?.type==='portfolio-map-ready')synchronize();});
initLanguage();
