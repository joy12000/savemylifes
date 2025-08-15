
const fs = require('fs');
const path = require('path');

const dist = path.join(process.cwd(), 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

// SPA fallback
fs.writeFileSync(path.join(dist, '_redirects'), '/* /index.html 200\n');
// 200.html
fs.writeFileSync(path.join(dist, '200.html'), '<!doctype html><meta charset="utf-8"><script>location.href="/"</script>');
// health
fs.writeFileSync(path.join(dist, 'health.txt'), String(Date.now()));
console.log('postbuild artifacts created');
