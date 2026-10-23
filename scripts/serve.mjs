import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
export function serve(port = Number(process.env.PORT || 4173)) {
  const root = resolve(import.meta.dirname, '../dist');
  const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.pdf':'application/pdf'};
  const server = createServer(async (req,res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      let file = resolve(root, '.' + pathname);
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith('/')) {
          const canonical = new URL(req.url, 'http://localhost');
          res.writeHead(308, { Location: canonical.pathname + '/' + canonical.search }).end();
          return;
        }
        file = resolve(file, 'index.html');
      }
      res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff'});
      res.end(await readFile(file));
    } catch { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}).end('404'); }
  });
  server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
  return server;
}
if (process.argv[1] === import.meta.filename) serve();
