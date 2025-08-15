import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="mt-6 space-y-4">
      <div className="card">
        <h1 className="text-2xl font-semibold">생존신고 · SOS</h1>
        <p className="text-slate-600 mt-2">로그인 → 메시지 전송 → 실시간 수신(SSE)</p>
        <div className="mt-4 flex gap-2">
          <Link to="/capture" className="btn btn-primary">캡처·붙여넣기</Link>
          <Link to="/chat" className="btn btn-ghost">채팅</Link>
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold">Tip</h2>
        <ul className="list-disc pl-6 mt-2 text-slate-600">
          <li>상단 여백 문제 해결됨(고정 헤더 + 본문 패딩)</li>
          <li>붙여넣기 버튼은 하나로 정리, 동작 이관 완료</li>
          <li>저장은 Netlify Blobs로 서버에 기록</li>
        </ul>
      </div>
    </div>
  )
}
