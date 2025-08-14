import React, { useEffect, useRef, useState } from "react";

type Msg = {
  id: string;
  room: string;
  userId: string;
  userName: string;
  text: string;
  ts: number;
};

const ROOM_ID = "general";

export function Chat({ user }: { user: any }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const evtRef = useRef<EventSource | null>(null);

  async function fetchHistory() {
    const res = await fetch(`/api/chat-list?room=${encodeURIComponent(ROOM_ID)}&limit=50`, { credentials: "include" });
    const data = await res.json();
    setMessages(data.messages || []);
  }

  async function sendMessage() {
    const body = { room: ROOM_ID, text };
    const res = await fetch("/.netlify/functions/chat-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      alert("메시지 전송 실패");
      return;
    }
    setText("");
  }

  useEffect(() => {
    fetchHistory();
    // SSE 구독
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
    es.onerror = () => { /* silent; edge function will retry via client reconnect */ };
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
