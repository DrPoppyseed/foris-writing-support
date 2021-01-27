const staticForisEssay = 'foris-essay-site-v1'
const assets = [
  '/index.html',
  '/global.css',
  '/build/bundle.css',
  '/build/bundle.js',
  '/build/bundle.js.map',
  '/imgs/campaign_desktop.png',
  '/imgs/campaign_mobile.png',
  '/imgs/dummy_image.jpeg',
]

self.addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(staticForisEssay).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener('fetch', fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})

self.addEventListener('fetch', evt => {
  console.log('[ServiceWorker] Fetch', evt.request.url)
  if (evt.request.url.includes('localhost')) {
    evt.respondWith(
      caches.open(staticForisEssay).then(cache => {
        return cache.match(evt.request).then(
          cacheResponse =>
            cacheResponse ||
            fetch(evt.request).then(networkResponse => {
              cache.put(evt.request, networkResponse.clone())
              return networkResponse
            })
        )
      })
    )
  } else {
    evt.respondWith(fetch(evt.request))
  }
})
