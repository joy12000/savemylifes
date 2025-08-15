import { Link, useLocation } from 'react-router-dom'
import { Bot, MessageSquare, Settings as IconSettings } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { pathname } = useLocation()
  const link = (to: string, label: string, icon: JSX.Element) => (
    <Link to={to} className={`btn btn-ghost ${pathname===to ? 'ring-2 ring-brand-400' : ''}`}>{icon}{label}</Link>
  )
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-4xl px-4">
        <nav className="mt-3 bg-white/70 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 rounded-2xl shadow-elev">
          <div className="h-16 px-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
              <Bot className="w-5 h-5 text-brand-600" /> KeepAlive
            </Link>
            <div className="flex items-center gap-2">
              {link('/chat', 'Chat', <MessageSquare className="w-4 h-4" />)}
              {link('/settings', '설정', <IconSettings className="w-4 h-4" />)}
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
