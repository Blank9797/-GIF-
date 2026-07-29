const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8660;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { res.writeHead(400); return res.end(); }
  if (req.method === 'POST' && p === '/save') {
    const chunks = [];
    req.on('data', c => { chunks.push(c); if (chunks.reduce((a, b) => a + b.length, 0) > 20e6) req.destroy(); });
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      const dir = path.join(__dirname, 'samples');
      fs.mkdirSync(dir, { recursive: true });
      const name = 'kirby-' + Date.now() + '.gif';
      fs.writeFile(path.join(dir, name), buf, err => {
        if (err) { res.writeHead(500); return res.end(String(err)); }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ saved: 'samples/' + name }));
      });
    });
    return;
  }
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(__dirname, p));
  if (!file.startsWith(__dirname)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('⭐ Kirby GIF Maker → http://localhost:' + PORT);
});
