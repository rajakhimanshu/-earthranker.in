import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const FACT_ICONS = ['🧬', '🔒', '📊', '🌐'];

export default function About() {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const embedCode = `<iframe src="https://earthranker.himanshurajak.in/quiz?embed=true" width="100%" height="600px" frameborder="0" style="border-radius: 12px; border: 1px solid rgba(108,71,255,0.2);"></iframe>`;

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
    <main className="min-h-screen flex flex-col items-center px-6 py-20">
      <div className="w-full max-w-[1100px]">
        <Link to="/" className="text-sm mb-8 inline-flex items-center gap-1 transition-colors hover:text-white" style={{ color: 'var(--color-subtext)' }}>
          ← {t.about.back}
        </Link>

        {/* Hero */}
        <div className="mb-12 mt-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t.about.title} <span className="text-gradient">Earth Ranker</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
            {t.about.subtitle1}<br />{t.about.subtitle2}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-14">
          {t.about.facts.map(({ title, body }, idx) => (
            <div key={title} className="glass-card p-6">
              <div className="text-3xl mb-3">{FACT_ICONS[idx]}</div>
              <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-subtext)' }}>{body}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
            <span style={{ color: 'var(--color-primary)' }}>{t.about.faqTitle.split(' ')[0]}</span> {t.about.faqTitle.split(' ').slice(1).join(' ')}
          </h2>
          <div className="space-y-4">
            <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: 'var(--color-teal)' }}>
              <h3 className="font-heading font-semibold text-lg mb-2">{t.about.faq1Q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                {t.about.faq1A}
              </p>
            </div>
            
            <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: 'var(--color-coral)' }}>
              <h3 className="font-heading font-semibold text-lg mb-2">{t.about.faq2Q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-subtext)' }}>
                {t.about.faq2A}
              </p>
            </div>
            
            <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: 'var(--color-primary)' }}>
              <h3 className="font-heading font-semibold text-lg mb-2">{t.about.faq3Q}</h3>
              <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--color-subtext)' }} dangerouslySetInnerHTML={{__html: t.about.faq3A}}>
              </p>
            </div>
          </div>
        </div>

        {/* Embed Widget Section */}
        <div className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">🔗</span> {t.about.embedTitle}
          </h2>
          <div className="glass-card p-6 border-t-2" style={{ borderTopColor: 'var(--color-primary)' }}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-subtext)' }}>
              {t.about.embedSub}
            </p>
            
            <div className="relative group">
              <pre className="p-4 rounded-xl bg-[#1E1E1E] border border-white/5 overflow-x-auto text-sm font-mono text-[#D4D4D4] shadow-inner mb-4">
                <code>
                  <span className="text-[#569CD6]">&lt;iframe</span> <span className="text-[#9CDCFE]">src</span>=<span className="text-[#CE9178]">"https://earthranker.himanshurajak.in/quiz?embed=true"</span> <span className="text-[#9CDCFE]">width</span>=<span className="text-[#CE9178]">"100%"</span> <span className="text-[#9CDCFE]">height</span>=<span className="text-[#CE9178]">"600px"</span> <span className="text-[#9CDCFE]">frameborder</span>=<span className="text-[#CE9178]">"0"</span> <span className="text-[#9CDCFE]">style</span>=<span className="text-[#CE9178]">"border-radius: 12px; border: 1px solid rgba(108,71,255,0.2);"</span><span className="text-[#569CD6]">&gt;&lt;/iframe&gt;</span>
                </code>
              </pre>
              
              <button 
                onClick={copyEmbedCode}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 backdrop-blur-sm transition-all border border-white/10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                {copied ? '✅ ' + t.result.share.copied.split(' ')[1] : '📋 ' + t.about.embedCopy}
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-white/50">{t.about.embedNote}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card p-8 text-center">
          <h2 className="font-heading text-2xl font-bold mb-3">{t.about.ctaTitle}</h2>
          <p className="mb-6" style={{ color: 'var(--color-subtext)' }}>
            {t.about.ctaSub}
          </p>
          <Link to="/quiz"
                className="inline-block px-8 py-4 rounded-xl font-heading font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), #9B6BFF)', boxShadow: '0 0 30px rgba(108,71,255,0.35)' }}>
            {t.nav.quiz} →
          </Link>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
