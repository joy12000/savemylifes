import { Auth0Client } from '@auth0/auth0-react'

async function token() {
  // 토큰이 없어도 우선 동작: 서버에서 토큰 없으면 dev 허용/차단 판단
  const raw = localStorage.getItem('auth0spajs')
  // 실제 앱에서는 useAuth0 훅으로 얻는 게 정석이지만, 간이 버전으로 비워둠.
  return undefined
}

export async function saveMessage({ room, text }: { room: string; text: string }) {
  const res = await fetch('/.netlify/functions/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await token() ? { Authorization: 'Bearer ' + await token() } : {}),
    },
    body: JSON.stringify({ room, text }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function listMessages(room: string) {
  const res = await fetch('/.netlify/functions/messages?room=' + encodeURIComponent(room))
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return data.items || []
}

export function subscribe(room: string, onMessage: (m: any)=>void) {
  const es = new EventSource('/.netlify/functions/events?room=' + encodeURIComponent(room))
  es.onmessage = (ev) => {
    try { onMessage(JSON.parse(ev.data)) } catch {}
  }
  return () => es.close()
}
