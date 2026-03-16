import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from '../contexts/LanguageContext';
import './Home.css';

/* ─── Components ─────────────────────────────────────────────────────── */
function LiveCounter() {
  const { t } = useTranslation();
  const [count, setCount] = useState(() => Math.floor(Math.random() * (1200 - 847 + 1) + 847));

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, Math.floor(Math.random() * (15000 - 8000 + 1) + 8000));
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="live-counter">
      <span className="live-counter__dot" />
      <span className="live-counter__number">{count.toLocaleString('en-US')}</span> {t.home.liveCounter}
    </div>
  );
}

function TestimonialCard({ name, country, tier, tierColor, quote }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-card__header">
        <span className="testimonial-card__name">{name}</span>
        <span className="testimonial-card__country">{country}</span>
      </div>
      <div className="testimonial-card__tier" style={{ color: tierColor }}>
        {tier}
      </div>
      <p className="testimonial-card__quote"><em>"{quote}"</em></p>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { name: "Priya S.", country: "India", tier: "MYTHIC", tierColor: "#FF1744", quote: "I never knew my blood type made me this rare!" },
  { name: "Arjun M.", country: "India", tier: "LEGENDARY", tierColor: "#FFB347", quote: "My combination of skills put me in the top 0.5%. Mind blown." },
  { name: "James L.", country: "UK", tier: "LEGENDARY", tierColor: "#FFB347", quote: "The statistics are fascinating. Shared it with my whole office." },
  { name: "Elena R.", country: "Brazil", tier: "EPIC", tierColor: "#9C27B0", quote: "Finally a quiz that uses real data. My score was shocking!" },
  { name: "Mohammed A.", country: "UAE", tier: "RARE", tierColor: "#2196F3", quote: "Being left-handed AND having green eyes made me rarer than I thought." },
  { name: "Sarah K.", country: "Canada", tier: "MYTHIC", tierColor: "#FF1744", quote: "Showed my friends and now we are all comparing scores." },
  { name: "Kavya R.", country: "India", tier: "EPIC", tierColor: "#9C27B0", quote: "The AI story it wrote about me gave me chills. So personal." },
  { name: "Rohan T.", country: "India", tier: "LEGENDARY", tierColor: "#FFB347", quote: "1 in 340 million. I screenshot this and posted it everywhere." }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🧬',
    title: 'Enter Your Traits',
    body: 'Answer quick questions about your biology, habits, and quirks. Each answer is matched against real-world statistical data.',
    accent: 'var(--color-primary)',
    glow: 'rgba(108,71,255,0.25)',
  },
  {
    step: '02',
    icon: '⚡',
    title: 'Calculate Rarity',
    body: 'Our probability engine multiplies the likelihood of each trait combination across all 8.2 billion people on Earth.',
    accent: 'var(--color-coral)',
    glow: 'rgba(255,107,107,0.25)',
  },
  {
    step: '03',
    icon: '🌍',
    title: 'Share Your Score',
    body: 'Get a personalized rarity badge, compare with friends, and see where you rank on the global leaderboard.',
    accent: 'var(--color-teal)',
    glow: 'rgba(0,212,170,0.25)',
  },
];

