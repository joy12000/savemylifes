// scripts/patch-expo-modules-core.js
const fs = require('fs');
const path = require('path');

function rewriteExports(obj) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === 'string') {
      obj[k] = v
        .replace(/src\/index\.ts$/, 'build/index.js')
        .replace(/src\/.*\.ts$/, (m) => m.replace('src/', 'build/').replace(/\.ts$/, '.js'));
    } else if (v && typeof v === 'object') {
      rewriteExports(v);
    }
  }
}

try {
  const pkgPath = require.resolve('expo-modules-core/package.json');
  const json = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (json.exports && typeof json.exports === 'object') {
    rewriteExports(json.exports);
  }
  if (typeof json.main === 'string' && json.main.includes('src/')) {
    json.main = json.main.replace('src/', 'build/').replace(/\.ts$/, '.js');
  }
  if (typeof json.module === 'string' && json.module.includes('src/')) {
    json.module = json.module.replace('src/', 'build/').replace(/\.ts$/, '.js');
  }

  fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2));
  console.log('[patch] expo-modules-core => build/로 exports 강제 변경 완료');
} catch (e) {
  console.warn('[patch] expo-modules-core 패치 건너뜀:', e?.message || e);
}
