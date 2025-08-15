
import React, { useState } from "react"

type Props = { auth0: { getIdTokenClaims: () => Promise<any> } }

export default function Report({ auth0 }: Props){
  const [text, setText] = useState("살아있습니다.")
  const [includeLoc, setIncludeLoc] = useState(true)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function submit(){
    setSending(true)
    setResult(null)
    try{
      let location: {lat:number, lon:number} | undefined = undefined
      if(includeLoc && 'geolocation' in navigator){
        await new Promise<void>((resolve)=>{
          navigator.geolocation.getCurrentPosition((pos)=>{
            location = { lat: pos.coords.latitude, lon: pos.coords.longitude }
            resolve()
          }, ()=>resolve(), { enableHighAccuracy: true, timeout: 5000 })
        })
      }
      const claims = await auth0.getIdTokenClaims()
      const token = claims?.__raw as string | undefined
      const res = await fetch('/.netlify/functions/report-submit', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: text, location })
      })
      if(!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResult(`전송 완료: ${new Date(data.report.ts).toLocaleString()}`)
      setText("살아있습니다.")
    }catch(e:any){
      setResult(`전송 실패: ${e?.message ?? e}`)
    }finally{
      setSending(false)
    }
  }

  return (
    <div style={{maxWidth:560, margin:"0 auto", padding:16}}>
      <h2>생존신고</h2>
      <p style={{opacity:.8}}>버튼을 누르면 신고가 저장되고, 미신고 스케줄러가 24시간 기준으로 체크합니다.</p>
      <label style={{display:"block", marginTop:12}}>메시지
        <input value={text} onChange={e=>setText(e.target.value)} style={{width:"100%", padding:10, marginTop:6}} placeholder="예) 살아있습니다." />
      </label>
      <label style={{display:"flex", gap:8, alignItems:"center", marginTop:10}}>
        <input type="checkbox" checked={includeLoc} onChange={e=>setIncludeLoc(e.target.checked)} />
        위치 포함(가능 시)
      </label>
      <button onClick={submit} disabled={sending} style={{marginTop:14, width:"100%", padding:"14px 16px", fontSize:16, fontWeight:700, borderRadius:12}}>
        {sending ? "전송 중..." : "생존신고 보내기"}
      </button>
      {result && <p style={{marginTop:10}}>{result}</p>}
    </div>
  )
}
