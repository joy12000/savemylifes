import { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveMessage } from '../lib/api'
import { AlarmClockCheck, Navigation, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string|null>(null)

  async function sendSOS() {
    setBusy(true); setStatus(null)
    try {
      let geo: any = null
      if ('geolocation' in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000 })
          )
          geo = { lat: pos.coords.latitude, lon: pos.coords.longitude, acc: pos.coords.accuracy }
        } catch {}
      }
      const maps = geo ? `https://maps.google.com/?q=${geo.lat},${geo.lon}` : ''
      const text = `🔴 SOS - 도움이 필요합니다. ${geo ? `(위치: ${geo.lat.toFixed(5)}, ${geo.lon.toFixed(5)})` : ''} ${maps}`
      await saveMessage({ room: 'sos', text, meta: { kind: 'sos', geo } as any })
      setStatus('SOS 전송 완료')
    } catch (e: any) {
      setStatus('전송 실패: ' + (e.message || e.toString()))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">생존신고 · KeepAlive</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">버튼 하나로 신속한 SOS. 채팅으로 소통.</p>
          </div>
          <AlarmClockCheck className="w-10 h-10 text-brand-500" />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button className="btn btn-primary text-lg px-6 py-3" onClick={sendSOS} disabled={busy}>
            🔴 SOS 보내기
          </button>
          <Link to="/chat" className="btn btn-ghost"><MessageSquare className="w-4 h-4" /> 채팅으로 이동</Link>
        </div>

        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          위치 권한을 허용하면 좌표를 메시지에 포함합니다. 권한이 없어도 SOS는 전송됩니다.
        </div>
        {status && <div className="mt-2 text-sm">{status}</div>}
      </motion.section>
    </div>
  )
}
