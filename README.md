# savemylifes (생존신고 · 채팅) — v2 점검본

## 환경변수
### 프론트(VITE_*)
- VITE_AUTH0_DOMAIN
- VITE_AUTH0_CLIENT_ID
- (선택) VITE_AUTH0_AUDIENCE

### 함수(서버)
- AUTH0_DOMAIN
- BLOBS_SITE_ID
- BLOBS_TOKEN
- (선택) ALERT_THRESHOLD_MS, ALERT_WEBHOOK_URL

## 빌드
- npm i
- npm run build
- Netlify는 자동으로 functions/edge 번들
