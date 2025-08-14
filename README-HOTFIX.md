# 빌드 실패( Cannot find module '@vitejs/plugin-react' ) 핫픽스
- 원인: vite.config.ts에서 `@vitejs/plugin-react`를 import하는데 devDependency가 없어서 오류 발생.
- 조치: package.json에 `@vitejs/plugin-react`와 맞는 `vite` 버전을 추가.

## 적용 방법
1) 이 ZIP의 파일들을 **저장소 루트에 덮어쓰기 커밋**
2) Netlify에서 **Clear cache and deploy site**
3) 정상 로그 예시:
   - Detected framework "vite"
   - > vite build
   - Starting to deploy site from 'dist'
