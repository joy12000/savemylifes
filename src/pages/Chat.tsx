import { useEffect, useRef, useState } from 'react'
import { listMessages, saveMessage, subscribe } from '../lib/api'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      const initial = await listMessages('default')
      setMessages(initial)
      subscribe('default', (msg) => setMessages((m) => [...m, msg]))
    })()
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim()) return
    await saveMessage({ room: 'default', text: input })
    setInput('')
  }

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="mt-6 space-y-4">
      <div className="card p-5">
        <h2 className="font-semibold">채팅</h2>
        <div className="mt-3 space-y-2 max-h-[55vh] overflow-auto pr-1">
          {messages.map((m, i) => (
            <div key={m.id || i} className="flex">
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 shadow-soft">
                <div className="text-[11px] text-slate-500">{new Date(m.ts||Date.now()).toLocaleString()}</div>
                <div className="whitespace-pre-wrap">{m.text}</div>
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