const TIERS = [
  { name: 'Common',    range: 'Top 50%',    color: '#9BA3B8', bg: 'rgba(155,163,184,0.12)', border: 'rgba(155,163,184,0.3)', icon: '⚪' },
  { name: 'Uncommon',  range: 'Top 25%',    color: '#4ADE80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.3)',  icon: '🟢' },
  { name: 'Rare',      range: 'Top 10%',    color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)',  icon: '🔵' },
  { name: 'Epic',      range: 'Top 3%',     color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', icon: '🟣' },
  { name: 'Legendary', range: 'Top 0.5%',   color: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  icon: '🟡' },
  { name: 'Mythic',    range: 'Top 0.01%',  color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.3)', icon: '🔴' },
];

/* ─── Particle dots ─────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size:  Math.random() * 3 + 1,
    x:     Math.random() * 100,
    y:     Math.random() * 100,
    delay: Math.random() * 8,
    dur:   Math.random() * 10 + 8,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            width:  p.size,
            height: p.size,
            left:   `${p.x}%`,
            top:    `${p.y}%`,
            opacity: p.opacity,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <main>
      <section className="hero">
        <Particles />

        {/* Radial glow blobs */}
        <div className="glow-blob glow-blob--purple" aria-hidden="true" />
        <div className="glow-blob glow-blob--coral"  aria-hidden="true" />

        <div className="hero__content">
          {/* Trending Badge */}
          <div className="trending-badge">
            <span className="trending-badge__pulse" />
            🔥 Trending
          </div>

          {/* Headline */}
          <h1 className="hero__headline">
            {t.home.heroTitle.split(' 1 in ')[0]}
            <span className="hero__headline--gradient"> 1 in 8.28 Billion</span>
          </h1>

          {/* Live Counter */}
          <LiveCounter />

          {/* Subtitle */}
          <p className="hero__subtitle">
            {t.home.heroSub}
          </p>

          {/* CTA */}
          <Link to="/quiz" className="cta-btn cta-btn--hero">
            <span className="cta-btn__shimmer" aria-hidden="true" />
            {t.home.startBtn.replace(' →', '')}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Supporting micro-stats */}
          <div className="hero__stats">
            {[
              { value: '8.28B', label: 'People on Earth' },
              { value: '50+', label: 'Traits Analyzed' },
              { value: '6',   label: 'Rarity Tiers' },
            ].map(({ value, label }) => (
              <div key={label} className="hero__stat">
                <strong className="hero__stat-value">{value}</strong>
                <span  className="hero__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint" aria-label="Scroll down">
          <div className="scroll-hint__dot" />
        </div>
      </section>

      {/* ── TESTIMONIALS MARQUEE ───────────────────────────────────── */}
      <section className="marquee-section">
        <div className="marquee-track">
          {TESTIMONIALS.map((testi, i) => (
            <TestimonialCard key={i} {...testi} />
          ))}
          {/* Duplicate for seamless loop */}
          {TESTIMONIALS.map((testi, i) => (
            <TestimonialCard key={`dup-${i}`} {...testi} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">Three steps to your<br /><span className="text-gradient">rarity score</span></h2>
          </div>

          <div className="cards-grid">
            {HOW_IT_WORKS.map(({ step, icon, title, body, accent, glow }) => (
              <div key={step} className="feature-card" style={{ '--accent': accent, '--glow': glow }}>
                <div className="feature-card__step">{step}</div>
                <div className="feature-card__icon">{icon}</div>
                <h3 className="feature-card__title">{title}</h3>
                <p  className="feature-card__body">{body}</p>
                <div className="feature-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIER BADGES ─────────────────────────────────────────────── */}
      <section className="section section--alt">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">{t.home.tiersTitle}</span>
            <h2 className="section-title">{t.home.tiersSub}</h2>
            <p className="section-sub">Each tier represents how rare your combination of traits is among all 8.28 billion humans.</p>
          </div>

          <div className="tiers-grid">
            {TIERS.map(({ name, range, color, bg, border, icon }) => (
              <div key={name} className="tier-badge" style={{ '--tier-color': color, '--tier-bg': bg, '--tier-border': border }}>
                <span className="tier-badge__icon">{icon}</span>
                <strong className="tier-badge__name">{t.tiers[name] || name}</strong>
                <span  className="tier-badge__range">{range}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="tiers-cta">
            <Link to="/quiz" className="cta-btn cta-btn--sm">
              <span className="cta-btn__shimmer" aria-hidden="true" />
              Take the Quiz — It's Free
            </Link>
            <Link to="/leaderboard" className="ghost-btn">View Leaderboard →</Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
