
# Patch: Netlify Blobs explicit credentials (siteID, token)

업로드 위치(중요):
- netlify/functions/chat-post.ts
- netlify/functions/chat-list.ts

1) 이 ZIP을 풀고 위 두 파일을 **저장소 루트의 동일 경로**에 덮어쓰기 커밋
2) Netlify → Deploys → **Clear cache and deploy site**
3) 배포 로그에서 두 함수가 패키징되는지 확인
4) 로그인 후 메시지 전송 테스트 (200 응답 기대)

필요 환경변수:
- BLOBS_SITE_ID = Site settings → Site information → API ID
- BLOBS_TOKEN   = User settings → Applications → Personal access tokens (신규 발급)
