import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { calculateScore, TIERS } from '../data/rarityData';
import { famousProfiles } from '../data/famousProfiles';
import { upsertEntry } from './Leaderboard';
import { generateStoryKey } from '../utils/storyGenerator';
import { generateAIStory, compareCelebrity } from '../utils/groqStory';
import { trackEvent } from '../utils/analytics';
import DailyFact from '../components/DailyFact';
import Footer from '../components/Footer';
import './Result.css';

/* ─── Typing Effect Component ─────────────────────────────────────── */
function TypingEffect({ text, speed = 30, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <span>{displayedText}</span>;
}

/* ─── Key-mapping: quiz answer keys → rarityData keys ──────────────── */
const EDUCATION_MAP = {
  'No formal schooling':        'No formal education',
  'Primary school':             'Primary school',
  'Secondary / High school':    'High school',
  "Bachelor's degree":          "Bachelor's degree",
  "Master's degree":            "Master's degree",
  'PhD / Doctorate':            'Doctorate / PhD',
  'Trade / Vocational':         'Trade / Vocational',
};

const AGE_BUCKET_MAP = [
  [13, 17,  'Under 18'],
  [18, 24,  '18–24'],
  [25, 34,  '25–34'],
  [35, 44,  '35–44'],
  [45, 54,  '45–54'],
  [55, 64,  '55–64'],
  [65, 999, '65+'],
];

function getAgeBucket(age) {
  const n = Number(age);
  const row = AGE_BUCKET_MAP.find(([lo, hi]) => n >= lo && n <= hi);
  return row ? row[2] : null;
}

export function normaliseAnswers(raw) {
  const out = {};
  if (raw.hand)      out.handedness = raw.hand;
  if (raw.eyeColor)  out.eyeColor   = raw.eyeColor;
  if (raw.hairColor) out.hairColor  = raw.hairColor;
  if (raw.gender)    out.gender     = raw.gender;
  if (raw.country)   out.country    = raw.country;
  if (raw.blood)     out.bloodType  = raw.blood;
  if (raw.education) out.education  = EDUCATION_MAP[raw.education] ?? raw.education;
  if (raw.age)       out.ageGroup   = getAgeBucket(raw.age);
  if (raw.skills && raw.skills.length > 0) out.skills = raw.skills;
  if (raw.bDay)      out.bDay       = raw.bDay;
  if (raw.bMonth)    out.bMonth     = raw.bMonth;
  if (raw.bYear)     out.bYear      = raw.bYear;
  // New optional traits
  if (raw.nameInitial) out.nameInitial = raw.nameInitial;
  if (raw.moles && raw.moles.length > 0 && !raw.moles.includes('None'))
    out.moleLocations = raw.moles;
  return out;
}

/* Slot machine counter */
function SlotCounter({ target, className = '' }) {
  const [display, setDisplay] = useState(1);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!target || target <= 1) { setDisplay(target || 1); return; }

    // easeOutExpo – fast at start, crawls near the end
    const DURATION = 3200; // ms
    const start = performance.now();
    const log10Target = Math.log10(target);

    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);
      // easeInExpo – starts slow, speeds up dramatically at the end
      const eased = t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
      // interpolate in log-space so it doesn't rush through small numbers
      const logVal = eased * log10Target;
      const val = Math.round(Math.pow(10, logVal));
      setDisplay(Math.max(1, Math.min(val, target)));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <span className={`slot-number ${className}`}>
      {display.toLocaleString('en-US')}
    </span>
  );
}

// Old TraitBar and HexBadge were removed for the redesign.

