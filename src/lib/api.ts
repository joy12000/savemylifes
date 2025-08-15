import { getToken } from './authBridge'

export async function saveMessage({ room, text, meta }: { room: string; text: string; meta?: any }) {
  const token = await getToken()
  const res = await fetch('/.netlify/functions/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ room, text, meta }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function listMessages(room: string) {
  const token = await getToken()
  const res = await fetch('/.netlify/functions/messages?room=' + encodeURIComponent(room), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
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


export async function doCheckIn() {
  const token = await getToken()
  const res = await fetch('/.netlify/functions/checkin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<{ ok: boolean; already?: boolean; ts?: number }>
}
