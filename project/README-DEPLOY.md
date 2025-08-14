# Netlify 배포 가이드(초보자용)

## 1) 깃헙에 덮어쓰기
- 이 폴더 전체를 GitHub 저장소에 그대로 업로드(덮어쓰기 커밋).

## 2) Netlify에서 자동 배포
- `netlify.toml` 설정에 따라 자동으로 빌드됩니다.
- 빌드 명령: **npm ci && npx expo export -p web -o dist**
- 퍼블리시 폴더(업로드되는 폴더): **dist**

## 3) 새로고침 404 방지(싱글페이지 앱 라우팅)
- `netlify.toml`에 `/* -> /index.html` 리다이렉트가 설정되어 있어 딥링크/새로고침 시 404가 뜨지 않습니다.

## 4) 설치(PWA)와 자동 업데이트
- `public/manifest.webmanifest` + `public/sw.js`가 있어 설치가 가능합니다(브라우저 메뉴의 앱 설치).
- 서비스워커는 캐시를 거의 하지 않게 구성되어 **배포 직후 새 버전이 바로 반영**됩니다.

## 5) 자주 묻는 질문
- 설치 버튼이 안 보이면?
  - 데스크톱 Chrome: 주소창 우측 '앱 설치' 아이콘 확인
  - 모바일 Safari: 공유 버튼 → 홈 화면에 추가
- 업데이트가 안 보이면?
  - 강력 새로고침(Windows: Ctrl+F5, Mac: Cmd+Shift+R) 한 번만 시도
- 배포 폴더가 다르다고 나오면?
  - Netlify 대시보드의 Publish directory가 `dist`인지 확인
