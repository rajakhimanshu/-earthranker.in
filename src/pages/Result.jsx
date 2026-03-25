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

/* Shorthand for astronomical numbers */
function formatLargeNumber(num) {
  if (num < 1000000) return num.toLocaleString('en-US');
  
  const units = [
    { value: 1e18, label: 'Quintillion' },
    { value: 1e15, label: 'Quadrillion' },
    { value: 1e12, label: 'Trillion' },
    { value: 1e9,  label: 'Billion' },
    { value: 1e6,  label: 'Million' },
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const val = num / unit.value;
      // If it's a clean integer, don't show .00
      const formatted = Number.isInteger(val) ? val.toString() : val.toFixed(2);
      return `${formatted} ${unit.label}`;
    }
  }
  return num.toLocaleString('en-US');
}

/* Slot machine counter */
function SlotCounter({ target, className = '' }) {
  const [display, setDisplay] = useState(1);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!target || target <= 1) { 
      setDisplay(target || 1); 
      return; 
    }

    const DURATION = 1800; // 1.8 seconds
    const startValue = 1;
    const startTime = performance.now();
    
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const easedProgress = easeOut(progress);
      
      const currentVal = Math.floor(startValue + (target - startValue) * easedProgress);
      setDisplay(currentVal);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        // Trigger flash
        document.body.classList.add('result-flash');
        setTimeout(() => {
          document.body.classList.remove('result-flash');
        }, 300);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <span className={`slot-number ${className}`}>
      {display.toLocaleString('en-IN')}
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

  // Redesign tier color mapping
  const tierColorsRedesign = {
    'COMMON':    '#9CA3AF',
    'UNCOMMON':  '#4ADE80',
    'RARE':      '#60A5FA',
    'EPIC':      '#A855F7',
    'LEGENDARY': '#FBBF24',
    'MYTHIC':    '#FF6B9D'
  };
  const activeColor = tierColorsRedesign[rarityTier.toUpperCase()] || tierColor;

  // 1. Background (Radial Mesh)
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, SIZE, SIZE);

  const grad1 = ctx.createRadialGradient(SIZE * 0.3, SIZE * 0.4, 0, SIZE * 0.3, SIZE * 0.4, SIZE * 0.55);
  grad1.addColorStop(0, 'rgba(108, 71, 255, 0.18)');
  grad1.addColorStop(1, 'transparent');
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const grad2 = ctx.createRadialGradient(SIZE * 0.7, SIZE * 0.7, 0, SIZE * 0.7, SIZE * 0.7, SIZE * 0.5);
  grad2.addColorStop(0, 'rgba(0, 212, 170, 0.12)');
  grad2.addColorStop(1, 'transparent');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 2. EARTH RANKER (Gradient Title)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 52px "Space Grotesk"';
  ctx.letterSpacing = '6px';
  const titleGrad = ctx.createLinearGradient(SIZE / 2 - 200, 0, SIZE / 2 + 200, 0);
  titleGrad.addColorStop(0, '#6C47FF');
  titleGrad.addColorStop(1, '#FF6B6B');
  ctx.fillStyle = titleGrad;
  ctx.fillText('EARTH RANKER', SIZE / 2, 130);

  // 3. User Name
  if (name) {
    ctx.font = '500 32px "Inter"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(name.toUpperCase(), SIZE / 2, 185);
  }

  // Divider
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - 180, 205);
  ctx.lineTo(SIZE / 2 + 180, 205);
  ctx.stroke();

  // "You are" & "1 in"
  ctx.font = '400 36px "Inter"';
  ctx.fillStyle = 'rgba(200, 200, 230, 0.7)';
  ctx.fillText(t.result.youAre, SIZE / 2, 280);

  ctx.font = '700 68px "Space Grotesk"';
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText(t.result.oneIn, SIZE / 2, 370);

  // 4. Large Rarity Number (With Glow)
  const numStr = oneIn.toLocaleString('en-US');
  let fontSize = 200;
  ctx.font = `900 ${fontSize}px "Space Grotesk"`;
  while (ctx.measureText(numStr).width > SIZE - 80 && fontSize > 60) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize}px "Space Grotesk"`;
  }

  ctx.save();
  ctx.shadowColor = activeColor + '99'; // ~0.6 opacity
  ctx.shadowBlur = 40;
  
  const goldGrad = ctx.createLinearGradient(SIZE / 2 - 300, 0, SIZE / 2 + 300, 0);
  goldGrad.addColorStop(0, '#B8860B');
  goldGrad.addColorStop(0.25, '#FFD700');
  goldGrad.addColorStop(0.5, '#FFF8DC');
  goldGrad.addColorStop(0.75, '#FFD700');
  goldGrad.addColorStop(1, '#B8860B');
  ctx.fillStyle = goldGrad;
  ctx.fillText(numStr, SIZE / 2, 570);
  ctx.restore();

  // 5. Tier Emoji
  ctx.font = '120px serif';
  ctx.fillText(tierEmoji, SIZE / 2, 720);

  // 6. Glowing Tier Pill
  const pillW = 360, pillH = 80, pillX = SIZE / 2 - pillW / 2, pillY = 760;
  ctx.save();
  ctx.shadowColor = activeColor + '80'; // 0.5 opacity
  ctx.shadowBlur = 24;
  
  const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
  pillGrad.addColorStop(0, activeColor + '88'); // Darker version
  pillGrad.addColorStop(1, activeColor);
  ctx.fillStyle = pillGrad;
  
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 40);
    ctx.fill();
    ctx.strokeStyle = activeColor + '66'; // 0.4 opacity
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillRect(pillX, pillY, pillW, pillH);
  }
  ctx.restore();

  ctx.font = '800 44px "Space Grotesk"';
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '0.12em';
  ctx.fillText(rarityTier.toUpperCase(), SIZE / 2, pillY + pillH / 2);
  ctx.letterSpacing = '0px';

  // 7. Rarity Score Pill
  const sW = 300, sH = 44, sX = SIZE / 2 - sW / 2, sY = 865;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(sX, sY, sW, sH, 22);
    ctx.stroke();
  }
  ctx.font = '400 24px "Inter"'; 
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText(`${t.result.rarityScore}: ${score} / 100`, SIZE / 2, sY + sH / 2 + 2);

  // 8. Footer URL
  ctx.font = '500 24px "Inter"';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillText('earthranker.himanshurajak.in', SIZE / 2, 1000);

  // Trigger download
  const link = document.createElement('a');
  link.download = 'earthranker-score-card.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* Canvas Certificate generator */
function downloadCertificate({ name, age, oneIn, rarityTier, tierColor, t, traitBreakdown }) {
  const S = 1440; 
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');

  // 1. Background & Radial Overlay
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, S, S);

  const bgGrad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.7);
  bgGrad.addColorStop(0, 'rgba(108, 71, 255, 0.08)');
  bgGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, S, S);

  // 2. Double-Layered Glow Border
  const pad = 80;
  ctx.save();
  ctx.strokeStyle = 'rgba(108, 71, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(108, 71, 255, 0.25)';
  ctx.shadowBlur = 60;
  ctx.strokeRect(pad, pad, S - pad * 2, S - pad * 2);
  
  // Inner glow (simulated)
  ctx.shadowColor = 'rgba(108, 71, 255, 0.08)';
  ctx.shadowBlur = 40;
  ctx.strokeRect(pad + 2, pad + 2, S - (pad + 2) * 2, S - (pad + 2) * 2);
  ctx.restore();

  // 3. Header
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 44px "Space Grotesk"';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.letterSpacing = '0.25em';
  ctx.fillText('EARTH RANKER', S / 2, pad + 120);
  ctx.letterSpacing = '0px';

  ctx.font = 'bold 90px "Space Grotesk"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CERTIFICATE OF RARITY', S / 2, pad + 240);

  // 4. Main Content
  ctx.font = '400 42px "Inter"';
  ctx.fillStyle = '#ffffff70';
  ctx.fillText('This is to certify that', S / 2, S / 2 - 180);

  ctx.font = '900 130px "Space Grotesk"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText((name || 'Unique Soul').toUpperCase(), S / 2, S / 2 - 60);

  if (age) {
    ctx.font = '600 36px "Inter"';
    ctx.fillStyle = tierColor;
    ctx.fillText(`AGE: ${age} YEARS`, S / 2, S / 2 + 10);
  }

  ctx.font = '400 42px "Inter"';
  ctx.fillStyle = '#ffffff70';
  ctx.fillText('is statistically ranked', S / 2, S / 2 + 80);

  // 5. Rarity Number (With Scaling - Clamp font size logic)
  const numText = `1 in ${oneIn.toLocaleString()}`;
  // Clamp(2.5rem, 10vw, 5rem) on 1440px canvas:
  // min 40px, ideal 144px, max 80px. So 80px is the target.
  let numFontSize = 80; 
  ctx.font = `900 ${numFontSize}px "Space Grotesk"`;
  while (ctx.measureText(numText).width > S - pad * 2 - 64 && numFontSize > 40) {
    numFontSize -= 2;
    ctx.font = `900 ${numFontSize}px "Space Grotesk"`;
  }

  const grad = ctx.createLinearGradient(S / 2 - 400, 0, S / 2 + 400, 0);
  grad.addColorStop(0, '#A855F7');
  grad.addColorStop(0.5, '#FF6B6B');
  grad.addColorStop(1, '#A855F7');
  ctx.fillStyle = grad;
  ctx.fillText(numText, S / 2, S / 2 + 240);

  ctx.font = 'bold 55px "Space Grotesk"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('PEOPLE ON EARTH', S / 2, S / 2 + 360);

  // 6. Stacked Badge & Date
  const bW = 450, bH = 90, bX = S / 2 - bW / 2, bY = S / 2 + 420;
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
  ctx.fillText(rarityTier.toUpperCase(), S / 2, bY + bH / 2);

  // Date below badge (8px gap visually, 40px in coordinate diff)
  ctx.font = '32px "Inter"';
  ctx.fillStyle = '#ffffff30';
  const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillText(`Issued on: ${dateStr}`, S / 2, bY + bH + 40);

  // 7. Footer URL
  ctx.font = 'bold 34px "Inter"';
  ctx.fillStyle = tierColor;
  ctx.fillText('earthranker.himanshurajak.in', S / 2, S - pad - 60);

  // Trigger download
  const link = document.createElement('a');
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
  let oneIn = isUniverse ? Math.round(oneInRaw * COSMIC_MULTIPLIER) : baseOneIn;
  
  // Cap at 100 Quintillion to prevent display breakdown
  if (isUniverse && oneIn > 1e20) {
    oneIn = 1e20;
  }

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
  
  // Real stats: ~385,000 born per day globally. 
  // "Birthday Twins" (alive today): Population / 365.25
  const birthdayTwinMonth = hasBirthday ? Math.round((isUniverse ? 10000000000000 : 8280000000) / 365.25) : 0;
  // "Exact Birth Cohort" (born same day): ~385k per day on Earth.
  const birthdayTwinExact = hasBirthday ? Math.round((isUniverse ? 385000 * 1250000 : 385000)) : 0;

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
      const entryId = crypto.randomUUID(); 

      // ── Ranking Logic Update ───────────────────────────────────────────
      // We use a high-precision weight to decide who is "actually better"
      // base: oneInRaw (the raw mathematical rarity)
      // bonus: number of skills (+10% per skill)
      const skillBonus = (rawAnswers.skills || []).length * 0.1;
      const rarityWeight = oneInRaw * (1 + skillBonus);

      await upsertEntry({
        id: entryId,
        sessionId,
        displayName: modalName.trim(),
        score,
        rarityWeight, // Precision sorting field
        tier: rarityTier,
        tierEmoji: tierEmoji || '',
        oneIn: baseOneIn,
        country: rawAnswers.country || 'Global',
        // Public trait showcase
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
    <div className="page-transition">
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
    </div>
  );
}
