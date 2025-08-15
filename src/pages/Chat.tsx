import { useEffect, useRef, useState } from 'react'
import { listMessages, saveMessage, subscribe } from '../lib/api'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Chat() {
  const [room] = useState('default')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let unsub = () => {}
    ;(async () => {
      const initial = await listMessages(room)
      setMessages(initial)
      unsub = subscribe(room, (msg) => setMessages((m) => [...m, msg]))
    })()
    return () => unsub()
  }, [room])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text) return
    setInput('')
    await saveMessage({ room, text })
  }

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="mt-6">
      <div className="card p-4 sm:p-5">
        <div className="text-lg font-semibold mb-3">채팅</div>
        <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
          {messages.map((m, i) => (
            <div key={m.id || i} className="flex">
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 shadow-soft w-full">
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{new Date(m.ts||Date.now()).toLocaleString()}</span>
                  {m.meta?.kind === 'sos' && <span className="badge">SOS</span>}
                </div>
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                {m.meta?.geo && (
                  <a className="text-sm text-brand-600 underline" target="_blank" rel="noreferrer"
                    href={`https://maps.google.com/?q=${m.meta.geo.lat},${m.meta.geo.lon}`}>
                    지도에서 보기
                  </a>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <input className="input flex-1" value={input} onChange={e=>setInput(e.target.value)} placeholder="메시지 입력" />
          <button className="btn btn-primary" onClick={send}><Send className="w-4 h-4" /> 보내기</button>
        </div>
      </div>
    </motion.div>
  )
}
