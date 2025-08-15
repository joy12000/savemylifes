
import fs from 'node:fs'
import path from 'node:path'

const dist = 'dist'
fs.mkdirSync(dist, { recursive: true })

// SPA 200 fallback
fs.writeFileSync(path.join(dist, '200.html'), '<!doctype html><title>SPA</title><meta http-equiv="refresh" content="0; url=/" />')

// health.txt
fs.writeFileSync(path.join(dist, 'health.txt'), String(Date.now()))

// _redirects for SPA + SSE route pass-through
fs.writeFileSync(path.join(dist, '_redirects'), [
  '/sse/* /.netlify/edge-functions/chat-sse 200',
  '/* /index.html 200'
].join('\n'))
