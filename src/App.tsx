import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import Home from './pages/Home'
import Capture from './pages/Capture'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import Header from './components/Header'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const redirectUri = window.location.origin

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const loc = useLocation()
  if (isLoading) return <div className="p-6">로딩중...</div>
  if (!isAuthenticated) {
    loginWithRedirect({ appState: { returnTo: loc.pathname } })
    return <div className="p-6">로그인으로 이동 중...</div>
  }
  return children
}

export default function App() {
  return (
    <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: redirectUri }}>
      <div className="app-shell max-w-3xl mx-auto px-[var(--safe-gutter)]">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capture" element={<RequireAuth><Capture /></RequireAuth>} />
          <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Auth0Provider>
  )
}
