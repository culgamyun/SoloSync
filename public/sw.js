self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(payload.title || 'SoloSync', {
      body: payload.body || 'A new social health update is ready.',
      icon: '/icons/solo-icon.svg',
      badge: '/icons/solo-icon.svg',
      data: payload.data || { url: '/ko/home' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/ko/home';
  event.waitUntil(self.clients.openWindow(url));
});
