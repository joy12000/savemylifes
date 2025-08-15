
# UI 통합 패치 가이드

이 폴더의 파일을 **프로젝트 루트에 덮어쓰기** 하세요.

## 바뀌는/추가되는 파일
- `app/_layout.tsx` : `AuthProvider`로 전체 감싸기
- `providers/AuthProvider.tsx` : 웹 전용 Auth0 래퍼
- `lib/api.ts` : 인증 토큰을 자동으로 헤더에 넣는 fetch 헬퍼
- `app/(tabs)/chat.tsx` : 채팅방 카드 → 실제 채팅 페이지로 네비게이션
- `app/chat/[room].tsx` : 실제 채팅 UI + SSE
- `app/(tabs)/index.tsx` : 홈의 "생존신고" 버튼이 서버 함수 호출
- `package.json` : `@auth0/auth0-spa-js` 의존성 추가 필요

## Netlify 환경변수(프론트, Expo 웹 빌드용)
- `EXPO_PUBLIC_AUTH0_DOMAIN = your-tenant.auth0.com`
- `EXPO_PUBLIC_AUTH0_CLIENT_ID = ...`

※ 서버 환경변수(`AUTH0_DOMAIN`, `BLOBS_SITE_ID`, `BLOBS_TOKEN` 등)는 기존 그대로 유지.

## 사용법
1) 이 폴더 내용 전체를 프로젝트 루트에 덮어쓰기
2) `package.json`에 `@auth0/auth0-spa-js` 추가(이미 동봉됨 / 의존성 설치 시 반영)
3) Netlify에 위 `EXPO_PUBLIC_*` 두 개 환경변수 추가 후 **Clear cache and deploy**
4) 웹에서 로그인 → 홈에서 "생존신고", 채팅 탭→채팅방 카드 클릭→실제 채팅 동작 확인
