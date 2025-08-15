import React, { useEffect, useRef, useState } from "react"

type Props = {
  auth0: { getIdTokenClaims: () => Promise<any> }
}
type Message = { id: string; userId: string; text: string; ts: number }

export default function Chat({ auth0 }: Props) {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [room] = useState("general")
  const esRef = useRef<EventSource | null>(null)

  async function send(){
    const claims = await auth0.getIdTokenClaims()
    const token = claims?.__raw as string | undefined
    await fetch("/.netlify/functions/chat-post", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ room, text })
    })
    setText("")
  }

  useEffect(()=>{
    (async ()=>{
      const claims = await auth0.getIdTokenClaims()
      const token = claims?.__raw as string | undefined
      const res = await fetch(`/.netlify/functions/chat-list?room=${room}&limit=50`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if(res.ok){
        const data = await res.json()
        setMessages(data.items ?? [])
      }
    })()

    const es = new EventSource(`/sse/${room}`)
    es.onmessage = (evt)=>{
      try{
        const msg = JSON.parse(evt.data) as Message
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id)
          return exists ? prev : [...prev.slice(-99), msg]
        })
      }catch{}
    }
    es.onerror = ()=>{ /* 자동 재연결 */ }
    esRef.current = es
    return ()=>{ es.close() }
  }, [auth0, room])

  return (
    <div style={{maxWidth:680, margin:"0 auto", padding:16}}>
      <h2>채팅</h2>
      <div style={{border:"1px solid #ddd", borderRadius:12, padding:12, minHeight:260}}>
        {messages.map(m => (
          <div key={m.id} style={{padding:"6px 0", borderBottom:"1px dashed #eee"}}>
            <div style={{fontSize:12, opacity:.7}}>{new Date(m.ts).toLocaleString()} · {m.userId}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex", gap:8, marginTop:12}}>
        <input value={text} onChange={e=>setText(e.target.value)} style={{flex:1, padding:10}} placeholder="메시지 입력" />
        <button onClick={send} disabled={!text.trim()}>보내기</button>
      </div>
    </div>
  )
}
