import Footer from '../components/Footer';

const CONTACT_CHANNELS = [
  {
    icon: '📧',
    label: 'Official Support',
    value: 'himanshurajakbussines@gmail.com',
    href: 'mailto:himanshurajakbussines@gmail.com',
    desc: 'For business inquiries and technical support.',
    color: 'var(--color-primary)'
  },
  {
    icon: '🌐',
    label: 'Corporate Portfolio',
    value: 'himanshurajak.in',
    href: 'https://www.himanshurajak.in/',
    desc: 'View other data-driven projects.',
    color: 'var(--color-teal)'
  },
  {
    icon: '𝕏',
    label: 'Network Presence',
    value: '@Himansh01625929',
    href: 'https://x.com/Himansh01625929',
    desc: 'Direct communication for urgent matters.',
    color: '#fff'
  },
  {
    icon: '🐙',
    label: 'Engineering Hub',
    value: 'rajakhimanshu',
    href: 'https://github.com/rajakhimanshu',
    desc: 'Open source repository and contributions.',
    color: 'rgba(255,255,255,0.7)'
  }
];

export default function Contact() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0a1a] text-white">
        {/* ── Header ────────────────────────────────────────── */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
              style={{ background: 'rgba(108,71,255,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(108,71,255,0.2)' }}>
              Inquiries
            </span>
            <h1 className="font-heading text-4xl sm:text-7xl font-extrabold mb-8 tracking-tight">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg opacity-50 max-w-xl mx-auto leading-relaxed">
              Whether you have questions about our statistical model or business opportunities, 
              our team is ready to assist you.
            </p>
          </div>
        </section>

        {/* ── Contact Grid ─────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 pb-32">
          <div className="grid sm:grid-cols-2 gap-6">
            {CONTACT_CHANNELS.map(({ icon, label, value, href, desc, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" 
                 className="group p-8 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all no-underline flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">{label}</p>
                <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors" style={{ color }}>{value}</h3>
                <p className="text-sm opacity-50 leading-relaxed mb-6">{desc}</p>
                <span className="text-xs font-bold text-primary mt-auto">Connect →</span>
              </a>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-white/10 text-center">
            <p className="text-sm opacity-40">
              For common inquiries about the scoring engine, visit our <a href="/faq" className="text-primary hover:underline">Global FAQ</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
