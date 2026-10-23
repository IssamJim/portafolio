import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import es from '../src/locales/es.js';
import en from '../src/locales/en.js';
import { certificates } from '../src/js/data.js';
process.chdir(resolve(import.meta.dirname,'..'));
assert.deepEqual(Object.keys(es).sort(),Object.keys(en).sort(),'Translation dictionaries must have matching keys');
const root = resolve('dist');
async function walk(folder) {
  const files = [];
  for (const item of await readdir(folder,{withFileTypes:true})) {
    const path = join(folder,item.name);
    if (item.isDirectory()) files.push(...await walk(path)); else files.push(path);
  }
  return files;
}
const files = await walk(root);
const pages = files.filter(f=>f.endsWith('.html'));
assert.equal(pages.length,5);
for (const file of pages) {
  const html = await readFile(file,'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`One h1 in ${file}`);
  for (const match of html.matchAll(/(?:data-i18n(?:-aria|-alt|-title)?|data-meta-(?:title|description))="([^"]+)"/g)) {
    assert.ok(es[match[1]] && en[match[1]],`Missing translation ${match[1]}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const href=match[1]; assert.ok(href,'Empty link');
    if (/^(https?:|mailto:|tel:|data:image\/svg\+xml,|data:text\/html;charset=utf-8;base64,)/.test(href)) continue;
    const [path,anchor] = href.split('#');
    let target=path ? resolve(dirname(file),path) : file;
    assert.ok(target.startsWith(root),'Link escapes production build');
    const info=await stat(target);
    if (info.isDirectory()) target=join(target,'index.html');
    await stat(target);
    if (anchor) assert.ok((await readFile(target,'utf8')).includes(`id="${anchor}"`),`Missing anchor ${href}`);
  }
}
const home=await readFile('dist/index.html','utf8');
assert.equal((home.match(/class="project-card"/g)||[]).length,3);
assert.equal((home.match(/class="certificate"/g)||[]).length,8);
const hash=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
const bayesSource = 'projects/project-02/NaiveBayes/NaiveBayes-BreastCancer-main/dashboard/dist';
for (const file of ['app.js', 'model.js', 'data.json', 'styles.css']) {
  assert.equal(await hash(`${bayesSource}/${file}`), await hash(`dist/projects/project-02/${file}`), `Original dashboard asset changed: ${file}`);
}
assert.ok(!files.some(file => file.includes('NaiveBayes-BreastCancer-main') || file.includes('node_modules')), 'Dashboard source archives must not be published');
const certificateFiles = certificates.flatMap(c => c.files).sort();
const certificateHashes = JSON.parse(await readFile('scripts/certificate-sha256.json','utf8'));
assert.equal(new Set(certificateFiles).size, certificateFiles.length, 'Duplicate certificate references');
assert.deepEqual(Object.keys(certificateHashes).sort(), certificateFiles, 'Update the certificate hash manifest when changing the catalog');
assert.deepEqual((await readdir('dist/assets/certificates')).sort(), certificateFiles, 'Unexpected or missing public certificate');
for (const file of certificateFiles) {
  assert.equal(await hash(join('public/assets/certificates',file)), certificateHashes[file], `Source certificate changed: ${file}`);
  assert.equal(await hash(join('dist/assets/certificates',file)), certificateHashes[file], `Published certificate changed: ${file}`);
  assert.ok(home.includes(`assets/certificates/${file}`), `Certificate is not linked: ${file}`);
}
// Private source archives are optional and never required by a fresh clone.
if (process.argv.includes('--originals')) {
  const mappings = JSON.parse(await readFile('source-materials/public-asset-map.json','utf8'));
  const canonicalCopies = {
    'udemy-devops-original-copy.pdf': 'udemy-devops.pdf',
    'google-desarrollo-apps-moviles-original-copy.pdf': 'google-desarrollo-apps-moviles.pdf'
  };
  for (const [original,destination] of Object.entries(mappings)) {
    const published = canonicalCopies[destination] ?? destination;
    assert.equal(await hash(join('source-materials/originals/certificados',original)), await hash(join('dist/assets/certificates',published)));
  }
  for (const item of JSON.parse(await readFile('source-materials/inventory.json','utf8'))) {
    assert.equal(await hash(join('source-materials/originals',item.original)), item.sha256);
  }
  console.log('PASS: private originals match their inventory and published certificates.');
}
for (const file of files) assert.ok(!/(source-materials|originals|inventory|README|package|tmp|Files)/.test(file.slice(root.length)),`Private/unnecessary file in build: ${file}`);
console.log(`PASS: ${pages.length} pages, 3 projects, ${certificateFiles.length} certificate files, all local links, matching translations, certificate hashes, public-only build.`);
