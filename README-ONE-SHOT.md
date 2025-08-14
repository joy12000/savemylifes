# 한방 패치: 덮어쓰기만 하면 로그인+채팅 완성
- jose 의존성, Vite 플러그인, Functions/Edge, UI 수정이 모두 포함.
- **해야 할 일: 이 ZIP을 package.json이 있는 폴더(루트 또는 project/)에 덮어쓰기 → Clear cache & deploy**

## Netlify 환경변수
- AUTH0_DOMAIN=YOUR_TENANT.auth0.com
- (선택) AUTH0_AUDIENCE=...

## Auth0 대시보드
- Callback/Logout/Web Origins에 https://YOURDOMAIN/ 추가
