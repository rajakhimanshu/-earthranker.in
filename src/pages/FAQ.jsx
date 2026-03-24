import { useState } from 'react';
import Footer from '../components/Footer';

const FAQS = [
  {
    id: 'calculation',
    q: 'How is my rarity score calculated?',
    a: 'We use independent probability multiplication — the same math used in genetics research. Each trait you select has a known global frequency (e.g., AB− blood type: 0.6%). We multiply all trait probabilities together, then apply logarithmic scaling to produce a 0–100 score.'
  },
  {
    id: 'data-sources',
    q: 'Where does the statistical data come from?',
    a: 'Our trait database is compiled from globally recognised sources including the World Health Organisation (WHO), national census surveys, peer-reviewed genetics and anthropology journals, and sociological studies on demographics.'
  },
  {
    id: 'privacy',
    q: 'Is my data stored or shared?',
    a: 'Absolutely not. Earth Ranker is entirely stateless for quiz data. All calculations happen in your browser. Only your leaderboard entry (if you choose to submit it) is stored on our secure Firebase servers.'
  },
  {
    id: 'variation',
    q: 'Why does my score change if I retake the quiz?',
    a: 'Your score is deterministic. If your score changed, it means you selected different options. Try to answer as accurately as possible for the most meaningful result.'
  },
  {
    id: 'tiers',
    q: 'What are the rarity tiers?',
    a: 'There are 7 tiers: Common, Uncommon, Rare, Epic, Legendary, Ancient, and Mythic. Each tier represents a specific percentile of the global population based on your unique combination of traits.'
  },
  {
    id: 'ai-story',
    q: 'How does the AI story feature work?',
    a: 'Earth Ranker sends your anonymised trait categories to our AI model (Groq Llama 3.1) via a secure Vercel API proxy. The model generates a unique narrative about your rarity without ever seeing your personal identity.'
  },
  {
    id: 'pwa',
    q: 'Is Earth Ranker a PWA?',
    a: 'Yes! Earth Ranker is a Progressive Web App. You can install it on mobile (Add to Home Screen) or desktop (Install icon in address bar) to access it like a native application.'
  }
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  const accentColors = ['var(--color-primary)', 'var(--color-coral)', 'var(--color-teal)'];
  const accent = accentColors[index % 3];

  return (
    <div className="border-b border-white/5 last:border-0 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-6 flex items-start justify-between gap-6 transition-all group"
        aria-expanded={open}>
        <span className="font-heading font-bold text-lg sm:text-xl text-white/90 group-hover:text-white transition-colors leading-tight">{q}</span>
        <span className="flex-shrink-0 mt-1.5 text-xl font-light transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'none', color: accent }}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 pb-8' : 'max-h-0'}`}>
        <p className="text-base leading-relaxed opacity-60" style={{ color: 'var(--color-subtext)' }}>{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0a1a] text-white">
        <div className="max-w-5xl mx-auto px-6 py-20">
          
          <div className="flex flex-col md:flex-row gap-16">
            
            {/* ── Sidebar ────────────────────────────────────────── */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
                  style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--color-teal)', border: '1px solid rgba(0,212,170,0.2)' }}>
                  Assistance
                </span>
                <h1 className="font-heading text-4xl font-extrabold mb-4 tracking-tight">
                  Global <span className="text-gradient">FAQ</span>
                </h1>
                <p className="text-sm opacity-50 mb-8 leading-relaxed">
                  Everything you need to know about our statistical model, privacy, and technology.
                </p>
                <div className="hidden md:block h-px w-full bg-white/10 mb-8" />
                <a href="/contact" className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                  Contact Support →
                </a>
              </div>
            </aside>

            {/* ── Content ───────────────────────────────────────── */}
            <div className="flex-1">
              <div className="space-y-2">
                {FAQS.map((item, i) => (
                  <FAQItem key={item.id} index={i} q={item.q} a={item.a} />
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-20 p-10 rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent text-center">
                <h3 className="font-heading text-2xl font-bold mb-4">Still have questions?</h3>
                <p className="text-sm opacity-50 mb-8 max-w-sm mx-auto">
                  Our team is dedicated to providing technical clarity on our rarity engine and data privacy.
                </p>
                <a href="/contact" className="inline-block px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/80 transition-all shadow-lg shadow-primary/20">
                  Connect with Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
