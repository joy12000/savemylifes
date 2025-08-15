// scripts/postbuild.js
const fs = require('fs');
const path = require('path');

const dist = path.join(process.cwd(), 'dist');
if (!fs.existsSync(dist)) {
  console.error('[postbuild] dist/ not found. Did export succeed?');
  process.exit(0);
}

// Ensure Netlify SPA 404 fallback file exists (optional)
const indexPath = path.join(dist, 'index.html');
const notFoundPath = path.join(dist, '404.html');
try {
  if (fs.existsSync(indexPath) && !fs.existsSync(notFoundPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('[postbuild] 404.html created from index.html');
  } else {
    console.log('[postbuild] 404.html already present or index missing');
  }
} catch (e) {
  console.warn('[postbuild] Failed to ensure 404.html:', e?.message || e);
}
