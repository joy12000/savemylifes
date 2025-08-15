# HANDOFF (웹 빌드 안정 세트)

## 한 줄 요약
* **Node 20.19.4 고정 + 웹 빌드에서 Expo 네이티브 플러그인 해석 차단 + (선택) expo-modules-core 패치**

## 배포 순서
1) `.nvmrc`, `app.config.js`, `netlify.toml`, `babel.config.js`, `scripts/*`가 포함됐는지 확인
2) Netlify에서 **Clear cache and deploy**
3) 로컬 테스트(선택)
   ```bash
   nvm use 20.19.4
   export NETLIFY=true EXPO_WEB_BUILD=true
   npm ci --legacy-peer-deps
   npm run build
   ```

## 주의
* Netlify 환경변수에 `NPM_FLAGS=--legacy-peer-deps`, `EXPO_WEB_BUILD=true` 유지
* 간헐적 TS 소스 로딩 이슈 시 `npm i` 후 postinstall 패치 로그 확인
