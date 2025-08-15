import { Link } from 'react-router-dom'
import { ClipboardPaste, MessageSquare, Rocket, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="mt-6 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">생존신고 · KeepAlive</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">빠른 기록, 안정 저장, 실시간으로 보기.</p>
          </div>
          <Rocket className="w-10 h-10 text-brand-500" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge">SPA</span>
          <span className="badge">PWA</span>
          <span className="badge">Netlify Functions</span>
          <span className="badge">Blobs 저장</span>
        </div>
        <div className="mt-5 flex gap-3">
          <Link to="/capture" className="btn btn-primary"><ClipboardPaste className="w-4 h-4" /> 캡처·붙여넣기</Link>
          <Link to="/chat" className="btn btn-ghost"><MessageSquare className="w-4 h-4" /> 채팅</Link>
        </div>
      </motion.section>

      <section className="grid sm:grid-cols-2 gap-4">
        <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.05}} className="card p-5">
          <h3 className="font-semibold">디자인</h3>
          <p className="text-slate-600 dark:text-slate-300 mt-1">글라스 카드+그리드 배경, 다크모드, 부드러운 애니메이션.</p>
        </motion.div>
        <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="card p-5">
          <h3 className="font-semibold">안정성</h3>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Expo/Metro 의존 제거, Vite 빌드로 단순·빠름.</p>
        </motion.div>
      </section>
    </div>
  )
}
