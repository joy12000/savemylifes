import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { ReactNode } from 'react'

const domain = import.meta.env.VITE_AUTH0_DOMAIN || (window as any).ENV_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || (window as any).ENV_AUTH0_CLIENT_ID
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || (window as any).ENV_AUTH0_AUDIENCE
const redirectUri = window.location.origin

export function AuthGate({ children }: { children: ReactNode }) {
  if (!domain || !clientId) return <>{children}</>
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri, ...(audience ? { audience } : {}) }}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  )
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  if (!domain || !clientId) return children
  if (isLoading) return <div className="p-6">로딩중…</div>
  if (!isAuthenticated) { loginWithRedirect(); return <div className="p-6">로그인으로 이동…</div> }
  return children
}
