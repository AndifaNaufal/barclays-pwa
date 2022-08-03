importScripts('workbox/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/service-worker.js', revision: '1' },
    { url: '/push.js', revision: '1' },
    { url: '/Team.html', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/icon.png', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1'},
    { url: '/js/api.js',revision: '1'},
    { url: '/js/db.js',revision:'1'},
    { url: '/js/idb.js',revision:'1'},
    { url: '/js/materialize.min.js',revision:'1'},
    { url: '/js/nav.js',revision:'1'},
    { url: '/js/sw-register.js',revision:'1'},
    { url: '/js/jquery-3.5.1.min.js',revision:'1'},
], {
ignoreURLParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  new RegExp('.(png|svg|jpg|jpeg)$'),
  workbox.strategies.cacheFirst({
    cacheName: 'cache-images',
    plugin: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
        maxEntries: 60,
        purgeOnQuotaError: true
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 60, // 60 hari untuk pages
        maxEntries: 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('https://fonts.googleapis.com/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'icon'
  })
);


// Menyimpan cache dari Api Football
workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org\/v2/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'barclays-pwa-v1',
  })
);





self.addEventListener('push', (event)=> {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/background.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
