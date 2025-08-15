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
      let cursor = ''
      let timer
      const encoder = new TextEncoder()
      let buffer = ''

      async function tick() {
        const { blobs, cursor: next } = await store.list({ prefix: `rooms/${room}/messages/`, cursor, limit: 50 })
        cursor = next || cursor
        // 최근 10개만 발행
        for (const b of blobs.slice(-10)) {
          const data = await store.get(b.key, { type: 'json' })
          if (data) {
            buffer += `data: ${JSON.stringify(data)}\n\n`
          }
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
