
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

## 변경추가: 아이콘 라이브러리 교체
- `lucide-react-native` → **@expo/vector-icons (Feather)** 로 교체했습니다.
- 코드에서 `<Heart />` 같은 루시드 아이콘은 `<Feather name="heart" />` 형태로 자동 변환되어 제공합니다.
- 별도 네이티브 링크 작업이 필요 없고, Expo Web/모바일 모두 호환됩니다.

## 버전 정렬
- React **19.0.0** / React Native **0.79.1** (원본 프로젝트 라인 유지)
- devDeps `@types/react`는 **^19.0.0** 으로 맞췄습니다.
