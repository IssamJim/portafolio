import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { serve } from './serve.mjs';
process.chdir(resolve(import.meta.dirname, '..'));
function build() {
  return spawnSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'}).status === 0;
}
if (!build()) process.exit(1);
serve();
let timer;
for (const path of ['src','public','projects','index.html']) {
  watch(path,{recursive:true},()=> {
    clearTimeout(timer);
    timer = setTimeout(()=> { if (build()) console.log('Updated. Refresh your browser.'); },200);
  });
}
