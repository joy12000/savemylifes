// netlify/functions/messages.js
const { getStore } = require('@netlify/blobs')

exports.handler = async (event, context) => {
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || ''
  // 읽기는 공개로 두되 필요하면 여기서 검증 추가 가능
  const room = (event.queryStringParameters && event.queryStringParameters.room) || 'default'
  const store = getStore('messages')
  const { blobs } = await store.list({ prefix: `rooms/${room}/messages/`, limit: 1000 })
  const items = []
  for (const b of blobs.sort((a,b)=> (a.uploadedAt > b.uploadedAt ? 1 : -1))) {
    const data = await store.get(b.key, { type: 'json' })
    if (data) items.push(data)
  }
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ items }),
  }
}
