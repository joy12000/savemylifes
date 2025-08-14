# 실전 Netlify 무료 플랜: 로그인 + 채팅(실시간) 템플릿

- **로그인**: Netlify Identity는 2025-02-28 공식 폐기(deprecated). 권장 대안: **Auth0 확장** 또는 **Supabase Auth**.
- **채팅 저장소**: Netlify **Blobs** (키-값/JSON 저장) 사용.
- **실시간**: Edge Function으로 **SSE**(서버-전송-이벤트) 구현 + Functions로 쓰기.

## 1) Netlify에서 Auth0 확장 연결
- Netlify 대시보드 → **Extensions → Auth0** 설치 및 테넌트 연결.
- Auth0에서 SPA 앱 생성 (Callback: `https://<사이트도메인>/`).
- Netlify 환경변수 설정:
  - `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID` (빌드 시 사용)

문서: Netlify Changelog(Identity 폐기), Auth0 extension 가이드 참조.

## 2) 배포
- GitHub에 소스 덮어쓰기 → Netlify 자동 빌드(`npm run build`) / 배포(`dist`).
- 새로고침 404는 `netlify.toml` 리다이렉트로 해결.

## 3) 사용 방법
- 로그인 버튼 → Auth0 인증 → 채팅 방(`general`)에서 메시지 전송.
- 실시간 수신: `/sse/:room` 경로로 SSE 스트림 연결.
- 저장: `netlify/functions/chat-post.ts` 가 Blobs `chat` 스토어에 JSON 문서로 적재.

## 4) 로컬 개발
- `.env`를 루트에 복사(.env.sample 참고).
- `npm i`, `npm run dev`

## 5) 한계(무료 플랜에서 현실 체크)
- Edge SSE는 장시간 연결 동안 **Edge 함수 호출 수**가 늘 수 있음.
- 메시지 폭주 방지: 차후 rate-limit(분당 30회) 등을 Functions에 추가 권장.
