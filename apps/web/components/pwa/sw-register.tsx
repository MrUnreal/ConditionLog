'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Register service worker after page load for best performance
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] Registered, scope:', reg.scope);

          // Check for updates periodically (every 60 minutes)
          setInterval(
            () => {
              reg.update();
            },
            60 * 60 * 1000,
          );
        })
        .catch((err) => {
          console.warn('[SW] Registration failed:', err);
        });
    });
  }, []);

  return null;
}
