// Minimal framework-ready hook for Expo Web
// 역할: 앱이 마운트되면 바로 '준비 완료' 상태를 true로 돌려줌
// 필요하면 폰트/스플래시 초기화 로직을 여기에 추가할 수 있음.
import { useEffect, useState } from 'react';

export function useFrameworkReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // 다음 프레임에 ready 처리 (브라우저 렌더 안정화)
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready;
}
