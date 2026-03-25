import Footer from '../components/Footer';

const PERSONAL_LINKS = [
  { icon: '🌐', label: 'Portfolio', href: 'https://www.himanshurajak.in/' },
  { icon: '𝕏', label: 'Twitter', href: 'https://x.com/Himansh01625929' },
  { icon: '🐙', label: 'GitHub', href: 'https://github.com/rajakhimanshu' },
  { icon: '📰', label: 'Newsletter', href: 'https://your-growth-trainer.beehiiv.com/' },
];

export default function Terms() {
  const updated = 'March 24, 2026';

  return (
    <div className="page-transition page-bg--terms">
      <main className="min-h-screen text-white">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          
          <div className="flex flex-col md:flex-row gap-10 md:gap-16">
            
            {/* ── Sidebar Navigation (Mobile: Horizontal Scroll) ───────────────── */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="md:sticky md:top-24">
                <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-2 md:mb-4 tracking-tight">
                  Terms & <span className="text-gradient">Conditions</span>
                </h1>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-40 mb-6 md:mb-8">
                  Last updated: {updated}
                </p>
                
                <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 no-scrollbar">
                  {['Acceptance', 'Service Nature', 'Data Accuracy', 'Leaderboard', 'Intellectual Property', 'Liability'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} 
                       className="text-[10px] md:text-xs font-semibold py-2 px-4 md:px-0 whitespace-nowrap md:whitespace-normal rounded-full md:rounded-none bg-white/5 md:bg-transparent border border-white/10 md:border-0 opacity-60 md:opacity-50 hover:opacity-100 hover:text-primary transition-all no-underline">
                      {item}
                    </a>
                  ))}
                </nav>

                <div className="hidden md:block h-px w-full bg-white/10 my-8" />
                
                {/* Creator Quick Links (Hidden on mobile to save space) */}
                <div className="hidden md:block space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Connect with Creator</p>
                  <div className="flex flex-col gap-3">
                    {PERSONAL_LINKS.map(link => (
                      <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" 
                         className="text-[11px] font-bold text-white/60 hover:text-primary transition-colors no-underline flex items-center gap-2">
                        <span>{link.icon}</span> {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Main Content ──────────────────────────────────── */}
            <div className="flex-1 space-y-16 md:space-y-20 pb-20">
              
              <section id="acceptance" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs md:text-sm text-primary">01</span>
                  Acceptance
                </h2>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  By accessing or using Earth Ranker ("the service"), you agree to be bound by these Terms and Conditions. 
                  These terms govern your use of the website and all related services provided by us.
                </p>
              </section>

              <section id="service-nature" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-teal/10 flex items-center justify-center text-xs md:text-sm text-teal">02</span>
                  Scope of Service
                </h2>
                <div className="text-sm md:text-base leading-relaxed space-y-4" style={{ color: 'var(--color-subtext)' }}>
                  <p>
                    Earth Ranker is a <strong className="text-white font-medium">free, educational entertainment tool</strong>. 
                  </p>
                  <p>
                    All rarity scores and "1 in X billion" figures are approximate statistical estimates based on 
                    publicly available demographic data. They are intended for curiosity — not medical or science advice.
                  </p>
                </div>
              </section>

              <section id="data-accuracy" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs md:text-sm text-purple-500">03</span>
                  Accuracy
                </h2>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  The statistical models used are simplified representations of global demographics. 
                  Actual distributions vary. We provide the service "as is" without guarantees of accuracy.
                </p>
              </section>

              <section id="leaderboard" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-xs md:text-sm text-orange-500">04</span>
                  Conduct
                </h2>
                <div className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  <p className="mb-4">Users participating in the Global Leaderboard must adhere to the following:</p>
                  <ul className="list-disc list-inside space-y-2 opacity-80">
                    <li>Display names must be free of offensive content.</li>
                    <li>Automated submission is strictly prohibited.</li>
                    <li>We reserve the right to remove any entry.</li>
                  </ul>
                </div>
              </section>

              <section id="intellectual-property" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-xs md:text-sm text-blue-500">05</span>
                  Ownership
                </h2>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  All design, source code, and assets are the property of <a href="https://www.himanshurajak.in" target="_blank" rel="noopener noreferrer" className="text-primary font-medium">Himanshu Rajak</a>. 
                  Unauthorized commercial use is strictly prohibited.
                </p>
              </section>

              <section id="liability" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-xs md:text-sm text-red-500">06</span>
                  Liability
                </h2>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  Earth Ranker is not liable for any direct or indirect damages arising from the use of the service. 
                  Users assume all responsibility.
                </p>
              </section>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
