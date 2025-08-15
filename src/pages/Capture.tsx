import { useState } from 'react'
import { saveMessage } from '../lib/api'
import { ClipboardPaste, Save } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Capture() {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string|null>(null)

  async function handlePaste() {
    try {
      const clip = await navigator.clipboard.readText()
      setText(clip)
    } catch {
      alert('클립보드 권한 허용 후 다시 시도하세요.')
    }
  }

  async function handleSave() {
    setBusy(true); setStatus(null)
    try {
      await saveMessage({ room: 'default', text })
      setStatus('저장 완료!')
      setText('')
    } catch (e: any) {
      setStatus('저장 실패: ' + (e.message || e.toString()))
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="mt-6">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">캡처 / 붙여넣기</h2>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={handlePaste}><ClipboardPaste className="w-4 h-4" /> 붙여넣기</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={busy || !text.trim()}>
              <Save className="w-4 h-4" /> 저장
            </button>
          </div>
        </div>
        <textarea
          className="textarea mt-3 h-48"
          placeholder="여기에 붙여넣기 하세요 (최대 5000자)"
          value={text} onChange={e=>setText(e.target.value)}
        />
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          팁: <span className="kbd">⌘</span>/<span className="kbd">Ctrl</span> + <span className="kbd">V</span> 로 바로 붙여넣기
        </div>
        {status && <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{status}</p>}
      </div>
    </motion.div>
  )
}
