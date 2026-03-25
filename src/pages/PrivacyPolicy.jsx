import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  const updated = 'March 24, 2026';

  return (
    <div className="page-transition page-bg--privacy">
      <main className="min-h-screen text-white">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          
          <div className="flex flex-col md:flex-row gap-10 md:gap-16">
            
            {/* ── Sidebar Navigation (Mobile: Horizontal Scroll) ───────────────── */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="md:sticky md:top-24">
                <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-2 md:mb-4 tracking-tight">
                  Privacy <span className="text-gradient">Policy</span>
                </h1>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-40 mb-6 md:mb-8">
                  Last updated: {updated}
                </p>
                
                <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 no-scrollbar">
                  {['Overview', 'Non-Collection', 'Data Collection', 'AI Processing', 'Third-Parties', 'Rights'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} 
                       className="text-[10px] md:text-xs font-semibold py-2 px-4 md:px-0 whitespace-nowrap md:whitespace-normal rounded-full md:rounded-none bg-white/5 md:bg-transparent border border-white/10 md:border-0 opacity-60 md:opacity-50 hover:opacity-100 hover:text-primary transition-all no-underline">
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── Main Content ──────────────────────────────────── */}
            <div className="flex-1 space-y-16 md:space-y-24 pb-20">
              
              <section id="overview" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs md:text-sm text-primary">01</span>
                  Overview
                </h2>
                <div className="text-sm md:text-base leading-relaxed space-y-4" style={{ color: 'var(--color-subtext)' }}>
                  <p>
                    Earth Ranker ("we", "our", "the service") is built on a foundation of data minimization. 
                    This policy outlines our transparent approach to user privacy.
                  </p>
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs md:text-sm">
                    <strong className="text-white font-medium">Core Principle:</strong> We collect as little data as technologically possible 
                    to provide the rarity ranking experience.
                  </div>
                </div>
              </section>

              <section id="non-collection" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-teal/10 flex items-center justify-center text-xs md:text-sm text-teal">02</span>
                  Data Protection
                </h2>
                <div className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  <p className="mb-6">The following data points never leave your device:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {[
                      'Specific quiz responses',
                      'Personal identification',
                      'Precise geolocation',
                      'Browser fingerprints',
                      'Social graphs',
                      'Advertising IDs'
                    ].map(item => (
                      <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] md:text-xs font-medium text-white/80">
                        <span className="text-teal text-lg">✕</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="data-collection" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs md:text-sm text-purple-500">03</span>
                  Information Handling
                </h2>
                <div className="space-y-6 md:space-y-8 text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  <div>
                    <h3 className="text-white font-bold mb-2">Leaderboard Participation</h3>
                    <p>
                      If you voluntarily opt-in to the Global Leaderboard, we store your chosen display name, 
                      final rarity score, tier, country, and a timestamp in our secure Firebase database.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Anonymous Analytics</h3>
                    <p>
                      We utilize Google Analytics 4 to understand aggregate usage patterns. No personal 
                      identifiers are linked to these sessions.
                    </p>
                  </div>
                </div>
              </section>

              <section id="ai-processing" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-xs md:text-sm text-orange-500">04</span>
                  AI Processing
                </h2>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  When generating your Rarity Story, an anonymized trait profile is transmitted to 
                  <strong className="text-white font-medium"> Groq's API</strong> via an encrypted server-side proxy. 
                  This data is used solely for text generation and is not stored or used for model training.
                </p>
              </section>

              <section id="third-parties" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-xs md:text-sm text-blue-500">05</span>
                  Infrastucture
                </h2>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {['Firebase', 'Vercel', 'Google Analytics', 'Groq AI'].map(tool => (
                    <span key={tool} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-white/70">
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              <section id="rights" className="scroll-mt-24">
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-xs md:text-sm text-red-500">06</span>
                  Inquiries
                </h2>
                <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: 'var(--color-subtext)' }}>
                  You retain full ownership of your data. For leaderboard removal requests or data inquiries, 
                  contact our privacy desk:
                </p>
                <a href="mailto:himanshurajakbussines@gmail.com" className="inline-block px-6 py-3 md:px-8 md:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm md:text-base font-bold hover:bg-white/10 transition-all no-underline">
                  himanshurajakbussines@gmail.com
                </a>
              </section>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
