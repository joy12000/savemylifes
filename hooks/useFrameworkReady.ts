import { useEffect, useState } from 'react';

// 앱이 마운트되면 즉시 '준비 완료'로 바꿔주는 간단 훅
// 필요 시 폰트/스플래시 로딩 등을 여기에 추가할 수 있음.
export function useFrameworkReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready;
}
