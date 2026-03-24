import Footer from '../components/Footer';

export default function Terms() {
  const updated = 'March 24, 2026';

  return (
    <>
      <main className="min-h-screen bg-[#0a0a1a] text-white">
        <div className="max-w-5xl mx-auto px-6 py-20">
          
          <div className="flex flex-col md:flex-row gap-16">
            
            {/* ── Sidebar Navigation ─────────────────────────────── */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h1 className="font-heading text-4xl font-extrabold mb-4 tracking-tight">
                  Terms & <span className="text-gradient">Conditions</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-8">
                  Last updated: {updated}
                </p>
                
                <nav className="flex flex-col gap-2">
                  {['Acceptance', 'Service Nature', 'Data Accuracy', 'Leaderboard', 'Intellectual Property', 'Liability'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} 
                       className="text-xs font-semibold py-2 opacity-50 hover:opacity-100 hover:text-primary transition-all no-underline">
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── Main Content ──────────────────────────────────── */}
            <div className="flex-1 space-y-20 pb-20">
              
              <section id="acceptance" className="scroll-mt-24">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm text-primary">01</span>
                  Acceptance of Terms
                </h2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  By accessing or using Earth Ranker ("the service"), you agree to be bound by these Terms and Conditions. 
                  These terms govern your use of the website and all related services provided by us.
                </p>
              </section>

              <section id="service-nature" className="scroll-mt-24">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-sm text-teal">02</span>
                  Nature of the Service
                </h2>
                <div className="text-base leading-relaxed space-y-4" style={{ color: 'var(--color-subtext)' }}>
                  <p>
                    Earth Ranker is a <strong className="text-white font-medium">free, educational entertainment tool</strong>. 
                  </p>
                  <p>
                    All rarity scores and "1 in X billion" figures are approximate statistical estimates based on 
                    publicly available demographic data. They are intended for curiosity and entertainment — 
                    not for scientific diagnosis, medical advice, or definitive profiling.
                  </p>
                </div>
              </section>

              <section id="data-accuracy" className="scroll-mt-24">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-sm text-purple-500">03</span>
                  Accuracy of Data
                </h2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  While we strive for accuracy, the statistical models used in the scoring engine are simplified 
                  representations of complex global demographics. Actual distributions may vary significantly 
                  across regions and timeframes. We provide the service "as is" without guarantees of accuracy.
                </p>
              </section>

              <section id="leaderboard" className="scroll-mt-24">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-sm text-orange-500">04</span>
                  Leaderboard Conduct
                </h2>
                <div className="text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  <p className="mb-4">Users participating in the Global Leaderboard must adhere to the following:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Display names must be free of offensive or impersonating content.</li>
                    <li>Automated submission ("botting") is strictly prohibited.</li>
                    <li>We reserve the right to remove any entry that violates these standards.</li>
                  </ul>
                </div>
              </section>

              <section id="intellectual-property" className="scroll-mt-24">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm text-blue-500">05</span>
                  Intellectual Property
                </h2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  All design, source code, copy, and brand assets of Earth Ranker are the intellectual property 
                  of <a href="https://www.himanshurajak.in" target="_blank" rel="noopener noreferrer" className="text-primary font-medium">Himanshu Rajak</a>. 
                  Unauthorized reproduction, redistribution, or commercial use of these assets is prohibited.
                </p>
              </section>

              <section id="liability" className="scroll-mt-24">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-sm text-red-500">06</span>
                  Limitation of Liability
                </h2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                  In no event shall Earth Ranker or its developers be liable for any direct, indirect, 
                  or consequential damages arising from the use or inability to use the service. 
                  Users assume all responsibility for their interactions with the platform.
                </p>
              </section>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
