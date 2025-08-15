# KeepAlive (Vite React Web, Netlify Functions + Blobs)

## 왜 갈아엎었나
Expo+RNW에서 웹 빌드시 `expo-modules-core`/Metro 버전 충돌이 반복되어, **웹 전용으로 Vite React**로 재구성했습니다.
UI 구조/기능은 유지하면서, **빌드 안정성**을 최우선으로 했습니다.

## 기능
- Auth0 로그인(선택/환경변수 세팅 필요)
- 메시지 저장(Netlify Blobs)
- 실시간 수신(SSE; 폴링 기반)
- PWA(간이 SW) + 예쁜 기본 UI(Tailwind)

## 환경변수(.env)
```
VITE_AUTH0_DOMAIN=YOUR_DOMAIN
VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID
```
Netlify Dashboard에 다음이 있어야 합니다:
- BLOBS_SITE_ID / BLOBS_TOKEN (필요 시)
- AUTH0_DOMAIN / EXPO_PUBLIC_AUTH0_CLIENT_ID (Functions 토큰 검증 활성 시)

## 개발
```
npm i
npm run dev
```

## 배포(Netlify)
- `netlify.toml` 포함(배포 = dist/)
- Functions: `netlify/functions/*`
- Node 20 고정, esbuild 사용

## 라우팅
- SPA: 모든 경로 `/index.html`로 리다이렉트
