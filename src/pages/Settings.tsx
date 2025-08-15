import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Settings() {
  const nav = useNavigate()
  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="mt-6 space-y-4">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">설정</h2>
          <button className="btn btn-ghost" onClick={()=>nav(-1)}>← 뒤로가기</button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between bg-white/70 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 px-3 py-2 rounded-xl">
            <span>다크모드</span>
            <span className="badge">헤더 우측 토글</span>
          </label>
          <label className="flex items-center justify-between bg-white/70 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 px-3 py-2 rounded-xl">
            <span>알림</span><span className="badge">추가 예정</span>
          </label>
        </div>
      </div>
    </motion.div>
  )
}
