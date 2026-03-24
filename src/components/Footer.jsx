import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './Footer.css';

/* ── SVG Social Icons ─────────────────────────────────────────────── */
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="footer-social__icon" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" className="footer-social__icon" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>
  </svg>
);
const IconGithub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="footer-social__icon" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="footer-social__icon" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const IconReddit = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="footer-social__icon" aria-hidden="true">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);
const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" className="footer-social__icon" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 8l10 6 10-6"/>
  </svg>
);

const SOCIAL_LINKS = [
  { href: 'https://x.com/Himansh01625929',                              Icon: IconX,         label: 'Follow on X / Twitter',      color: '#fff'    },
  { href: 'https://www.instagram.com/himanshu.rajak22/',                 Icon: IconInstagram, label: 'Follow on Instagram',        color: '#E1306C' },
  { href: 'https://www.facebook.com/profile.php?id=100031761757065',     Icon: IconFacebook,  label: 'Connect on Facebook',        color: '#1877F2' },
  { href: 'https://github.com/rajakhimanshu',                            Icon: IconGithub,    label: 'View GitHub',                color: '#fff'    },
  { href: 'https://www.reddit.com/user/AgentImaginary1154/',             Icon: IconReddit,    label: 'Follow on Reddit',           color: '#FF4500' },
  { href: 'mailto:himanshurajakbussines@gmail.com',                      Icon: IconEmail,     label: 'Send an email',              color: '#A78BFA' },
];

/* ── Footer ─────────────────────────────────────────────────────── */
export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        {/* ── Brand column ─────────────────────────────────────── */}
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo">
            <span className="site-footer__logo-dot" aria-hidden="true" />
            Earth<span className="site-footer__logo-tld"> Ranker</span>
          </Link>

          <p className="site-footer__tagline">
            Discover exactly how rare<br />you are among 8.28 billion humans.
          </p>

          {/* Developer credit */}
          <div className="footer-devby">
            <span className="footer-devby__label">Developed & Maintained by</span>
            <a href="https://www.himanshurajak.in/" target="_blank" rel="noopener noreferrer"
               className="footer-devby__link">
              Himanshu Rajak ↗
            </a>
          </div>

          {/* Portfolio Link */}
          <a href="https://www.himanshurajak.in/" target="_blank" rel="noopener noreferrer"
             className="footer-newsletter">
            <span className="footer-newsletter__dot" />
            🌐 Visit My Official Website
          </a>

          {/* Social icons */}
          <div className="footer-social">
            {SOCIAL_LINKS.map(({ href, Icon, label, color }) => (
              <a key={href} href={href}
                 target={href.startsWith('mailto:') ? '_self' : '_blank'}
                 rel="noopener noreferrer"
                 className="footer-social__link"
                 aria-label={label}
                 style={{ '--social-color': color }}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* ── Nav columns ──────────────────────────────────────── */}
        <nav className="site-footer__nav" aria-label="Footer navigation">
          <div className="site-footer__col">
            <span className="site-footer__col-heading">Play</span>
            <Link to="/quiz"        className="site-footer__link">Take the Quiz</Link>
            <Link to="/leaderboard" className="site-footer__link">Leaderboard</Link>
            <Link to="/compare"     className="site-footer__link">Compare</Link>
          </div>
          <div className="site-footer__col">
            <span className="site-footer__col-heading">Learn</span>
            <Link to="/about"   className="site-footer__link">About Us</Link>
            <Link to="/faq"     className="site-footer__link">FAQ</Link>
            <Link to="/contact" className="site-footer__link">Contact</Link>
          </div>
          <div className="site-footer__col">
            <span className="site-footer__col-heading">Legal</span>
            <Link to="/privacy" className="site-footer__link">Privacy Policy</Link>
            <Link to="/terms"   className="site-footer__link">Terms &amp; Conditions</Link>
          </div>
        </nav>

      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div className="site-footer__bottom">
        <span className="site-footer__copy">
          © {year} Earth Ranker · Made in 🇮🇳 India
        </span>
        <span className="site-footer__disclaimer">
          Statistics are approximate · For entertainment only
        </span>
      </div>
    </footer>
  );
}
