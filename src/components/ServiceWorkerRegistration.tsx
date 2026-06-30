'use client';

import { useEffect, useRef, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [updateReady, setUpdateReady] = useState(false);
  const waitingWorker = useRef<ServiceWorker | null>(null);
  const refreshing = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Reload exactly once, only after the user opts in (guards against reload loops)
    const onControllerChange = () => {
      if (refreshing.current) return;
      refreshing.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    const promote = (worker: ServiceWorker | null) => {
      if (worker) {
        waitingWorker.current = worker;
        setUpdateReady(true);
      }
    };

    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          if (process.env.NODE_ENV === 'development') registration.update();

          // A worker may already be waiting from a previous visit
          if (registration.waiting && navigator.serviceWorker.controller) {
            promote(registration.waiting);
          }

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              // Only prompt when there's an existing controller (i.e. a real update,
              // not the first install)
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                promote(registration.waiting || newWorker);
              }
            });
          });

          // Periodic update check (less aggressive in production)
          const updateInterval = process.env.NODE_ENV === 'development' ? 30000 : 600000;
          timerRef.current = setInterval(() => registration.update(), updateInterval);
        })
        .catch((error) => {
          console.warn('SW registration failed:', error);
        });
    };

    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const applyUpdate = () => {
    // Tell the waiting SW to activate; controllerchange then reloads once
    if (waitingWorker.current) {
      waitingWorker.current.postMessage('SKIP_WAITING');
    } else {
      window.location.reload();
    }
    setUpdateReady(false);
  };

  if (!updateReady) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 flex items-center gap-3 rounded-full border border-sky-200 bg-white px-4 py-2.5 shadow-xl"
    >
      <span className="text-sm font-medium text-slate-700">A new version is available.</span>
      <button
        onClick={applyUpdate}
        className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-3 py-1 text-sm font-semibold text-white hover:shadow-md"
      >
        Refresh
      </button>
      <button
        onClick={() => setUpdateReady(false)}
        aria-label="Dismiss update notice"
        className="text-slate-400 hover:text-slate-600"
      >
        ✕
      </button>
    </div>
  );
}
