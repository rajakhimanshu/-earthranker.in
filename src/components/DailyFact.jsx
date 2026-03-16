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
    <aside className="daily-fact" aria-label="Rare Fact of the Day">
      <div className="daily-fact__header">
        <span className="daily-fact__bulb" aria-hidden="true">💡</span>
        <span className="daily-fact__label">{t.HI ? 'आज का दुर्लभ तथ्य' : 'Rare Fact of the Day'}</span>
      </div>
      <p className="daily-fact__text">{fact}</p>
    </aside>
  );
}
