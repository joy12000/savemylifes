// noop service worker for PWA install prompt
self.addEventListener('install', ()=>self.skipWaiting())
self.addEventListener('activate', ()=>self.clients.claim())
