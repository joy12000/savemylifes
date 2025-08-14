import React, { useEffect, useState } from "react";
import { createAuth0Client, type Auth0Client } from "@auth0/auth0-spa-js";
import { Chat } from "./Chat";

export function App() {
  const [auth0, setAuth0] = useState<Auth0Client | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
      const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
      const redirectUri = window.location.origin + "/";
      const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

      const client = await createAuth0Client({
        domain, clientId, authorizationParams: { redirect_uri: redirectUri, audience }
      });
      setAuth0(client);

      if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        await client.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
      }

      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        const profile = await client.getUser();
        setUser(profile);
      }
      setLoading(false);
    })();
  }, []);

  if (isLoading) return <div style={{padding:16}}>로딩중…</div>;

  if (!user) {
    return (
      <div style={{padding:24, display:'grid', gap:12, maxWidth:520}}>
        <h1>로그인 필요</h1>
        <p>Netlify + Auth0 + Blobs로 만든 실제 작동 채팅 데모</p>
        <button onClick={() => auth0!.loginWithRedirect()}>Auth0로 로그인</button>
      </div>
    );
  }

  return (
    <div style={{padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>채팅 데모</h1>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <span>{user.name || user.email}</span>
          <button onClick={() => auth0!.logout({ logoutParams: { returnTo: window.location.origin } })}>로그아웃</button>
        </div>
      </div>
      <Chat user={user} />
    </div>
  );
}
