import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="page-transition page-bg--about">
      <main className="min-h-screen">
        {/* ── Hero Section ────────────────────────────────────────── */}
        <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6"
              style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--color-teal)', border: '1px solid rgba(0,212,170,0.2)' }}>
              The Story Behind The Numbers
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-7xl font-extrabold mb-6 md:mb-8 tracking-tight text-white leading-tight">
              About <span className="text-gradient">Earth Ranker</span>
            </h1>
            <p className="text-base md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--color-subtext)' }}>
              There are 8.28 billion people on Earth. Not one of them is exactly like you. 
              We've turned that statistical miracle into a number.
            </p>
          </div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] rounded-full blur-[80px] md:blur-[120px]" style={{ background: 'var(--color-primary)' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] rounded-full blur-[80px] md:blur-[120px]" style={{ background: 'var(--color-teal)' }} />
          </div>
        </section>

        {/* ── Content Sections ────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-6 pb-20 space-y-20 md:space-y-32">
          
          {/* Mission Section */}
          <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">The Mission</h2>
              <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: 'var(--color-subtext)' }}>
                Earth Ranker was built to celebrate the mathematical miracle that is every human being. 
                Most rarity quizzes are just games—ours is different.
              </p>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                Every single question maps to a real-world statistical distribution sourced from 
                <span className="text-white font-medium"> WHO data</span>, 
                <span className="text-white font-medium"> medical journals</span>, and 
                <span className="text-white font-medium"> global census records</span>. 
                The result isn't just a badge; it's a genuine probability estimate.
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center text-6xl md:text-8xl shadow-2xl">
                🌍
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block" />
            <div className="md:pl-12">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">The Mathematics of You</h2>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4">
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                    We use <strong className="text-white font-medium">independent probability multiplication</strong>—the same mathematical 
                    framework used in genetics and epidemiology.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                    If trait A affects 10% of people and trait B affects 5%, the chance of having both is 0.5% (0.1 × 0.05).
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-5 md:p-6 self-start">
                  <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold mb-3 md:mb-4 opacity-50">Logarithmic Scaling Formula</p>
                  <code className="text-[10px] sm:text-xs md:text-sm font-mono text-primary break-all">
                    score = log₁₀(1 / combinedProb) / log₁₀(8.28e9) × 100
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="text-center max-w-2xl mx-auto py-10 md:py-12 px-6 rounded-2xl md:rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
            <div className="text-3xl md:text-4xl mb-4 md:mb-6">🔒</div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Privacy First</h2>
            <p className="text-sm md:text-base leading-relaxed opacity-80" style={{ color: 'var(--color-subtext)' }}>
              All calculations happen <strong className="text-white font-medium">locally in your browser</strong>. 
              Your answers are never stored on a server unless you explicitly submit to the leaderboard. 
              No accounts, no tracking, no compromise.
            </p>
          </section>

          {/* Creator Section */}
          <section className="pt-12 md:pt-16 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
              <div className="w-20 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/30 p-1 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-4xl md:text-5xl">
                  👨‍💻
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-white mb-2 leading-tight">Developed & Maintained by Himanshu Rajak</h2>
                <p className="text-xs md:text-sm leading-relaxed mb-6 max-w-xl opacity-70" style={{ color: 'var(--color-subtext)' }}>
                  A full-stack engineer dedicated to building statistically-driven experiences. 
                  Earth Ranker is part of a broader mission to bridge the gap between data science and consumer curiosities.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                  <a href="https://www.himanshurajak.in/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-bold bg-primary text-white hover:bg-primary/80 transition-all shadow-lg shadow-primary/20">
                    Portfolio
                  </a>
                  <a href="https://github.com/rajakhimanshu" target="_blank" rel="noopener noreferrer" className="px-4 py-2 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10">
                    GitHub
                  </a>
                  <a href="https://www.instagram.com/himanshu.rajak22/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10">
                    📸 Instagram
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-8 md:pt-12">
            {[
              { to: '/faq', label: 'FAQ', sub: 'Common questions' },
              { to: '/contact', label: 'Contact', sub: 'Get in touch' },
              { to: '/privacy', label: 'Privacy', sub: 'Data handling' },
            ].map(({ to, label, sub }) => (
              <Link key={to} to={to} className="group p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all no-underline">
                <h3 className="text-white font-bold text-base md:text-lg group-hover:text-primary transition-colors">{label}</h3>
                <p className="text-[10px] md:text-xs mt-1 opacity-50 text-white">{sub}</p>
              </Link>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
