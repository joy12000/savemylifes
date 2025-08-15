import { useState } from 'react'
import { saveMessage } from '../lib/api'

export default function Capture() {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string|null>(null)

  async function handlePasteFromClipboard() {
    try {
      const clip = await navigator.clipboard.readText()
      setText(clip)
    } catch (e: any) {
      alert('클립보드 읽기 권한이 필요해요. 먼저 텍스트를 복사한 뒤 브라우저 권한을 허용해주세요.')
    }
  }

  async function handleSave() {
    setBusy(true); setStatus(null)
    try {
      const res = await saveMessage({ room: 'default', text })
      setStatus('저장 완료!')
      setText('')
    } catch (e: any) {
      setStatus('저장 실패: ' + (e.message || e.toString()))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="card">
        <h2 className="font-semibold text-lg">캡처 / 붙여넣기</h2>
        <div className="mt-3 flex gap-2">
          <button className="btn btn-ghost" onClick={handlePasteFromClipboard}>📋 붙여넣기</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={busy || !text.trim()}>💾 저장</button>
        </div>
        <textarea
          className="input mt-3 h-40"
          placeholder="여기에 붙여넣기 하세요"
          value={text} onChange={e=>setText(e.target.value)}
        />
        {status && <p className="mt-2 text-sm text-slate-600">{status}</p>}
      </div>
    </div>
  )
}
