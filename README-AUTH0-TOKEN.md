# Auth0 토큰 전달 & 함수 검증 패치
- 프론트: ID 토큰을 `Authorization: Bearer <token>`로 전송
- 백엔드(Functions): `jose`로 JWT 검증. 도메인/이슈어는 `AUTH0_DOMAIN`(또는 `VITE_AUTH0_DOMAIN`) 사용
- API 경로: `/.netlify/functions/*` 로 고정

## 적용
1) 이 ZIP을 저장소 루트에 덮어쓰기 (파일 3개 교체/추가)
   - src/ui/App.tsx
   - src/ui/Chat.tsx
   - netlify/functions/chat-post.ts
   - netlify/functions/chat-list.ts
2) package.json에 `"jose": "^5.9.3"` 추가 후 커밋 (또는 수동으로 추가)
3) Netlify 환경변수에 `AUTH0_DOMAIN`(예: your-tenant.auth0.com) 추가
   - 선택: `AUTH0_AUDIENCE`(API 설정했을 때)
4) Netlify → Clear cache and deploy site

## Auth0 설정 체크
- Allowed Callback URLs: https://YOURDOMAIN/
- Allowed Logout URLs: https://YOURDOMAIN/
- Allowed Web Origins: https://YOURDOMAIN/, https://*.netlify.app, http://localhost:5173
