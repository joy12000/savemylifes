import React, { useEffect, useState } from "react"
// ⬇️ default가 아님! named import로 바꿔야 함
import { createAuth0Client } from "@auth0/auth0-spa-js"
import type { Auth0Client } from "@auth0/auth0-spa-js"
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom"
import Chat from "./Chat"
import Report from "./Report"

export default function App() {
  const [auth0, setAuth0] = useState<Auth0Client | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE

  useEffect(() => {
    (async () => {
      const auth = await createAuth0Client({
        domain,
        clientId,
        authorizationParams: {
          redirect_uri: window.location.origin,
          ...(audience ? { audience } : {})
        }
      })
      // 로그인 리다이렉트 처리
      if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        await auth.handleRedirectCallback()
        window.history.replaceState({}, document.title, window.location.pathname)
      }
      setAuth0(auth)
      setIsAuth(await auth.isAuthenticated())
    })()
  }, [domain, clientId, audience])

  if (!auth0) return <div style={{ padding: 20 }}>로딩 중…</div>

  return (
    <BrowserRouter>
      <Nav auth0={auth0} isAuth={isAuth} onAuthChange={setIsAuth} />
      <Routes>
        <Route path="/" element={<Chat auth0={auth0} />} />
        <Route path="/report" element={<Report auth0={auth0} />} />
      </Routes>
    </BrowserRouter>
  )
}

function Nav({
  auth0, isAuth, onAuthChange
}: { auth0: Auth0Client; isAuth: boolean; onAuthChange: (b: boolean) => void }) {
  const nav = useNavigate()
  async function login() {
    await auth0.loginWithRedirect()
  }
  async function logout() {
    await auth0.logout({ logoutParams: { returnTo: window.location.origin } })
    onAuthChange(false)
    nav("/")
  }
  useEffect(() => {
    (async () => onAuthChange(await auth0.isAuthenticated()))()
  }, [auth0, onAuthChange])

  return (
    <div style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee", alignItems: "center" }}>
      <Link to="/" style={{ fontWeight: 800 }}>생존신고·채팅</Link>
      <Link to="/report">생존신고</Link>
      <div style={{ marginLeft: "auto" }}>
        {isAuth ? <button onClick={logout}>로그아웃</button> : <button onClick={login}>로그인</button>}
      </div>
    </div>
  )
}
