'use client';

import { useEffect, useMemo, useState } from 'react';

import { publicEnv } from '@/lib/env';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported('serviceWorker' in navigator && 'PushManager' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function subscribe() {
    if (!supported || !publicEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      return false;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== 'granted') {
        return false;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      return true;
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    const registration = await navigator.serviceWorker.getRegistration('/');
    const subscription = await registration?.pushManager.getSubscription();
    if (!subscription) {
      return;
    }

    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint })
    });

    await subscription.unsubscribe();
  }

  return useMemo(
    () => ({ supported, permission, loading, subscribe, unsubscribe }),
    [supported, permission, loading]
  );
}
