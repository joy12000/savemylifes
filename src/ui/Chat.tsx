import React, { useEffect, useRef, useState } from "react";
import type { Auth0Client } from "@auth0/auth0-spa-js";

type Msg = {
  id: string;
  room: string;
  userId: string;
  userName: string;
  text: string;
  ts: number;
};

const ROOM_ID = "general";

async function getBearer(auth0: Auth0Client) {
  const claims = await auth0.getIdTokenClaims();
  return claims?.__raw;
}

export function Chat({ user, auth0 }: { user: any, auth0: Auth0Client }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const evtRef = useRef<EventSource | null>(null);

  async function fetchHistory() {
    const token = await getBearer(auth0);
    const res = await fetch(`/.netlify/functions/chat-list?room=${encodeURIComponent(ROOM_ID)}&limit=50`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: "include"
    });
    const data = await res.json();
    setMessages(data.messages || []);
  }

  async function sendMessage() {
    const token = await getBearer(auth0);
    const body = { room: ROOM_ID, text };
    const res = await fetch("/.netlify/functions/chat-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      alert("메시지 전송 실패: " + t);
      return;
    }
    setText("");
  }

  useEffect(() => {
    fetchHistory();
    const url = `/sse/${encodeURIComponent(ROOM_ID)}`;
    const es = new EventSource(url, { withCredentials: true });
    evtRef.current = es;
    es.onmessage = (ev) => {
      try {
        const m = JSON.parse(ev.data) as Msg;
        setMessages((prev) => {
          const exists = prev.some(x => x.id === m.id);
          if (exists) return prev;
          return [...prev, m].slice(-100);
        });
      } catch {}
    };
    es.onerror = () => {};
    return () => { es.close(); };
  }, []);

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{height: '60vh', overflowY: 'auto', border: '1px solid #ddd', borderRadius: 8, padding: 12}}>
        {messages.map(m => (
          <div key={m.id} style={{marginBottom:8}}>
            <b>{m.userName || m.userId}</b>
            <span style={{color:'#999', marginLeft:6, fontSize:12}}>{new Date(m.ts).toLocaleTimeString()}</span>
            <div>{m.text}</div>
          </div>
        ))}
        {messages.length === 0 && <div style={{color:'#666'}}>아직 메시지가 없어요.</div>}
      </div>
      <div style={{display:'flex', gap:8}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="메시지…" style={{flex:1, padding:8}} />
        <button onClick={sendMessage} disabled={!text.trim()}>전송</button>
      </div>
    </div>
  );
}
