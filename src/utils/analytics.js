/**
 * Analytics utility for tracking Google Analytics 4 events.
 * Wraps window.gtag to ensure it exists before calling.
 */
export function trackEvent(name, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  } else {
    console.warn(`Analytics: [${name}] could not be tracked because gtag is missing.`);
  }
}
