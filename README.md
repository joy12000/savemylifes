
# savemylifes (생존신고 · 채팅)

## 1) 필요한 환경변수
### 프론트(VITE_*)
- VITE_AUTH0_DOMAIN = your-tenant.auth0.com
- VITE_AUTH0_CLIENT_ID = (Auth0 Client ID)
- VITE_AUTH0_AUDIENCE = (선택)

### 함수(서버)
- AUTH0_DOMAIN = your-tenant.auth0.com
- BLOBS_SITE_ID = Netlify Site API ID
- BLOBS_TOKEN = Netlify Personal Access Token
- (선택) ALERT_THRESHOLD_MS = 86400000
- (선택) ALERT_WEBHOOK_URL = https://hooks.example

## 2) 사용법
- npm i
- npm run dev
- npm run build (Netlify는 자동)
- Netlify → Clear cache and deploy

## 3) 엔드포인트
- 채팅: /.netlify/functions/chat-post, chat-list
- 실시간: /sse/:room (Edge)
- 생존신고: /.netlify/functions/report-submit
- 스케줄러: alerts-check (매시간)
- 진단: /.netlify/functions/blobs-status
