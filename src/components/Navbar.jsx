import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './Navbar.css';

/* ── Hamburger / Close SVG icons (no external deps) ─────────────── */
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Close drawer on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* Add shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/',            label: 'Home'        },
    { to: '/quiz',        label: 'Quiz'        },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/compare',     label: 'Compare'     },
    { to: '/about',       label: 'About'       },
  ];

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      {/* ── Main row ────────────────────────────────────────────── */}
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-dot" aria-hidden="true" />
          Earth<span className="navbar__logo-tld"> Ranker</span>
        </Link>

        {/* Desktop links — hidden md:hidden */}
        <div className="navbar__links" role="list">
          {navLinks.slice(0, 4).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              role="listitem"
              className={`navbar__link${isActive(to) ? ' navbar__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link to="/quiz" className="navbar__cta">
            {t.nav.quiz || 'Take Quiz'} ✦
          </Link>
        </div>

        {/* Right side: hamburger */}
        <div className="navbar__right">
          {/* Hamburger — visible on mobile only */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      <div
        id="mobile-nav-drawer"
        className={`navbar__drawer${menuOpen ? ' navbar__drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="navbar__drawer-inner">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar__drawer-link${isActive(to) ? ' navbar__drawer-link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/quiz"
            className="navbar__drawer-cta"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.quiz || 'Take Quiz'} ✦
          </Link>
        </div>
      </div>
    </nav>
  );
}


