import { useTranslation } from '../contexts/LanguageContext';
import './DailyFact.css';

// ── Day-of-year helper ──
function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff  = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / 86_400_000);
}

export default function DailyFact() {
  const { t } = useTranslation();
  const facts = t.facts || [];
  const fact = facts[dayOfYear() % facts.length] || '';

  return (
    <div className="w-full p-4 sm:p-6 rounded-2xl bg-[#1a1a2e] border border-purple-900">
      <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-2">
        💡 {t.HI ? 'आज का दुर्लभ तथ्य' : 'Rare Fact of the Day'}
      </p>
      <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
        {fact}
      </p>
    </div>
  );
}
