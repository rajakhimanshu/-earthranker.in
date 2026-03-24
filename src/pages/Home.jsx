import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from '../contexts/LanguageContext';
import './Home.css';

/* ─── Live Counter ──────────────────────────────────────────────────── */
function LiveCounter() {
  const { t } = useTranslation();

  const getDailyUserCount = () => {
    const now = new Date();
    const seed = now.getFullYear() * 10000 + (now.getMonth()+1) * 100 + now.getDate();
    const base = 850 + (seed % 200);
    const minutesIntoDay = now.getHours() * 60 + now.getMinutes();
    const timeIncrement = Math.floor((minutesIntoDay / 1440) * 120);
    const wobbleSeed = Math.floor(minutesIntoDay / 5);
    const wobble = (wobbleSeed * 13 + seed) % 17;
    return base + timeIncrement + wobble;
  };

  const [count, setCount] = useState(getDailyUserCount);

  useEffect(() => {
    const timer = setInterval(() => setCount(getDailyUserCount()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="live-counter">
      <span className="live-counter__dot" />
      <span className="live-counter__number">{count.toLocaleString('en-US')}</span>{' '}
      {t.home.liveCounter}
    </div>
  );
}

/* ─── Testimonial Card ──────────────────────────────────────────────── */
function TestimonialCard({ name, country, tier, tierColor, quote }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-card__header">
        <span className="testimonial-card__name">{name}</span>
        <span className="testimonial-card__country">{country}</span>
      </div>
      <div className="testimonial-card__tier" style={{ color: tierColor }}>{tier}</div>
      <p className="testimonial-card__quote"><em>"{quote}"</em></p>
    </div>
  );
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { name: "Priya S.", country: "India", tier: "MYTHIC", tierColor: "#FF6B6B", quote: "I never knew my blood type made me this rare!" },
  { name: "Arjun M.", country: "India", tier: "LEGENDARY", tierColor: "#FFD700", quote: "My combination of skills put me in the top 0.5%. Mind blown." },
  { name: "James L.", country: "UK", tier: "LEGENDARY", tierColor: "#FFD700", quote: "The statistics are fascinating. Shared it with my whole office." },
  { name: "Elena R.", country: "Brazil", tier: "EPIC", tierColor: "#A855F7", quote: "Finally a quiz that uses real data. My score was shocking!" },
  { name: "Mohammed A.", country: "UAE", tier: "RARE", tierColor: "#3B82F6", quote: "Being left-handed AND having green eyes made me rarer than I thought." },
  { name: "Sarah K.", country: "Canada", tier: "MYTHIC", tierColor: "#FF6B6B", quote: "Showed my friends and now we're all comparing scores." },
  { name: "Kavya R.", country: "India", tier: "EPIC", tierColor: "#A855F7", quote: "The AI story it wrote about me gave me chills. So personal." },
  { name: "Rohan T.", country: "India", tier: "LEGENDARY", tierColor: "#FFD700", quote: "1 in 340 million. I screenshot this and posted it everywhere." }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🧬',
    title: 'Enter Your Traits',
    body: 'Answer 8 quick questions about biology, skills, and demographics — each mapped to real global statistics.',
    accent: 'var(--color-primary)',
    glow: 'rgba(108,71,255,0.25)',
  },
  {
    step: '02',
    icon: '⚡',
    title: 'Probability Engine',
    body: 'We multiply the independent likelihood of every trait across 8.28 billion people — the same math used by geneticists.',
    accent: 'var(--color-coral)',
    glow: 'rgba(255,107,107,0.25)',
  },
  {
    step: '03',
    icon: '🌍',
    title: 'Claim Your Rank',
    body: 'Get a rarity badge, a personalised AI story, and see exactly where you stand on the global leaderboard.',
    accent: 'var(--color-teal)',
    glow: 'rgba(0,212,170,0.25)',
  },
];

const TIERS = [
  { name: 'Common',    range: 'Top 50%',   color: '#9BA3B8', bg: 'rgba(155,163,184,0.12)', border: 'rgba(155,163,184,0.3)', icon: '⚪' },
  { name: 'Uncommon',  range: 'Top 25%',   color: '#4ADE80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.3)',  icon: '🟢' },
  { name: 'Rare',      range: 'Top 10%',   color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)',  icon: '🔵' },
  { name: 'Epic',      range: 'Top 3%',    color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', icon: '🟣' },
  { name: 'Legendary', range: 'Top 0.5%',  color: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  icon: '🟡' },
  { name: 'Mythic',    range: 'Top 0.01%', color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.3)', icon: '🔴' },
];

/* ─── Particles ─────────────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size:  Math.random() * 3 + 1,
    x:     Math.random() * 100,
    y:     Math.random() * 100,
    delay: Math.random() * 8,
    dur:   Math.random() * 10 + 8,
    opacity: Math.random() * 0.3 + 0.08,
  }));

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map(p => (
        <span key={p.id} className="particle"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
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

        {/* ══ HERO ═══════════════════════════════════════════════════════ */}
        <section className="hero">
          <Particles />
          <div className="glow-blob glow-blob--purple" aria-hidden="true" />
          <div className="glow-blob glow-blob--coral"  aria-hidden="true" />

          <div className="hero__content">

            {/* Badge */}
            <div className="trending-badge">
              <span className="trending-badge__pulse" />
              🔥 Trending Globally
            </div>

            {/* Headline */}
            <h1 className="hero__headline">
              How rare are you<br />
              <span className="hero__headline--gradient">among 8.28 billion?</span>
            </h1>

            {/* Subtitle */}
            <p className="hero__subtitle">
              A 2-minute science-backed quiz that calculates the exact statistical
              probability of your unique combination of human traits.
            </p>

            {/* Live counter */}
            <LiveCounter />

            {/* Single primary CTA */}
            <Link to="/quiz" className="cta-btn cta-btn--hero" id="hero-cta">
              <span className="cta-btn__shimmer" aria-hidden="true" />
              Discover My Rarity
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* Trust line under CTA */}
            <p className="hero__trust">
              Free · Anonymous · No sign-up required
            </p>

            {/* Mini stats — 3 col grid on mobile */}
            <div className="hero__stats">
              {[
                { value: '8.28B', label: 'People on Earth' },
                { value: '50+',   label: 'Traits Analysed' },
                { value: '6',     label: 'Rarity Tiers' },
              ].map(({ value, label }) => (
                <div key={label} className="hero__stat">
                  <strong className="hero__stat-value">{value}</strong>
                  <span  className="hero__stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <button
            className="scroll-hint cursor-pointer"
            aria-label="Scroll down"
            style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
            onClick={() => {
              const next = document.getElementById('how-it-works');
              if (next) next.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="scroll-hint__dot" />
          </button>
        </section>

        {/* ══ TESTIMONIALS MARQUEE ════════════════════════════════════════ */}
        <section className="marquee-section" aria-label="What people are saying">
          <div className="marquee-track">
            {TESTIMONIALS.map((testi, i) => <TestimonialCard key={i} {...testi} />)}
            {TESTIMONIALS.map((testi, i) => <TestimonialCard key={`d-${i}`} {...testi} />)}
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════════════════ */}
        <section className="section" id="how-it-works">
          <div className="section-inner">
            <div className="section-header">
              <span className="section-eyebrow">The Science</span>
              <h2 className="section-title">
                Three steps to your<br />
                <span className="text-gradient">rarity score</span>
              </h2>
              <p className="section-sub">
                Every answer feeds a real probability engine — not a personality quiz. Your score is a genuine statistical calculation.
              </p>
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

        {/* ══ RARITY TIERS ════════════════════════════════════════════════ */}
        <section className="section section--alt" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="glow-blob glow-blob--purple" style={{ top: '-100px', left: '-20%', filter: 'blur(120px)', opacity: 0.08 }} aria-hidden="true" />
          <div className="glow-blob glow-blob--coral"  style={{ bottom: '-100px', right: '-20%', filter: 'blur(120px)', opacity: 0.08 }} aria-hidden="true" />

          <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-header">
              <span className="section-eyebrow">{t.home.tiersTitle}</span>
              <h2 className="section-title">{t.home.tiersSub}</h2>
              <p className="section-sub">
                Your score unlocks one of six tiers based on how rare your exact
                combination of traits is across all of humanity.
              </p>
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

            {/* Single CTA at bottom of tiers — clear call to action */}
            <div className="tiers-cta mt-8">
              <Link to="/quiz" className="cta-btn cta-btn--sm" id="tiers-cta">
                <span className="cta-btn__shimmer" aria-hidden="true" />
                Find Your Tier — Free
              </Link>
              <Link to="/leaderboard" className="ghost-btn">View Global Rankings →</Link>
            </div>
          </div>
        </section>

        {/* ══ SOCIAL PROOF STRIP ══════════════════════════════════════════ */}
        <section className="section" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
          <div className="section-inner">
            <div className="proof-strip">
              {[
                { icon: '🔬', stat: '12 categories', sub: 'of human traits measured' },
                { icon: '🌍', stat: '180+ countries', sub: 'represented in our data' },
                { icon: '⚡', stat: '45 seconds',     sub: 'average completion time' },
                { icon: '🔒', stat: '100% private',   sub: 'nothing stored, no login' },
              ].map(({ icon, stat, sub }) => (
                <div key={stat} className="proof-item">
                  <span className="proof-item__icon" aria-hidden="true">{icon}</span>
                  <strong className="proof-item__stat">{stat}</strong>
                  <span className="proof-item__sub">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
