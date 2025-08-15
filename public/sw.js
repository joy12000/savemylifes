// minimal service worker for install prompt
self.addEventListener('install', ()=>self.skipWaiting())
self.addEventListener('activate', ()=>self.clients.claim())
