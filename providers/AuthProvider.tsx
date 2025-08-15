
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, Alert } from 'react-native';
import type { Auth0Client } from '@auth0/auth0-spa-js';
import { createAuth0Client } from '@auth0/auth0-spa-js';

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | undefined>;
};

const AuthContext = createContext<AuthContextValue>({
  isReady: false,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  getIdToken: async () => undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Auth0Client | null>(null);
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (Platform.OS !== 'web') {
        setReady(true);
        setAuthed(true); // 네이티브에선 임시로 인증 우회(웹만 사용)
        return;
      }
      const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN as string | undefined;
      const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID as string | undefined;
      if (!domain || !clientId) {
        console.warn('Missing EXPO_PUBLIC_AUTH0_* env - Auth will be disabled');
        setReady(true);
        return;
      }
      const c = await createAuth0Client({
        domain,
        clientId,
        authorizationParams: { redirect_uri: window.location.origin },
      });
      if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        await c.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      if (!mounted) return;
      setClient(c);
      setAuthed(await c.isAuthenticated());
      setReady(true);
    })();
    return () => { mounted = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isReady: ready,
    isAuthenticated: authed,
    login: async () => {
      if (Platform.OS !== 'web') {
        Alert.alert('로그인', '웹에서 로그인하세요 (네이티브는 비활성화)');
        return;
      }
      if (!client) return;
      await client.loginWithRedirect();
    },
    logout: async () => {
      if (Platform.OS !== 'web') return;
      await client?.logout({ logoutParams: { returnTo: window.location.origin } });
      setAuthed(false);
    },
    getIdToken: async () => {
      if (Platform.OS !== 'web') return undefined;
      const claims = await client?.getIdTokenClaims().catch(() => undefined) as any;
      return claims?.__raw as string | undefined;
    }
  }), [client, ready, authed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
