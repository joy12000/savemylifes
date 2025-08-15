import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

// Auth0 Callback URL은 슬래시 포함이므로 문자열 결합으로 보장
const redirectUri = window.location.origin + "/";
const envReady = !!domain && !!clientId;

export function AuthGate({ children }: { children: ReactNode }) {
  // ENV가 미설정이면 그냥 children만 렌더(개발 편의)
  if (!envReady) return <>{children}</>;

  return (
    <Auth0Provider
      domain={domain!}
      clientId={clientId!}
      authorizationParams={{
        redirect_uri: redirectUri,
        ...(audience ? { audience } : {}),
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      {children}
    </Auth0Provider>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  // ENV 미설정 시 인증 우회(개발 편의)
  if (!envReady) return <>{children}</>;

  const { isLoading, isAuthenticated, loginWithRedirect, error } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // redirect_uri는 Provider authorizationParams에 의해 자동 처리
      void loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) return <div style={{ padding: 24 }}>인증 확인 중…</div>;
  if (error) return <div style={{ padding: 24, color: "salmon" }}>인증 오류: {String(error)}</div>;
  if (!isAuthenticated) return null; // redirect 진행 중

  return <>{children}</>;
}
