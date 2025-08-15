import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="max-w-3xl mx-auto px-[var(--safe-gutter)] h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">🛰️ KeepAlive</Link>
        <div className="flex gap-2">
          <Link to="/capture" className={`btn btn-ghost ${pathname==='/capture'?'ring-2 ring-brand-400':''}`}>Capture</Link>
          <Link to="/chat" className={`btn btn-ghost ${pathname==='/chat'?'ring-2 ring-brand-400':''}`}>Chat</Link>
          <Link to="/settings" className={`btn btn-ghost ${pathname==='/settings'?'ring-2 ring-brand-400':''}`}>설정</Link>
        </div>
      </nav>
    </header>
  )
}
