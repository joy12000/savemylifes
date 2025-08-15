import { useEffect, useRef, useState } from 'react'
import { listMessages, saveMessage, subscribe } from '../lib/api'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      const initial = await listMessages('default')
      setMessages(initial)
      subscribe('default', (msg) => {
        setMessages((m) => [...m, msg])
      })
    })()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim()) return
    await saveMessage({ room: 'default', text: input })
    setInput('')
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="card">
        <h2 className="font-semibold">채팅</h2>
        <div className="mt-3 space-y-2 max-h-[50vh] overflow-auto pr-1">
          {messages.map((m, i) => (
            <div key={m.id || i} className="rounded-xl bg-slate-100 px-3 py-2">
              <div className="text-sm text-slate-500">{new Date(m.ts||Date.now()).toLocaleString()}</div>
              <div>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <input className="input flex-1" value={input} onChange={e=>setInput(e.target.value)} placeholder="메시지 입력" />
          <button className="btn btn-primary" onClick={send}>보내기</button>
        </div>
      </div>
    </div>
  )
}
