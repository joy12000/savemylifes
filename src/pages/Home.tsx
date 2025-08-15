import { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveMessage, doCheckIn } from '../lib/api'
import { AlarmClockCheck, Navigation, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

function CheckInButton() {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)
  async function checkIn() {
    setBusy(true); setMsg(null)
    try {
      const res = await doCheckIn()
      if (res.already) setMsg('오늘은 이미 생존신고 완료 ✅')
      else setMsg('생존신고 완료! ✅')
    } catch (e: any) {
      setMsg('실패: ' + (e?.message || e))
    } finally { setBusy(false) }
  }
  return (
    <div className="flex items-center gap-2">
      <button className="btn btn-primary" onClick={checkIn} disabled={busy}>
        <AlarmClockCheck className="w-4 h-4" /> 오늘 생존신고
      </button>
      {msg && <span className="text-sm">{msg}</span>}
    </div>
  )
}

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
      setStatus('전송 실패: ' + (e?.message || e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="pt-24">
      <motion.section initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="card p-5">
        <h1 className="text-xl font-semibold mb-2">KeepAlive · 생존신고</h1>
        <p className="text-slate-600 dark:text-slate-300">매일 체크인하고, 위급 시 위치와 함께 SOS를 보낼 수 있어요.</p>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <CheckInButton />
          <Link to="/settings" className="btn btn-ghost"><Navigation className="w-4 h-4" /> 설정</Link>
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
