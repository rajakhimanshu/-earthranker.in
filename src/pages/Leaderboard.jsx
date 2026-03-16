import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getFlag } from '../data/flags';
import { useTranslation } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import { TIERS } from '../data/rarityData';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

/* ── localStorage helpers (as fallback) ─────────────────────────── */
const LS_KEY = 'unique_leaderboard';

export function readLeaderboardLS() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function writeLeaderboardLS(entries) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries));
}

/**
 * Upsert into Firestore (and sync to LS)
 */
export async function upsertEntry(entry) {
  // 1. Sync to localStorage for immediate UI feedback
  const entries = readLeaderboardLS();
  // We use .id now which is unique per attempt
  const idx = entries.findIndex(e => e.id === entry.id);
  if (idx !== -1) {
    entries[idx] = { ...entry, timestamp: Date.now() };
  } else {
    entries.push({ ...entry, timestamp: Date.now() });
  }
  entries.sort((a, b) => b.score - a.score);
  writeLeaderboardLS(entries.slice(0, 100));

  // 2. Sync to Firestore if db is available
  if (db) {
    try {
      // Use entry.id (unique per attempt) to avoid overwriting
      const docRef = doc(db, 'leaderboard', entry.id);
      await setDoc(docRef, {
        ...entry,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Firestore upsert error:", err);
    }
  }
}

/* ── Fallback data (shown when everything is empty) ─────────── */
const FALLBACK_ENTRIES = [
  { id: '1', displayName: 'Priya S.',   score: 99.97, tier: 'Mythic',     oneIn: 450000000, country: 'India',         timestamp: Date.now() - 1200000 },
  { id: '2', displayName: 'Caspian T.', score: 99.85, tier: 'Legendary',  oneIn: 22000000,  country: 'United Kingdom', timestamp: Date.now() - 3600000 },
  { id: '3', displayName: 'Yuki N.',    score: 99.52, tier: 'Legendary',  oneIn: 1800000,   country: 'Japan',          timestamp: Date.now() - 7200000 },
  { id: '4', displayName: 'Aveline M.', score: 98.78, tier: 'Epic',       oneIn: 450000,    country: 'France',         timestamp: Date.now() - 14400000 },
  { id: '5', displayName: 'Obinna F.',  score: 98.62, tier: 'Epic',       oneIn: 320000,    country: 'Nigeria',        timestamp: Date.now() - 28000000 },
  { id: '6', displayName: 'Mateo R.',   score: 97.41, tier: 'Rare',       oneIn: 85000,     country: 'Brazil',         timestamp: Date.now() - 56000000 },
  { id: '7', displayName: 'Lars O.',    score: 96.88, tier: 'Rare',       oneIn: 62000,     country: 'Norway',         timestamp: Date.now() - 86400000 },
  { id: '8', displayName: 'Zoe K.',     score: 95.20, tier: 'Uncommon',   oneIn: 12000,     country: 'Canada',         timestamp: Date.now() - 172800000 },
  { id: '9', displayName: 'Chen W.',    score: 94.55, tier: 'Uncommon',   oneIn: 8500,      country: 'China',          timestamp: Date.now() - 259200000 },
  { id: '10', displayName: 'Sam J.',    score: 93.12, tier: 'Uncommon',   oneIn: 4200,      country: 'United States',  timestamp: Date.now() - 345600000 },
];

const RANK_COLORS = { 1: '#FFCC00', 2: '#C0C0C0', 3: '#CD7F32' };

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Just now';
  
  // Handle Firestore Timestamp or number
  const ms = typeof timestamp.toMillis === 'function' ? timestamp.toMillis() : timestamp;
  
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getTierVisuals(tierName) {
  const match = TIERS.find(t => t.name === tierName);
  return match || { color: '#a0aec0', emoji: '✨' };
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const myLeaderboardDocId = sessionStorage.getItem('myLeaderboardDocId') || null;
  const { t } = useTranslation();

  useEffect(() => {
    let unsubscribe = () => {};

    if (db) {
      setLoading(true);
      const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(100));
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        const liveEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (liveEntries.length > 0) {
          setEntries(liveEntries);
          // Sync to LS for offline fallback
          writeLeaderboardLS(liveEntries);
        } else {
          // If Firestore is empty but connected, check LS
          const ls = readLeaderboardLS();
          setEntries(ls.length > 0 ? ls : FALLBACK_ENTRIES);
        }
        setLoading(false);
      }, (err) => {
        console.warn("Firestore real-time error:", err);
        const ls = readLeaderboardLS();
        setEntries(ls.length > 0 ? ls : FALLBACK_ENTRIES);
        setLoading(false);
      });
    } else {
      // No DB, use LS
      const ls = readLeaderboardLS();
      setEntries(ls.length > 0 ? ls : FALLBACK_ENTRIES);
      setLoading(false);
    }

    // Fallback sync: listen to cross-tab localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === LS_KEY) {
        setEntries(readLeaderboardLS());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Re-render interval for "time ago" strings
    const interval = setInterval(() => setEntries(prev => [...prev]), 30000);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const filtered = entries.filter(e =>
    !searchQuery || (e.country && e.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate user's rank after entries are fetched and sorted
  const { myIndex, myEntry } = useMemo(() => {
    if (!myLeaderboardDocId || !entries.length) return { myIndex: -1, myEntry: null };
    const idx = entries.findIndex(e => e.id === myLeaderboardDocId);
    return {
      myIndex: idx,
      myEntry: idx !== -1 ? entries[idx] : null
    };
  }, [entries, myLeaderboardDocId]);

  return (
    <>
      <main className="min-h-screen flex flex-col items-center px-4 py-16 sm:px-6 sm:py-20" style={{ backgroundColor: '#0A0A14' }}>
        <div className="w-full max-w-[1100px]">
          <Link to="/" className="text-sm mb-8 inline-flex items-center gap-1 transition-colors hover:text-white" style={{ color: 'var(--color-subtext)' }}>
            ← {t.leaderboard.back}
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="font-heading text-4xl font-bold mb-2">
                {t.leaderboard.title.split('Leader')[0]} <span className="text-gradient">Leaderboard</span>
              </h1>
              <p style={{ color: 'var(--color-subtext)' }}>{t.leaderboard.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Updated in real-time</span>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8 w-full max-w-sm">
            <input
              type="text"
              placeholder="Search by country (e.g., India)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 animate-pulse">{t.leaderboard.loading}</div>
          ) : (
            <div className="space-y-3 pb-32">
              {filtered.map(({ id, displayName = 'Unknown', score = 0, tier = 'Common', oneIn, country = 'Global', topSkills = [], timestamp }, idx) => {
                const rank = entries.findIndex(e => e.id === id) + 1;
                const { color, emoji } = getTierVisuals(tier);
                const flag = getFlag(country);
                const isTop3 = rank <= 3;
                const rankColor = isTop3 ? RANK_COLORS[rank] : 'var(--color-subtext)';
                const isMe = id === myLeaderboardDocId;

                return (
                  <div
                    key={id || idx}
                    className="glass-card px-4 py-4 sm:px-5 flex items-center gap-3 sm:gap-4 transition-transform hover:scale-[1.01]"
                    style={isTop3 ? { borderColor: `${rankColor}50`, background: `linear-gradient(90deg, ${rankColor}10, transparent)` }
                      : isMe ? { borderColor: '#A855F750', background: 'rgba(168,85,247,0.07)' } : {}}
                  >
                    {/* Rank */}
                    <div className="w-6 sm:w-8 text-center font-heading font-bold text-lg shrink-0"
                      style={{ color: isMe ? '#A855F7' : rankColor, ...(isTop3 ? { filter: `drop-shadow(0 0 5px ${rankColor}80)` } : {}) }}>
                      #{rank}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-white truncate text-base sm:text-lg">{displayName}</span>
                        {isMe && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">{t.leaderboard.you}</span>}
                        <span className="text-sm" title={country}>{flag}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs sm:text-sm">
                        <span style={{ color }}>{emoji} {t.tiers[tier.toLowerCase()] || tier}</span>
                        <span className="opacity-40">•</span>
                        <span style={{ color: 'var(--color-subtext)' }}>
                          {oneIn && oneIn > 0 ? `1 in ${oneIn.toLocaleString('en-US')}` : 'Score only'}
                        </span>
                      </div>
                      {topSkills && topSkills.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {topSkills.map((sk, i) => {
                            const name = sk.split(' ').slice(1).join(' ') || sk;
                            const icon = sk.split(' ')[0] || '';
                            return <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">{icon} {name}</span>;
                          })}
                        </div>
                      )}
                    </div>

                    {/* Score & Time */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="font-heading font-bold text-lg sm:text-xl" style={{ color: isMe ? '#A855F7' : rankColor }}>
                        {score.toFixed(2)}
                      </div>
                      <div className="text-[10px] sm:text-xs" style={{ color: 'var(--color-subtext)' }}>
                        {formatTimeAgo(timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticky "your rank" bar */}
          {myEntry && !loading && (
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 flex justify-center z-50 pointer-events-none">
              <div className="glass-card px-5 py-4 w-full max-w-2xl pointer-events-auto shadow-2xl border border-purple-500/50 bg-gray-900/95 backdrop-blur-xl rounded-2xl flex items-center gap-4 animate-slide-up">
                <div className="w-8 text-center font-heading font-bold text-xl shrink-0 text-purple-400">#{myIndex + 1}</div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="font-heading font-semibold text-white text-lg">{t.leaderboard.yourRank.replace('{rank}', myIndex + 1)}</div>
                  <div className="text-sm text-purple-200/80">
                    {getTierVisuals(myEntry.tier || 'Common').emoji} {myEntry.tier || 'Common'} • Score: {(myEntry.score || 0).toFixed(2)} • {getFlag(myEntry.country)}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
