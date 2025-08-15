
# UI 통합 패치 v3 (Expo UI 유지 + 기능연동 + React 19 정렬)

## 이 폴더를 **프로젝트 루트에 그대로 덮어쓰기** 하세요.

### 포함 사항
- `components/icons.tsx`: `lucide-react-native` 대체 (Feather 아이콘으로 매핑)
- `app/(tabs)/*`: 아이콘 import를 `@/components/icons`로 교체
- `app/chat/[room].tsx`: 실제 채팅 화면 (SSE + 전송)
- `app/(tabs)/chat.tsx`: 카드 클릭 → `/chat/[room]` 이동
- `app/(tabs)/index.tsx`: 생존신고 버튼 → `/.netlify/functions/report-submit` 호출
- `app/_layout.tsx`: 전체를 `AuthProvider`로 래핑
- `providers/AuthProvider.tsx` + `lib/api.ts`
- `package.json`: `react@19`, `@types/react@^19`, `@expo/vector-icons`, `@auth0/auth0-spa-js` 추가, `lucide-react-native` 제거
- `scripts/postbuild.js`, `netlify.toml`

### 환경변수
- 웹(Expo): `EXPO_PUBLIC_AUTH0_DOMAIN`, `EXPO_PUBLIC_AUTH0_CLIENT_ID`
- 함수: `AUTH0_DOMAIN`, `BLOBS_SITE_ID`, `BLOBS_TOKEN`

### 배포 순서
1) 이 패치 덮어쓰기 커밋
2) **package-lock.json 삭제** 후 커밋
3) Netlify에서 **Clear cache and deploy site**
4) `/health.txt`, `/.netlify/functions/blobs-status` 확인
