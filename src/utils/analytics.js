/**
 * Analytics utility for tracking Google Analytics 4 events.
 * Wraps window.gtag to ensure it exists before calling.
 */
export function trackEvent(name, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
  // Silent no-op when gtag is not loaded (dev, adblockers, etc.)
}
