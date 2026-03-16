import { useTranslation } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLang, languageConfig } = useTranslation();

  return (
    <button 
      onClick={toggleLang}
      className="fixed top-6 right-6 z-50 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-sm hover:bg-white/20 transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2"
      aria-label="Toggle Language"
    >
      {languageConfig.label}
    </button>
  );
}
