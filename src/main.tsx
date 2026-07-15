import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite HMR websocket connection errors which can trigger red unhandled exception overlays
if (typeof window !== 'undefined') {
  // Intercept and redirect all relative /api/ fetch calls to the public cloud URL if VITE_API_BASE_URL is defined
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  if (API_BASE_URL) {
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
      if (typeof input === 'string' && input.startsWith('/api/')) {
        return originalFetch(API_BASE_URL + input, init);
      } else if (input instanceof Request && input.url.startsWith('/api/')) {
        return originalFetch(new Request(API_BASE_URL + input.url, input), init);
      }
      return originalFetch(input, init);
    };
  }

  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || '';
    if (msg.includes('WebSocket') || msg.includes('websocket') || msg.includes('vite')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (msg.includes('WebSocket') || msg.includes('websocket') || msg.includes('vite')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
