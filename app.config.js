// app.config.js
let base = {};
try {
  base = require('./app.json').expo ?? {};
} catch {}

module.exports = ({ config } = {}) => {
  const isWebBuild =
    process.env.NETLIFY === 'true' || process.env.EXPO_WEB_BUILD === 'true';

  const merged = { ...base, ...(config || {}) };

  if (isWebBuild) {
    return {
      ...merged,
      // ★ 웹에서는 네이티브 플러그인 해석을 막아 TS 로딩 문제 차단
      plugins: [],
    };
  }

  return merged;
};
