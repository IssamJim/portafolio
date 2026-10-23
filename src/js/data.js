// Shared issuer assets. Titles and issuer names below remain as supplied.
export const certificateIssuers = {
  datacamp: { logo:'assets/images/issuers/datacamp.png', altKey:'cert.logo.datacamp' },
  udemy: { logo:'assets/images/issuers/udemy.png', altKey:'cert.logo.udemy' },
  google: { logo:'assets/images/issuers/google.png', altKey:'cert.logo.google' },
  cisco: { logo:'assets/images/issuers/cisco.png', altKey:'cert.logo.cisco' }
};

// Official titles are kept in the language printed on the supplied certificate.
export const certificates = [
  { title:'Large Language Models (LLMs) Concepts', issuer:'DataCamp', issuerId:'datacamp', date:'2026-10-14', files:['datacamp-llms-concepts.pdf'] },
  { title:'Intermediate Python', issuer:'DataCamp', issuerId:'datacamp', date:'2026-10-08', files:['datacamp-intermediate-python.pdf'] },
  { title:'Introduction to Python', issuer:'DataCamp', issuerId:'datacamp', date:'2026-10-03', files:['datacamp-introduction-python.pdf'] },
  { title:'Python Mega Course: Build 20 Real-World Apps and AI Agents', issuer:'Udemy', issuerId:'udemy', date:'2025-10-16', files:['udemy-python-mega-course.pdf'] },
  { title:'DevOps Beginners to Advanced | Decoding DevOps with Projects', issuer:'Udemy', issuerId:'udemy', date:'2022-12-07', files:['udemy-devops.pdf'] },
  { title:'Desarrollo de Apps Móviles', issuer:'Google Actívate · Universidad Complutense de Madrid', issuerId:'google', date:'2020-04-11', files:['google-desarrollo-apps-moviles.pdf'] },
  { title:'Building a Chat System in AJAX & PHP', issuer:'Udemy', issuerId:'udemy', date:'2018-01-09', files:['udemy-chat-ajax-php.pdf'] },
  { title:'CCNA Routing & Switching: Principios básicos de routing y switching', issuer:'Cisco Networking Academy · Universidad de Sonora', issuerId:'cisco', date:'2017-05-23', letterIndex:1, files:['cisco-routing-switching.pdf','cisco-completion-letter.pdf'] }
];

export function certificateFileTitle(certificate, fileIndex, translate) {
  return certificate.title + (fileIndex === certificate.letterIndex ? ` — ${translate('cert.letter')}` : '');
}
