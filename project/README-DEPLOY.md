# 배포 체크리스트(프로덕션 404 방지판)

1) Netlify → Deploys → **Production deploy**가 'Published' 상태인지 확인
2) 'Deploy preview'가 정상이면 해당 프리뷰에서 **Publish deploy** 버튼 눌러 프로덕션으로 승격
3) 사이트 루트에서 `/health.txt`를 열어 숫자(빌드타임)가 보이면 올바른 폴더가 퍼블리시됨
4) SPA 라우팅:
   - `dist/_redirects` : `/* /index.html 200`
   - `dist/200.html` : `index.html` 복제 (이중 안전장치)
