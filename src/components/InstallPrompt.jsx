import { useEffect, useState } from 'react';
import './InstallPrompt.css';

/**
 * InstallPrompt — shows a subtle "Add to Home Screen" banner after
 * 30 seconds on mobile devices that haven't already installed the PWA.
 *
 * Uses the native beforeinstallprompt event where available (Android/Chrome).
 * On iOS it shows a manual instructions banner instead.
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show,           setShow]           = useState(false);
  const [isIOS,          setIsIOS]          = useState(false);
  const [dismissed,      setDismissed]      = useState(false);

  useEffect(() => {
    // Don't show if already dismissed in this session or ever installed
    if (sessionStorage.getItem('pwa-prompt-dismissed')) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return; // already installed

    // Only on mobile viewport
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    // Detect iOS (no beforeinstallprompt support)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if (!ios) {
      // Android/Chrome — capture the browser prompt
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handler);
      // cleanup
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  // Show the banner after 30 seconds
  useEffect(() => {
    if (sessionStorage.getItem('pwa-prompt-dismissed')) return;
    if (dismissed) return;

    const timer = setTimeout(() => {
      // Only show if we have a native prompt ready, OR it's iOS
      if (deferredPrompt || isIOS) setShow(true);
    }, 30_000);

    return () => clearTimeout(timer);
  }, [deferredPrompt, isIOS, dismissed]);

  function dismiss() {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', '1');
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      sessionStorage.setItem('pwa-prompt-dismissed', '1');
    }
    setDeferredPrompt(null);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className={`install-prompt install-prompt--in`} role="banner" aria-live="polite">
      <div className="install-prompt__icon" aria-hidden>📲</div>
      <div className="install-prompt__text">
        <strong>Install Unique.com</strong>
        {isIOS
          ? <span>Tap <b>Share</b> → <b>Add to Home Screen</b> for the full app experience.</span>
          : <span>Add to your home screen for instant access — works offline too!</span>
        }
      </div>
      <div className="install-prompt__actions">
        {!isIOS && (
          <button className="install-prompt__btn install-prompt__btn--install" onClick={install}>
            Install
          </button>
        )}
        <button className="install-prompt__btn install-prompt__btn--dismiss" onClick={dismiss}
                aria-label="Dismiss install prompt">
          ✕
        </button>
      </div>
    </div>
  );
}
