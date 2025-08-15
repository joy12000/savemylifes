
import { useAuth } from '@/providers/AuthProvider';

export function useApi() {
  const { getIdToken } = useAuth();

  async function authedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const token = await getIdToken();
    const headers = new Headers(init.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (!headers.has('content-type') && init.method && init.method !== 'GET') {
      headers.set('content-type', 'application/json');
    }
    return fetch(input, { ...init, headers });
  }

  return { authedFetch };
}