/* Canvas score card generator */
function downloadScoreCard({ name, oneIn, rarityTier, tierEmoji, tierColor, score, t }) {
  const SIZE   = 1080;
  const canvas = document.createElement('canvas');
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // ── Background gradient ─────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0,   '#0D0D1A');
  bg.addColorStop(0.4, '#1A0E3D');
  bg.addColorStop(1,   '#0F2040');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Geometric hex-grid pattern ──────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.055;
  ctx.strokeStyle = '#8B5CF6';
  ctx.lineWidth   = 1.5;
  const HEX_R = 54;          // outer radius
  const HW    = HEX_R * Math.sqrt(3);
  const HH    = HEX_R * 1.5;
  const cols  = Math.ceil(SIZE / HW) + 2;
  const rows  = Math.ceil(SIZE / HH) + 2;
  function hexPath(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i - 30);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const cx = col * HW + (row % 2 === 0 ? 0 : HW / 2);
      const cy = row * HH;
      hexPath(cx, cy, HEX_R - 2);
    }
  }
  ctx.restore();

  // ── Radial glow at centre ───────────────────────────────────────────
  const glow = ctx.createRadialGradient(SIZE/2, SIZE/2, 0, SIZE/2, SIZE/2, 480);
  glow.addColorStop(0,   tierColor + '33');
  glow.addColorStop(0.5, tierColor + '18');
  glow.addColorStop(1,   'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Corner accent circles ───────────────────────────────────────────
  [[0,0],[SIZE,0],[0,SIZE],[SIZE,SIZE]].forEach(([x,y]) => {
    const r = ctx.createRadialGradient(x, y, 0, x, y, 300);
    r.addColorStop(0,   '#6C47FF22');
    r.addColorStop(1,   'transparent');
    ctx.fillStyle = r;
    ctx.fillRect(0, 0, SIZE, SIZE);
  });

  // ── Top border stripe ───────────────────────────────────────────────
  const stripe = ctx.createLinearGradient(0, 0, SIZE, 0);
  stripe.addColorStop(0,   '#6C47FF00');
  stripe.addColorStop(0.3, '#6C47FFCC');
  stripe.addColorStop(0.7, '#FF6B6BCC');
  stripe.addColorStop(1,   '#FF6B6B00');
  ctx.fillStyle = stripe;
  ctx.fillRect(0, 0, SIZE, 5);

  // ── EARTH RANKER logo text ────────────────────────────────────────────
  ctx.font         = 'bold 52px "Space Grotesk", "Arial", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'alphabetic';
  // Purple glow
  ctx.shadowColor  = '#8B5CF6';
  ctx.shadowBlur   = 24;
  ctx.fillStyle    = '#A78BFA';
  ctx.fillText('EARTH RANKER', SIZE/2, 130);
  ctx.shadowBlur   = 0;

  // ── User Name (Professional addition) ──────────────────────────────
  if (name) {
    ctx.font = '500 32px "Inter", "Arial", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.8;
    ctx.fillText(name.toUpperCase(), SIZE/2, 185);
    ctx.globalAlpha = 1.0;
  }

  // ── Thin divider under name ─────────────────────────────────────────
  ctx.strokeStyle = 'rgba(139,92,246,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIZE/2 - 180, 205);
  ctx.lineTo(SIZE/2 + 180, 205);
  ctx.stroke();

  // ── "You are" label ─────────────────────────────────────────────────
  ctx.font      = '400 36px "Inter", "Arial", sans-serif';
  ctx.fillStyle = 'rgba(200,200,230,0.7)';
  ctx.fillText(t.result.youAre, SIZE/2, 280);

  // ── '1 in' prefix ───────────────────────────────────────────────────
  ctx.font      = '700 68px "Space Grotesk", "Arial", sans-serif';
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText(t.result.oneIn, SIZE/2, 370);

  // ── Giant gold 1-in-X number ─────────────────────────────────────────
  const numStr = oneIn.toLocaleString('en-US');
  // Scale font to fit
  let fontSize = 200;
  ctx.font = `900 ${fontSize}px "Space Grotesk", "Arial", sans-serif`;
  while (ctx.measureText(numStr).width > SIZE - 80 && fontSize > 60) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize}px "Space Grotesk", "Arial", sans-serif`;
  }
  // Gold gradient text
  const goldGrad = ctx.createLinearGradient(SIZE/2 - 300, 0, SIZE/2 + 300, 0);
  goldGrad.addColorStop(0,    '#B8860B');
  goldGrad.addColorStop(0.25, '#FFD700');
  goldGrad.addColorStop(0.5,  '#FFF8DC');
  goldGrad.addColorStop(0.75, '#FFD700');
  goldGrad.addColorStop(1,    '#B8860B');
  ctx.shadowColor  = '#FFD70066';
  ctx.shadowBlur   = 40;
  ctx.fillStyle    = goldGrad;
  ctx.fillText(numStr, SIZE/2, 570);
  ctx.shadowBlur   = 0;

  // ── Tier emoji (drawn as text) ───────────────────────────────────────
  ctx.font         = '120px serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle    = '#ffffff';
  ctx.shadowColor  = tierColor;
  ctx.shadowBlur   = 30;
  ctx.fillText(tierEmoji, SIZE/2, 720);
  ctx.shadowBlur   = 0;

  // ── Tier name pill background ────────────────────────────────────────
  const pillW = 320, pillH = 72, pillX = SIZE/2 - pillW/2, pillY = 750;
  const pillGrad = ctx.createLinearGradient(pillX, 0, pillX + pillW, 0);
  pillGrad.addColorStop(0, tierColor + 'CC');
  pillGrad.addColorStop(1, tierColor + '88');
  ctx.save();
  ctx.shadowColor = tierColor;
  ctx.shadowBlur  = 28;
  ctx.fillStyle   = pillGrad;
  const r = pillH / 2;
  ctx.beginPath();
  ctx.moveTo(pillX + r, pillY);
  ctx.lineTo(pillX + pillW - r, pillY);
  ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + r);
  ctx.lineTo(pillX + pillW, pillY + pillH - r);
  ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - r, pillY + pillH);
  ctx.lineTo(pillX + r, pillY + pillH);
  ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - r);
  ctx.lineTo(pillX, pillY + r);
  ctx.quadraticCurveTo(pillX, pillY, pillX + r, pillY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Tier name text in pill
  ctx.font         = 'bold 44px "Space Grotesk", "Arial", sans-serif';
  ctx.fillStyle    = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '3px';
  ctx.fillText(rarityTier.toUpperCase(), SIZE/2, pillY + pillH / 2);

  // ── Score line ───────────────────────────────────────────────────────
  ctx.font         = '400 30px "Inter", "Arial", sans-serif';
  ctx.fillStyle    = 'rgba(200,200,230,0.6)';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = '0px';
  ctx.fillText(`${t.result.rarityScore}: ${score} / 100`, SIZE/2, 890);

  // ── Bottom divider ───────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(139,92,246,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIZE/2 - 200, 930);
  ctx.lineTo(SIZE/2 + 200, 930);
  ctx.stroke();

  // ── Website URL ──────────────────────────────────────────────────────
  ctx.font      = '500 32px "Inter", "Arial", sans-serif';
  ctx.fillStyle = 'rgba(167,139,250,0.85)';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('earthranker.himanshurajak.in', SIZE/2, 1000);

  // ── Bottom color stripe ──────────────────────────────────────────────
  ctx.fillStyle = stripe;
  ctx.fillRect(0, SIZE - 5, SIZE, 5);

  // ── Trigger download ─────────────────────────────────────────────────
  const link = document.createElement('a');
  link.download = 'earthranker-score-card.png';
  link.href     = canvas.toDataURL('image/png');
  link.click();
}

/* Canvas Certificate generator */
function downloadCertificate({ name, age, oneIn, rarityTier, tierColor, t, traitBreakdown }) {
  const S = 1440; // 1:1 Aspect Ratio for Social Sharing
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');

  // 1. Background
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, S, S);

  // Gradient Glow
  const bgGrad = ctx.createRadialGradient(S/2, S/2, 0, S/2, S/2, S/0.8);
  bgGrad.addColorStop(0, `${tierColor}25`);
  bgGrad.addColorStop(1, '#050505');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, S, S);

  // 2. Borders
  const pad = 80;
  ctx.strokeStyle = tierColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(pad, pad, S - pad*2, S - pad*2);

  ctx.strokeStyle = '#ffffff15';
  ctx.lineWidth = 1;
  ctx.strokeRect(pad+25, pad+25, S - (pad+25)*2, S - (pad+25)*2);

  // 3. Header
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 44px "Space Grotesk"';
  ctx.fillStyle = '#ffffff50';
  ctx.letterSpacing = '8px';
  ctx.fillText('EARTH RANKER', S/2, pad + 120);

  ctx.font = 'bold 90px "Space Grotesk"';
  ctx.fillStyle = '#ffffff';
  ctx.letterSpacing = '2px';
  ctx.fillText('CERTIFICATE OF RARITY', S/2, pad + 240);

  // 4. Main Content
  ctx.font = '400 42px "Inter"';
  ctx.fillStyle = '#ffffff70';
  ctx.fillText('This is to certify that', S/2, S/2 - 180);

  // Name
  ctx.font = '900 130px "Space Grotesk"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText((name || 'Unique Soul').toUpperCase(), S/2, S/2 - 60);

  // Age (New addition)
  if (age) {
    ctx.font = '600 36px "Inter"';
    ctx.fillStyle = tierColor;
    ctx.fillText(`AGE: ${age} YEARS`, S/2, S/2 + 10);
  }

  ctx.font = '400 42px "Inter"';
  ctx.fillStyle = '#ffffff70';
  ctx.fillText('is statistically ranked', S/2, S/2 + 80);

  // Big Number
  ctx.font = '900 180px "Space Grotesk"';
  const grad = ctx.createLinearGradient(S/2 - 400, 0, S/2 + 400, 0);
  grad.addColorStop(0, '#A855F7');
  grad.addColorStop(0.5, '#FF6B6B');
  grad.addColorStop(1, '#A855F7');
  ctx.fillStyle = grad;
  ctx.fillText(`1 in ${oneIn.toLocaleString()}`, S/2, S/2 + 240);

  ctx.font = 'bold 55px "Space Grotesk"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('PEOPLE ON EARTH', S/2, S/2 + 360);

  // 5. Tier Badge
  const bW = 450;
  const bH = 90;
  const bX = S/2 - bW/2;
  const bY = S/2 + 450;
  ctx.fillStyle = tierColor;
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(bX, bY, bW, bH, 45);
    ctx.fill();
  } else {
    ctx.fillRect(bX, bY, bW, bH);
  }

  ctx.font = 'bold 45px "Space Grotesk"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(rarityTier.toUpperCase(), S/2, bY + bH/2);

  // 6. Footer
  ctx.font = '32px "Inter"';
  ctx.fillStyle = '#ffffff30';
  const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillText(`Issued on: ${dateStr}`, S/2, S - pad - 120);

  ctx.font = 'bold 34px "Inter"';
  ctx.fillStyle = tierColor;
  ctx.fillText('earthranker.himanshurajak.in', S/2, S - pad - 60);

  // 7. Download
  const link = document.createElement('a');
  const certId = `ER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  link.download = `EarthRanker-Certificate-${name || 'Result'}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
/* Famous Compare Section */
function FamousCompareSection({ userName, userTraits, score, rarityNumber, tierColor }) {
  const [inputName, setInputName] = useState('');
  const [compareResult, setCompareResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [compareCount, setCompareCount] = useState(0);

  const handleCompare = async () => {
    if (!inputName.trim()) return;
    if (compareCount >= 3) {
      setError('Comparison limit reached (max 3).');
      return;
    }
    
    setIsLoading(true);
    setCompareResult('');
    setError('');

    try {
      const text = await compareCelebrity({
        userName: userName || 'You',
        userTraits: userTraits.map(t => t.value),
        celebrityName: inputName,
        rarityScore: score,
        rarityNumber: rarityNumber
      });
      
      if (text) {
        setCompareResult(text);
        setCompareCount(prev => prev + 1);
        if (typeof trackEvent === 'function') {
          trackEvent('celebrity_compared', { name: inputName });
        }
      } else {
        setError('Could not generate comparison. Please try again.');
      }
    } catch (err) {
      console.error('Compare Error:', err);
      setError('Something went wrong. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="famous-section glass-card">
      <div className="mb-6">
        <h2 className="result-section-title">AI Personality Match</h2>
        <p className="result-section-sub">Compare your rarity with any legend in history.</p>
        <div className="mt-2 flex justify-center gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${i <= compareCount ? 'bg-purple-500' : 'bg-white/10'}`} />
          ))}
          <span className="text-[10px] uppercase tracking-widest text-white/30 ml-2">{3 - compareCount} attempts left</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
            placeholder="e.g. Abraham Lincoln, Elon Musk..."
            disabled={compareCount >= 3}
            className="w-full md:flex-1 px-4 py-3 rounded-xl bg-[#1a1a2e] text-white border border-purple-800 outline-none focus:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleCompare}
            disabled={isLoading || compareCount >= 3}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Compare'}
          </button>
        </div>

        {isLoading && (
          <div className="text-purple-400 text-sm animate-pulse">
            🔍 Comparing your rarity with {inputName}...
          </div>
        )}

        {compareResult && (
          <div className="p-4 rounded-xl bg-[#1a1a2e] border border-purple-800 text-gray-200 text-sm leading-relaxed animate-fade-in">
            {compareResult}
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}
      </div>
    </section>
  );
}

