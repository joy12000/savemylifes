export async function saveMessage({ room, text, meta }: { room: string; text: string; meta?: any }) {
  const res = await fetch('/.netlify/functions/message', {
    method: 'POST',
    headers: {  'Content-Type': 'application/json'  },
    body: JSON.stringify({ room, text, meta }),
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
