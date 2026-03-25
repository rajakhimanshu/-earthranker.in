import Footer from '../components/Footer';

const OFFICIAL_CHANNELS = [
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
  }
];

const PERSONAL_NETWORK = [
  { icon: '𝕏', label: 'Twitter', href: 'https://x.com/Himansh01625929', color: '#fff' },
  { icon: '📸', label: 'Instagram', href: 'https://www.instagram.com/himanshu.rajak22/', color: '#E1306C' },
  { icon: '🔗', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100031761757065', color: '#1877F2' },
  { icon: '🐙', label: 'GitHub', href: 'https://github.com/rajakhimanshu', color: '#fff' },
  { icon: '🔴', label: 'Reddit', href: 'https://www.reddit.com/user/AgentImaginary1154/', color: '#FF4500' },
  { icon: '📰', label: 'Newsletter', href: 'https://your-growth-trainer.beehiiv.com/', color: '#FBBF24' },
];

export default function Contact() {
  return (
    <div className="page-transition page-bg--contact">
      <main className="min-h-screen text-white">
        {/* ── Header ────────────────────────────────────────── */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6"
              style={{ background: 'rgba(108,71,255,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(108,71,255,0.2)' }}>
              Inquiries
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-7xl font-extrabold mb-4 md:mb-8 tracking-tight leading-tight">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-sm md:text-lg opacity-50 max-w-xl mx-auto leading-relaxed">
              Have a question, a technical inquiry, or just want to connect? 
              Reach out through our official channels or personal network.
            </p>
          </div>
        </section>

        {/* ── Main Contact Grid ────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-16 md:mb-20">
            {OFFICIAL_CHANNELS.map(({ icon, label, value, href, desc, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" 
                 className="group p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all no-underline flex flex-col items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">{label}</p>
                <h3 className="font-heading text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors break-all" style={{ color }}>{value}</h3>
                <p className="text-xs md:text-sm opacity-50 leading-relaxed mb-4 md:mb-6">{desc}</p>
                <span className="text-[10px] md:text-xs font-bold text-primary mt-auto">Connect →</span>
              </a>
            ))}
          </div>

          {/* ── Personal Network Section ────────────────────── */}
          <div className="pt-12 md:pt-16 border-t border-white/10">
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center sm:text-left text-white/90">Explore Digital Space</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {PERSONAL_NETWORK.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                   className="flex flex-col items-center justify-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all no-underline group">
                  <span className="text-xl md:text-2xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity text-center" style={{ color: item.color }}>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 md:mt-20 py-8 md:py-12 text-center">
            <p className="text-xs md:text-sm opacity-40">
              For technical details on how the rarity engine works, check our <a href="/faq" className="text-primary hover:underline">Global FAQ</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