export default function Result() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const { t } = useTranslation();
  const rawAnswers = state?.answers;

  useEffect(() => {
    if (!rawAnswers) {
      alert("Please complete the quiz first");
      navigate('/quiz');
    }
  }, [rawAnswers, navigate]);

  if (!rawAnswers) {
    return null;
  }

  const normAnswers = useMemo(() => normaliseAnswers(rawAnswers), [rawAnswers]);
  const { score, rarityTier, tierColor, tierEmoji, oneIn: baseOneIn, oneInRaw, traitBreakdown } =
    useMemo(() => {
      const res = calculateScore(normAnswers);
      trackEvent('quiz_completed', { score: res.score, tier: res.rarityTier });
      return res;
    }, [normAnswers]);

  const normalTraits = traitBreakdown.filter(t => !t.isSkill);
  const skillTraits = traitBreakdown.filter(t => t.isSkill);
  const rareSkills = skillTraits.filter(s => s.fraction < 0.05);

  // AI Story States
  const [aiStory, setAiStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [regenCount, setRegenCount] = useState(() => {
    return parseInt(sessionStorage.getItem('ai_regen_count') || '0', 10);
  });
  const [fallbackStoryKey, setFallbackStoryKey] = useState(() => generateStoryKey(rawAnswers, traitBreakdown));

  const fetchAIStory = async () => {
    setIsGenerating(true);
    setAiStory('');
    setIsTyping(false);

    try {
      const profile = {
        userName: rawAnswers.userName,
        name: rawAnswers.userName, 
        country: rawAnswers.country,
        age: rawAnswers.age,
        education: rawAnswers.education,
        bloodType: rawAnswers.blood,
        eyeColor: rawAnswers.eyeColor,
        skills: skillTraits.map(s => s.value),
        score,
        tier: rarityTier,
        oneIn: baseOneIn
      };

      const story = await generateAIStory(profile);
      if (!story) throw new Error('Empty story');
      setAiStory(story);
      setIsTyping(true);
      trackEvent('ai_story_generated');
    } catch (error) {
      console.error('AI Story Error:', error);
      // Fallback to local rule-based story
      setAiStory('');
      setIsTyping(false);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchAIStory();
  }, []);

  const handleRegenerate = () => {
    if (regenCount >= 3) return;
    
    const newCount = regenCount + 1;
    setRegenCount(newCount);
    sessionStorage.setItem('ai_regen_count', newCount.toString());

    fetchAIStory();
  };

  const [copiedChallenge, setCopiedChallenge] = useState(false);
  const [revealed,  setRevealed]  = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // Leaderboard Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState(rawAnswers?.userName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Cosmic Mode State
  const [isUniverse, setIsUniverse] = useState(false);

  const COSMIC_MULTIPLIER = 1250000;
  const oneIn = isUniverse ? Math.round(oneInRaw * COSMIC_MULTIPLIER) : baseOneIn;

  // Cosmic Tiers Mapping
  const getCosmicTier = (normalTier) => {
    switch(normalTier) {
      case 'Common': return { name: 'Stardust', emoji: '✨' };
      case 'Uncommon': return { name: 'Comet', emoji: '☄️' };
      case 'Rare': return { name: 'Nebula', emoji: '🌌' };
      case 'Epic': return { name: 'Supernova', emoji: '💥' };
      case 'Legendary': return { name: 'Pulsar', emoji: '💫' };
      case 'Mythic': return { name: 'Singularity', emoji: '🕳️' };
      default: return { name: normalTier, emoji: tierEmoji };
    }
  };
  const currentTierData = isUniverse ? getCosmicTier(rarityTier) : { name: t.tiers[rarityTier] || rarityTier, emoji: tierEmoji };

  const hasBirthday = !!rawAnswers.bDay && !!rawAnswers.bMonth && !!rawAnswers.bYear;
  const birthdayTwinMonth = hasBirthday ? Math.round((isUniverse ? 10000000000000 : 8280000000) / 365.25) : 0;
  const birthdayTwinExact = hasBirthday ? Math.round((isUniverse ? 10000000000000 : 8280000000) / 365.25 / 60) : 0;

  // Staggered reveal & Modal popup
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    const m = setTimeout(() => { 
      const alreadySubmitted = sessionStorage.getItem("myLeaderboardDocId");
      if (score > 0 && !alreadySubmitted) {
        setShowModal(true); 
      }
    }, 2800);
    return () => { clearTimeout(t); clearTimeout(m); };
  }, [score]);

  async function submitToLeaderboard(e) {
    e.preventDefault();
    if (!modalName.trim()) return;
    setIsSubmitting(true);
    try {
      if (!sessionStorage.getItem('sessionId')) {
        sessionStorage.setItem('sessionId', crypto.randomUUID());
      }
      const sessionId = sessionStorage.getItem('sessionId');
      const entryId = crypto.randomUUID(); // Unique ID for THIS specific attempt

      await upsertEntry({
        id: entryId,
        sessionId,
        displayName: modalName.trim(),
        score,
        tier: rarityTier,
        tierEmoji: tierEmoji || '',
        oneIn: baseOneIn,
        country: rawAnswers.country || 'Global',
        // Public trait showcase — no personal/identifying data
        gender:       rawAnswers.gender       || '',
        handedness:   rawAnswers.hand         || '',
        eyeColor:     rawAnswers.eyeColor      || '',
        hairColor:    rawAnswers.hairColor     || '',
        bloodType:    rawAnswers.blood         || '',
        education:    rawAnswers.education     || '',
        nameInitial:  rawAnswers.nameInitial   || '',
        birthDay:     rawAnswers.bDay          || '',
        birthMonth:   rawAnswers.bMonth        || '',
        aiStory:      aiStory || '',
        topSkills: [...skillTraits].sort((a, b) => a.fraction - b.fraction).slice(0, 3).map(s => s.value),
        allSkills: (rawAnswers.skills || []),
        timestamp: Date.now(),
      });
      sessionStorage.setItem("myLeaderboardDocId", entryId);
      trackEvent('leaderboard_submitted');
      setSubmitSuccess(true);
      setTimeout(() => setShowModal(false), 900);
    } catch (err) {
      console.error('Leaderboard save error:', err);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <main className={`result-page ${isUniverse ? 'result-page--cosmic' : ''}`}>

      {/* ── Decorative Earth / Planetary System ────────────────────── */}
      {!isUniverse ? (
        <div className="planetary-system" aria-hidden>
          <div className="earth-orbit-ring" />
          <div className="moon-orbit-ring" />
          <div className="planet-earth">
            <div className="earth-texture"></div>
          </div>
          <div className="orbit-container">
            <div className="planet-moon"></div>
          </div>
        </div>
      ) : (
        <div className="cosmic-bg" aria-hidden />
      )}

      <div className={`result-content ${revealed ? 'result-content--in' : ''}`}>

        {/* ── PREMIUM HERO SECTION ──────────────────────────────────────────────── */}
        <section className={`result-hero-premium tier-${rarityTier.toLowerCase()}`} style={{ '--tierColor': tierColor }}>
          <div className="result-hero-premium-inner">
            <div className="hero-massive-row">
              <div className="hero-number-wrap">
                <p className="text-sm sm:text-base tracking-widest text-gray-400 uppercase">{t.result.oneIn}</p>
                <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  <SlotCounter target={oneIn} />
                </h1>
              </div>
              
              <div className="hero-badge-wrap">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 floating-badge-premium" style={{ '--tierColor': tierColor }}>
                  <div className="badge-glow-pulse" />
                  <span className="badge-emoji-main text-3xl sm:text-4xl lg:text-5xl">{currentTierData.emoji}</span>
                  <span className="badge-tier-name text-[10px] sm:text-xs lg:text-sm">{currentTierData.name}</span>
                </div>
              </div>
            </div>

            <p className="hero-premium-subtitle text-sm sm:text-base">
              {isUniverse ? t.result.oneInSubUniverse : t.result.oneInSubEarth}
            </p>

            {!isEmbed && (
              <div className="flex justify-center w-full mt-4">
                <div
                  onClick={() => setIsUniverse(!isUniverse)}
                  className="relative flex items-center cursor-pointer select-none bg-[#1a1a2e] rounded-full p-1 w-56 h-12 mx-auto"
                >
                  {/* Sliding background knob */}
                  <div
                    className="absolute top-1 bottom-1 transition-all duration-300 ease-in-out bg-white rounded-full z-0"
                    style={{
                      left: isUniverse ? 'calc(50% + 2px)' : '4px',
                      width: 'calc(50% - 6px)',
                    }}
                  />
                  {/* Earth label */}
                  <span
                    className={`flex-1 text-center z-10 font-bold text-sm transition-colors duration-300 ${
                      !isUniverse ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    Earth 🌍
                  </span>
                  {/* Universe label */}
                  <span
                    className={`flex-1 text-center z-10 font-bold text-sm transition-colors duration-300 ${
                      isUniverse ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    Universe 🔭
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── STATS PILLS ROW ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full px-4 mt-6">
          <div className="w-full rounded-2xl border border-teal-500/30 bg-[#0d1117] p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Rarity Score</p>
            <p className="text-3xl font-bold text-white">{score}/100</p>
          </div>

          <div className="w-full rounded-2xl border border-teal-500/30 bg-[#0d1117] p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Top % of Humans</p>
            <p className="text-3xl font-bold text-white">
              {(1 / baseOneIn * 100) < 0.0001 ? '<0.0001%' : parseFloat((1 / baseOneIn * 100).toFixed(4)) + '%'}
            </p>
          </div>

          <div className="w-full rounded-2xl border border-purple-500/30 bg-[#0d1117] p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Tier</p>
            <p className="text-3xl font-bold text-purple-400">{currentTierData.name}</p>
          </div>
        </div>

        {/* ── Trait Breakdown (Premium Table) ──────────────────────────────────────── */}
        {normalTraits.length > 0 && (
          <section className="premium-breakdown-card glass-card">
            <h2 className="premium-section-title">{t.result.traitBreakdown.title}</h2>
            <div className="premium-trait-list">
              {normalTraits.map(({ trait, value, fraction }, i) => {
                const pct = Math.round(fraction * 100 * 100) / 100;
                let rarityLabelKey = 'common';
                let rarityClass = 'common';
                if (pct < 1) { rarityLabelKey = 'mythic'; rarityClass = 'mythic'; }
                else if (pct < 5) { rarityLabelKey = 'rare'; rarityClass = 'rare'; }
                else if (pct < 20) { rarityLabelKey = 'uncommon'; rarityClass = 'uncommon'; }

                const emoji = t.traits[trait]?.split(' ')[0] || '✨';

                return (
                  <div key={trait} className="premium-trait-row">
                    <div className="trait-col-left">
                      <span className="trait-emoji">{emoji}</span>
                      <span className="trait-name">{value}</span>
                    </div>
                    <div className="trait-col-center">
                      <span className={`rarity-pill-premium pill-${rarityClass}`}>{t.traitTiers[rarityLabelKey]}</span>
                    </div>
                    <div className="trait-col-right">
                      <span className="trait-pct-text">
                        {pct < 1 ? `${(fraction * 100).toFixed(2)}%` : `${pct}%`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Your Rarity Story (Premium Editorial) ────────────────────────────────────── */}
        <section className="premium-story-container" style={{ '--tierColor': tierColor }}>
          <div className="premium-story-border-wrap">
            <div className="premium-story-card">
              {/* AI Generated Badge */}
              {aiStory && !isGenerating && (
                <div className="absolute top-4 right-6 text-[10px] font-bold tracking-widest uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full text-purple-400 shadow-sm flex items-center gap-1.5 z-10 animate-fade-in">
                  ✨ AI Generated
                </div>
              )}

              <span className="premium-quote-mark">“</span>
              <div className="premium-story-text">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    </div>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/30 animate-pulse">AI is analysing your rarity...</p>
                  </div>
                ) : aiStory ? (
                  isTyping ? (
                    <TypingEffect text={aiStory} onComplete={() => setIsTyping(false)} />
                  ) : (
                    aiStory
                  )
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-white/40 text-sm uppercase tracking-tighter mb-2">AI Story unavailable in local mode</p>
                    {t.result.story.messages[fallbackStoryKey] && t.result.story.messages[fallbackStoryKey].split('{name}').map((part, i) => (
                      <span key={i}>
                        {part}
                        {i === 0 && t.result.story.messages[fallbackStoryKey].includes('{name}') && (
                          <strong className="story-name-highlight" style={{ color: tierColor }}>
                            {rawAnswers.name || (t.HI ? 'आप' : 'You')}
                          </strong>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {!isGenerating && !isTyping && regenCount < 3 && (
                <button 
                  onClick={handleRegenerate}
                  className="premium-regen-btn"
                >
                  {t.result.story.newStory} ↻ <span className="opacity-50 lowercase tracking-normal font-normal">({3 - regenCount} {t.result.story.left})</span>
                </button>
              )}
            </div>
          </div>
        </section>
        {/* ── Rare Skills ──────────────────────────────────────── */}
        {skillTraits.length > 0 && (
          <section className="result-skills-card glass-card">
            <h2 className="result-section-title">{t.result.rareSkills.title}</h2>
            <p className="result-section-sub">{t.result.rareSkills.sub}</p>
            <div className="skills-masonry">
              {[...skillTraits].sort((a, b) => a.fraction - b.fraction).map((skill, index) => {
                const isRarest = index === 0;
                const isRare = skill.fraction < 0.05;
                const pct = skill.fraction < 0.01 
                  ? (skill.fraction * 100).toFixed(2) 
                  : (skill.fraction * 100).toFixed(0);
                
                const firstSpace = skill.value.indexOf(' ');
                const emoji = firstSpace > 0 ? skill.value.slice(0, firstSpace) : '';
                const skillName = firstSpace > 0 ? skill.value.slice(firstSpace + 1) : skill.value;

                // Font scaling 0.85rem to 1.4rem depending on rarity
                const rarityScore = Math.max(0, 0.05 - skill.fraction);
                const scale = 0.85 + (rarityScore * 10);
                const glowLevel = isRare ? Math.min(25, rarityScore * 400) : 0;

                const count = skill.worldCount || 0;
                let countStr = '';
                if (count >= 1000000) {
                  const m = count / 1000000;
                  countStr = `~${Number.isInteger(m) ? m : m.toFixed(1)}M`;
                } else {
                  countStr = `~${(count/1000).toFixed(0)}k`;
                }

                return (
                  <div key={skill.value} 
                       className={`skill-cloud-tag ${isRarest ? 'rarest-skill' : ''} ${isRare ? 'rare-skill-tag' : 'common-skill-tag'}`}
                       style={{ 
                         fontSize: `${scale}rem`,
                         boxShadow: isRare ? `0 0 ${glowLevel}px ${tierColor}60` : 'none',
                         borderColor: isRare ? `${tierColor}90` : 'rgba(255,255,255,0.1)'
                       }}>
                    {isRarest && <div className="rarest-badge" style={{ background: tierColor }}>⭐ {t.result.rareSkills.rarest}</div>}
                    <div className="skill-cloud-top">
                      <span className="skill-emoji">{emoji}</span>
                      <strong className="skill-name">{skillName}</strong>
                    </div>
                    <div className="skill-cloud-bot">
                      <span className="skill-count">{countStr}</span>
                      <span className="skill-pct-pill">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Multi-Skilled Anomaly Banner ─────────────────────── */}
        {rareSkills.length >= 3 && (
          <div className="w-full max-w-[680px] bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <h3 className="text-[1.3rem] font-bold text-white mb-2 flex items-center justify-center gap-2 font-heading tracking-wide">
              {t.result.anomaly.title}
            </h3>
            <p className="text-purple-200/80 text-[0.95rem] font-body leading-relaxed">
              {t.result.anomaly.sub}
            </p>
          </div>
        )}

        {/* ── Birthday Rarity ────────────────────────────────────── */}
        {hasBirthday && (
          <section className="result-birthday glass-card">
            <h2 className="result-section-title">{t.result.birthday.title}</h2>
            <p className="result-section-sub">{isUniverse ? t.result.birthday.subUniverse : t.result.birthday.subEarth}</p>
            <div className="birthday-stats-row">
              <div className="birthday-stat-pill teal">
                <span className="bday-num"><SlotCounter target={birthdayTwinMonth} className="bday-slot" /></span>
                <span className="bday-label">{isUniverse ? t.result.birthday.monthShareUniverse : t.result.birthday.monthShareEarth} {t.result.birthday.monthShareText}</span>
              </div>
              <div className="birthday-stat-pill coral">
                <span className="bday-num"><SlotCounter target={birthdayTwinExact} className="bday-slot" /></span>
                <span className="bday-label">{isUniverse ? t.result.birthday.exactShareUniverse : t.result.birthday.exactShareEarth} {t.result.birthday.exactShareText}</span>
              </div>
            </div>
          </section>
        )}

        {/* ── Name Initial Fun Fact ─────────────────────────────────── */}
        {rawAnswers.nameInitial && (() => {
          const letter = rawAnswers.nameInitial;
          const FRACS = { A:0.12,B:0.06,C:0.07,D:0.06,E:0.05,F:0.04,G:0.04,H:0.05,I:0.03,J:0.08,K:0.06,L:0.05,M:0.10,N:0.05,O:0.03,P:0.06,Q:0.002,R:0.08,S:0.11,T:0.05,U:0.01,V:0.03,W:0.03,X:0.001,Y:0.005,Z:0.003 };
          const frac = FRACS[letter] ?? 0.04;
          const worldCount = Math.round(frac * 8_280_000_000);
          const countStr = worldCount >= 1_000_000_000
            ? `${(worldCount / 1_000_000_000).toFixed(1)}B`
            : worldCount >= 1_000_000
            ? `${(worldCount / 1_000_000).toFixed(0)}M`
            : `${(worldCount / 1_000).toFixed(0)}K`;
          return (
            <div className="w-full flex items-center gap-4 p-4 sm:p-6 rounded-2xl bg-[#1a1a2e] border border-purple-900">
              <span className="text-4xl sm:text-6xl font-bold text-purple-400 shrink-0">
                {letter}
              </span>
              <div>
                <p className="font-semibold text-white text-sm sm:text-base">
                  🔡 Your name initial (<span className="text-purple-400">{letter}</span>)
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Shared by approximately <strong>{countStr}</strong> people on Earth — {(frac * 100).toFixed(1)}% of the population.
                </p>
              </div>
            </div>
          );
        })()}

        {/* ── Mole Fun Facts ────────────────────────────────────────── */}
        {rawAnswers.moles && rawAnswers.moles.length > 0 && !rawAnswers.moles.includes('None') && (
          <section className="glass-card" style={{ width: '100%', padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap:'wrap' }}>
              <span style={{ fontSize: '1.4rem' }}>🖤</span>
              <p style={{ fontFamily:'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>Mole Locations</p>
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.75rem', borderRadius: 99, background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.25)', color: '#FF6B6B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🎉 Fun Bonus</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {rawAnswers.moles.map(loc => {
                const MOLE_FRACS = { Face: 0.20, Hand: 0.15, Neck: 0.10, Back: 0.25 };
                const frac = MOLE_FRACS[loc] ?? 0.15;
                const count = Math.round(frac * 8_280_000_000);
                const countStr = `~${(count / 1_000_000).toFixed(0)}M`;
                const emoji = loc === 'Face' ? '😊' : loc === 'Hand' ? '✋' : loc === 'Neck' ? '🦒' : '🔙';
                return (
                  <div key={loc} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.85rem 1.25rem' }}>
                    <p style={{ fontFamily:'var(--font-heading)', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{emoji} Mole on {loc}</p>
                    <p style={{ fontFamily:'var(--font-body)', color:'rgba(255,255,255,0.5)', fontSize:'0.82rem' }}>Shared by {countStr} people ({(frac * 100).toFixed(0)}%)</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Famous Person Comparison ──────────────────────────────── */}
        <FamousCompareSection 
          userName={rawAnswers.userName}
          userTraits={traitBreakdown}
          score={score}
          rarityNumber={oneIn.toLocaleString()}
          tierColor={tierColor}
        />

        {/* ── Daily Fact ─────────────────────────────────────────── */}
        <DailyFact />

        {/* ── Action Buttons (Equal Width Row) ────────────────────── */}
        <section className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            className={`w-full sm:w-auto flex-1 action-btn action-btn-secondary ${downloading ? 'busy' : ''}`}
            onClick={async () => {
              setDownloading(true);
              await document.fonts.ready;
              requestAnimationFrame(() => {
                downloadScoreCard({ 
                  name: rawAnswers.userName || rawAnswers.name,
                  oneIn, rarityTier, tierEmoji, tierColor, score, t 
                });
                setDownloading(false);
              });
            }}
          >
            {downloading ? '⏳ ' + t.result.share.generating : '⬇️ ' + t.result.share.download}
          </button>

          <button
            className="w-full sm:w-auto flex-1 action-btn action-btn-secondary"
            onClick={async () => {
              await document.fonts.ready;
              downloadCertificate({ 
                name: rawAnswers.userName || rawAnswers.name, 
                age: rawAnswers.age,
                oneIn, 
                rarityTier, 
                tierColor, 
                t,
                traitBreakdown: traitBreakdown.sort((a, b) => a.fraction - b.fraction)
              });
              trackEvent('certificate_downloaded');
            }}
          >
            🏅 {t.HI ? 'प्रमाणपत्र डाउनलोड करें' : 'Download Certificate'}
          </button>

          {!isEmbed && (
            <button
              className="w-full sm:w-auto flex-1 action-btn action-btn-primary"
              onClick={() => {
                try {
                  const challengerData = {
                    displayName: rawAnswers.name || (t.HI ? 'आपका मित्र' : 'Your Friend'),
                    score,
                    tier: rarityTier,
                    oneIn,
                    country: rawAnswers.country || 'Global',
                    topSkills: skillTraits.sort((a, b) => a.fraction - b.fraction).slice(0, 3).map(s => s.value),
                    traitBreakdown: normalTraits.slice(0, 6),
                    age: rawAnswers.age,
                    bloodType: rawAnswers.blood,
                    eyeColor: rawAnswers.eyeColor,
                    handedness: rawAnswers.hand,
                    education: rawAnswers.education
                  };
                  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(challengerData))))
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');
                  const url = `${window.location.origin}/compare?challenger=${payload}`;
                  navigator.clipboard.writeText(url);
                  localStorage.setItem('myChallenge', payload);
                  trackEvent('compare_link_created');
                  setCopiedChallenge(true);
                  setTimeout(() => setCopiedChallenge(false), 2000);
                } catch (e) {
                  console.error('Failed to create challenge link', e);
                }
              }}
            >
              <div className="action-btn-glow" style={{ background: tierColor }} />
              <span className="relative z-10">{copiedChallenge ? '✅ ' + (t.HI ? 'लिंक कॉपी हो गया!' : 'Link copied!') : '🤝 ' + t.result.actions.challenge}</span>
            </button>
          )}

          {!isEmbed && (
            <Link to="/leaderboard" className="w-full sm:w-auto flex-1 action-btn action-btn-secondary flex items-center justify-center">
              🏆 {t.nav.leaderboard.split(' ')[1]}
            </Link>
          )}
        </section>

        <div className="result-nav-links" style={{ marginTop: '2.5rem' }}>
          <Link to={`/quiz${isEmbed ? '?embed=true' : ''}`} className="result-nav-link">
            {t.nav.retake}
          </Link>
          {!isEmbed && (
            <Link to="/" className="result-nav-link">
              🏠 {t.nav.home}
            </Link>
          )}
        </div>

        {isUniverse && !isEmbed && (
          <div className="cosmic-disclaimer">
            <p>{t.result.cosmicDisclaimer}</p>
          </div>
        )}
        
        {isEmbed && (
          <div className="text-center pt-8 pb-4 z-10 relative mt-4">
            <a href="https://earthranker.himanshurajak.in" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/60 text-xs font-medium transition-colors">
              {t.poweredBy}
            </a>
          </div>
        )}

      </div>

      {showModal && (
        <div className="leaderboard-modal-overlay">
          <div className="leaderboard-modal">
            <h3 dangerouslySetInnerHTML={{ __html: t.result.modal.title }} />
            <p>{t.result.modal.sub}</p>
            <form onSubmit={submitToLeaderboard} className="modal-form">
              <input 
                type="text" 
                maxLength={20}
                placeholder={t.result.modal.placeholder} 
                value={modalName} 
                onChange={e => setModalName(e.target.value)}
                autoFocus
                required
              />
              <div className="modal-actions">
                <button type="submit" className="modal-btn submit" disabled={isSubmitting || submitSuccess}>
                  {submitSuccess ? t.result.modal.success : isSubmitting ? t.result.modal.uploading : t.result.modal.submit}
                </button>
                <button type="button" className="modal-btn cancel" onClick={() => setShowModal(false)}>
                  {t.result.modal.skip}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
    {!isEmbed && <Footer />}
    </>
  );
}
