'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration.scope);
            
            // Force update on page load in development
            if (process.env.NODE_ENV === 'development') {
              registration.update();
            }
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker is ready, reload to use it
                    console.log('New service worker available, reloading...');
                    window.location.reload();
                  }
                });
              }
            });
            
            // Check for updates periodically (every 30 seconds in dev, 5 minutes in prod)
            const updateInterval = process.env.NODE_ENV === 'development' ? 30000 : 300000;
            setInterval(() => {
              registration.update();
            }, updateInterval);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });

      // Listen for controller change and reload
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed, reloading page...');
        window.location.reload();
      });
    }
  }, []);

  return null;
}
