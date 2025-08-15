import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const nav = useNavigate()
  return (
    <div className="mt-6 space-y-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">설정</h2>
          <button className="btn btn-ghost" onClick={()=>nav(-1)}>← 뒤로가기</button>
        </div>
        <div className="mt-4 text-slate-600">
          여기에 알림 간격, 기본 룸, 테마 등 옵션을 추가할 수 있어요.
        </div>
      </div>
    </div>
  )
}
