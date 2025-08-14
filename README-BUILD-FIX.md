# Netlify 빌드 실패(EUSAGE, npm ci) 해결 패치
- 빌드 명령을 `npm install`로 변경하여 lockfile 불일치 오류를 회피합니다.
- `.npmrc`로 peer dependency 충돌을 느슨하게 처리합니다.

## 적용 방법
1) 이 ZIP 안의 파일을 **저장소 루트에 덮어쓰기** 커밋
2) Netlify → **Clear cache and deploy site**
3) 정상 로그 예시:
   - Executing user command: npm install --no-audit --no-fund && npm run build
   - Starting to deploy site from 'dist'
