import { Auth0Provider } from "@auth0/auth0-react";
import type { ReactNode } from "react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

// Auth0 Callback URL은 슬래시 포함이므로 문자열 결합으로 보장한다.
const redirectUri = window.location.origin + "/";

export function AuthGate({ children }: { children: ReactNode }) {
  // ENV가 미설정이면 그냥 children만 렌더(개발 편의)
  if (!domain || !clientId) return <>{children}</>;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
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
