import { mkdir, copyFile, cp, rm, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { certificates, certificateIssuers, certificateFileTitle } from '../src/js/data.js';
import es from '../src/locales/es.js';

const root = resolve(import.meta.dirname, '..');
process.chdir(root);
const output = resolve(root, 'dist');
if (output !== resolve(root, 'dist')) throw new Error('Invalid output directory');
await rm(output, { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
const cli = resolve('node_modules/@tailwindcss/cli/dist/index.mjs');
const result = spawnSync(process.execPath, [cli, '-i', 'src/css/input.css', '-o', 'dist/assets/styles.css', '--minify'], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
await cp('public', 'dist', { recursive: true });
await cp('src/js', 'dist/src/js', { recursive: true });
await cp('src/locales', 'dist/src/locales', { recursive: true });
// Copy explicit public entries; project source archives and node_modules stay private.
for (const project of ['project-01', 'project-02', 'project-03']) {
  await mkdir(`dist/projects/${project}`, { recursive: true });
  await copyFile(`projects/${project}/index.html`, `dist/projects/${project}/index.html`);
}
const bayesSource = 'projects/project-02/NaiveBayes/NaiveBayes-BreastCancer-main/dashboard/dist';
for (const file of ['app.js', 'model.js', 'data.json', 'styles.css']) {
  await copyFile(`${bayesSource}/${file}`, `dist/projects/project-02/${file}`);
}
for (const file of ['integration.js', 'translations.js', 'integration.css']) {
  await copyFile(`projects/project-02/${file}`, `dist/projects/project-02/${file}`);
}
for (const file of ['project.css', 'embed.js']) {
  await copyFile(`projects/project-01/${file}`, `dist/projects/project-01/${file}`);
}
await cp('projects/project-03/map', 'dist/projects/project-03/map', { recursive:true });
for (const file of ['integration.js', 'integration.css']) {
  await copyFile(`projects/project-03/${file}`, `dist/projects/project-03/${file}`);
}

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function certificateLinks(c, i) {
  const title = j => certificateFileTitle(c, j, key => es[key]);
  const view = (file, j) => `<a href="assets/certificates/${file}" target="_blank" rel="noopener" data-cert-link="${i}" data-cert-file="${j}" aria-label="${escape(es['cert.viewLabel'].replace('{title}', title(j)))}"><span data-i18n="cert.view">${es['cert.view']}</span> <span aria-hidden="true">↗</span></a>`;
  const download = (file, j) => `<a href="assets/certificates/${file}" download data-cert-download="${i}" data-cert-file="${j}" aria-label="${escape(es['cert.downloadLabel'].replace('{title}', title(j)))}"><span data-i18n="cert.download">${es['cert.download']}</span> <span aria-hidden="true">↓</span></a>`;
  if (c.letterIndex !== undefined) {
    return c.files.map((file, j) => `<span class="inline-flex gap-5">${view(file, j)}${download(file, j)}</span>`).join('');
  }
  return view(c.files[0], 0) + download(c.files[0], 0);
}
const cards = certificates.map((c, i) => `
<article class="certificate">
  <div class="cert-brand"><img class="cert-logo" src="${escape(certificateIssuers[c.issuerId].logo)}" alt="${escape(es[certificateIssuers[c.issuerId].altKey])}" data-i18n-alt="${certificateIssuers[c.issuerId].altKey}" width="45" height="45" loading="lazy" decoding="async"></div>
  <div class="min-w-0 flex-1">
    <p class="eyebrow">${escape(c.issuer)}</p>
    <h3>${escape(c.title)}</h3>
    <p class="cert-meta"><time datetime="${c.date}" data-date="${c.date}">${new Intl.DateTimeFormat('es', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(c.date))}</time>${c.letter ? ' · <span data-i18n="cert.letter">Carta de finalización</span>' : ''}</p>
    <div class="cert-links">${certificateLinks(c, i)}</div>
  </div>
</article>`).join('');
const html = (await readFile('index.html','utf8')).replace('<!-- CERTIFICATES -->',cards);
await writeFile('dist/index.html',html);
console.log('Production build ready in dist/ (public assets only).');
