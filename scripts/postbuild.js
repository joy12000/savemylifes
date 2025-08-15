// scripts/postbuild.js
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const dist = join(process.cwd(), 'dist');
if (!existsSync(dist)) mkdirSync(dist, { recursive: true });

writeFileSync(join(dist, '_redirects'), '/*    /index.html   200\n', 'utf8');
writeFileSync(join(dist, '200.html'), '<!doctype html><meta http-equiv="refresh" content="0; url=/" />', 'utf8');
writeFileSync(join(dist, 'health.txt'), String(Date.now()), 'utf8');

console.log('postbuild artifacts created');