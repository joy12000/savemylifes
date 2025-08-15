// netlify/functions/events.js
const { getStore } = require('@netlify/blobs')

exports.handler = async (event, context) => {
  const room = (event.queryStringParameters && event.queryStringParameters.room) || 'default'

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
    body: await new Promise(async (resolve) => {
      const store = getStore('messages')
      let since = 0
      let buffer = ''
      let timer = null

      async function tick() {
        const { blobs } = await store.list({ prefix: `rooms/${room}/messages/`, limit: 20 })
        const news = blobs
          .filter(b => b.uploadedAt > since)
          .sort((a,b)=> (a.uploadedAt > b.uploadedAt ? 1 : -1))
        for (const b of news) {
          const data = await store.get(b.key, { type: 'json' })
          if (data) buffer += `data: ${JSON.stringify(data)}\n\n`
          since = Math.max(since, b.uploadedAt)
        }
        timer = setTimeout(tick, 2000)
      }
      await tick()

      // 2분 후 자동 종료(클라이언트가 다시 접속)
      setTimeout(() => {
        clearTimeout(timer)
        resolve(buffer)
      }, 120000)
    }),
    isBase64Encoded: false,
  }
}
