import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { calculateScore, TIERS } from '../data/rarityData';
import { famousProfiles } from '../data/famousProfiles';
import { upsertEntry } from './Leaderboard';
import { generateStoryKey } from '../utils/storyGenerator';
import { generateAIStory } from '../utils/groqStory';
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
function downloadScoreCard({ oneIn, rarityTier, tierEmoji, tierColor, score, t }) {
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

  // ── UNIQUE.COM logo text ────────────────────────────────────────────
  ctx.font         = 'bold 52px "Space Grotesk", "Arial", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'alphabetic';
  // Purple glow
  ctx.shadowColor  = '#8B5CF6';
  ctx.shadowBlur   = 24;
  ctx.fillStyle    = '#A78BFA';
  ctx.fillText('UNIQUE.COM', SIZE/2, 130);
  ctx.shadowBlur   = 0;

  // ── Thin divider under logo ─────────────────────────────────────────
  ctx.strokeStyle = 'rgba(139,92,246,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIZE/2 - 180, 155);
  ctx.lineTo(SIZE/2 + 180, 155);
  ctx.stroke();

  // ── "You are" label ─────────────────────────────────────────────────
  ctx.font      = '400 36px "Inter", "Arial", sans-serif';
  ctx.fillStyle = 'rgba(200,200,230,0.7)';
  ctx.fillText(t.result.youAre, SIZE/2, 240);

  // ── '1 in' prefix ───────────────────────────────────────────────────
  ctx.font      = '700 68px "Space Grotesk", "Arial", sans-serif';
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText(t.result.oneIn, SIZE/2, 330);

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
  ctx.fillText(numStr, SIZE/2, 530);
  ctx.shadowBlur   = 0;

  // ── Tier emoji (drawn as text) ───────────────────────────────────────
  ctx.font         = '120px serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle    = '#ffffff';
  ctx.shadowColor  = tierColor;
  ctx.shadowBlur   = 30;
  ctx.fillText(tierEmoji, SIZE/2, 680);
  ctx.shadowBlur   = 0;

  // ── Tier name pill background ────────────────────────────────────────
  const pillW = 320, pillH = 72, pillX = SIZE/2 - pillW/2, pillY = 710;
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
  ctx.fillText(`${t.result.rarityScore}: ${score} / 100`, SIZE/2, 850);

  // ── Bottom divider ───────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(139,92,246,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIZE/2 - 200, 890);
  ctx.lineTo(SIZE/2 + 200, 890);
  ctx.stroke();

  // ── Website URL ──────────────────────────────────────────────────────
  ctx.font      = '500 32px "Inter", "Arial", sans-serif';
  ctx.fillStyle = 'rgba(167,139,250,0.85)';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('unique.com', SIZE/2, 960);

  // ── Bottom color stripe ──────────────────────────────────────────────
  ctx.fillStyle = stripe;
  ctx.fillRect(0, SIZE - 5, SIZE, 5);

  // ── Trigger download ─────────────────────────────────────────────────
  const link = document.createElement('a');
  link.download = 'unique-score-card.png';
  link.href     = canvas.toDataURL('image/png');
  link.click();
}

/* Canvas Certificate generator */
function downloadCertificate({ name, oneIn, rarityTier, tierColor, t }) {
  const W = 1920;
  const H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Background
  ctx.fillStyle = '#050515'; // Dark navy
  ctx.fillRect(0, 0, W, H);

  // 2. Decorative Border
  const pad = 60;
  ctx.strokeStyle = '#6C47FF'; // Purple border
  ctx.lineWidth = 8;
  ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

  // Corner Ornaments
  ctx.lineWidth = 4;
  const drawOrnament = (x, y, rot) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(15, 15, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };
  drawOrnament(pad + 20, pad + 20, 0);
  drawOrnament(W - pad - 20, pad + 20, Math.PI / 2);
  drawOrnament(W - pad - 20, H - pad - 20, Math.PI);
  drawOrnament(pad + 20, H - pad - 20, -Math.PI / 2);

  // 3. Header
  ctx.textAlign = 'center';
  const goldGrad = ctx.createLinearGradient(0, 150, 0, 250);
  goldGrad.addColorStop(0, '#D4AF37');
  goldGrad.addColorStop(0.5, '#FFD700');
  goldGrad.addColorStop(1, '#B8860B');
  
  ctx.font = 'bold 80px "Space Grotesk", sans-serif';
  ctx.fillStyle = goldGrad;
  ctx.letterSpacing = '12px';
  ctx.fillText('CERTIFICATE OF RARITY', W / 2, 220);

  // 4. Certification Text
  ctx.font = 'italic 48px Georgia, serif';
  ctx.fillStyle = '#E2E8F0';
  ctx.letterSpacing = 'normal';
  ctx.fillText(`This certifies that ${name || 'a unique individual'}`, W / 2, 340);
  ctx.fillText('is among the rarest humans on Earth', W / 2, 410);

  // 5. Massive 1-in-X Number
  const numText = `1 in ${oneIn.toLocaleString('en-US')}`;
  const numGrad = ctx.createLinearGradient(W/2 - 400, 0, W/2 + 400, 0);
  numGrad.addColorStop(0, '#A855F7');
  numGrad.addColorStop(1, '#FF6B6B');
  
  ctx.font = 'black 180px "Space Grotesk", sans-serif';
  ctx.fillStyle = numGrad;
  ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
  ctx.shadowBlur = 50;
  ctx.fillText(numText, W / 2, 620);
  ctx.shadowBlur = 0;

  // 6. Tier Hexagon Badge
  const hexX = W / 2;
  const hexY = 780;
  const hexSize = 80;
  ctx.fillStyle = tierColor;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = hexX + hexSize * Math.cos(angle);
    const y = hexY + hexSize * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  
  ctx.font = 'bold 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(rarityTier.toUpperCase(), hexX, hexY + 12);

  // 7. Footer Details
  ctx.font = '400 24px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  
  // Date
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.textAlign = 'left';
  ctx.fillText(`Issued: ${today}`, pad + 40, H - pad - 40);

  // Branding
  ctx.textAlign = 'center';
  ctx.font = 'bold 32px "Space Grotesk", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText('Unique.com', W / 2, H - pad - 45);

  // Footnote
  ctx.font = '400 18px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('Based on world population of 8.28 billion — March 2026', W / 2, H - pad - 15);

  // ID
  const certId = Math.random().toString(16).substr(2, 8).toUpperCase();
  ctx.textAlign = 'right';
  ctx.font = '400 24px "Inter", sans-serif';
  ctx.fillText(`Cert ID: #${certId}`, W - pad - 40, H - pad - 40);

  // Download
  const link = document.createElement('a');
  link.download = 'unique-certificate.png';
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

/* Famous Compare Section */
function FamousCompareSection() {
  const { t } = useTranslation();
  const [person, setPerson] = useState(null);
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  function rollRandomPerson() {
    setIsRolling(true);
    setTimeout(() => {
      // Pick a random person different from current (if any)
      const available = person ? famousProfiles.filter(p => p.name !== person.name) : famousProfiles;
      const pick = available[Math.floor(Math.random() * available.length)];
      setPerson(pick);
      
      // Calculate their rarity
      const data = calculateScore(pick.traits);
      setResult(data);
      setIsRolling(false);
    }, 400); // Small delay for UX
  }

  if (!person || !result) {
    return (
      <section className="famous-section glass-card">
        <h2 className="result-section-title">{t.result.famous.title}</h2>
        <p className="result-section-sub">{t.result.famous.sub}</p>
        <button className="famous-btn" onClick={rollRandomPerson}>
          {t.result.famous.btn}
        </button>
      </section>
    );
  }

  return (
    <section className="famous-section glass-card">
      <div className="famous-header">
        <h2 className="result-section-title">{t.result.famous.title}</h2>
        <button className="famous-shuffle-btn" onClick={rollRandomPerson} disabled={isRolling}>
          {isRolling ? '...' : t.result.famous.shuffle}
        </button>
      </div>

      <div className={`famous-card ${isRolling ? 'famous-rolling' : ''}`}>
        <div className="famous-profile">
          <div className="famous-emoji">{person.emoji}</div>
          <div className="famous-details">
            <h3>{person.name}</h3>
            <p className="famous-fact">{person.fact}</p>
          </div>
        </div>

        <div className="famous-stats">
          <div className="famous-stat-row">
            <span className="famous-stat-label">{t.result.famous.tierLabel}</span>
            <span className="famous-stat-value" style={{ color: result.tierColor }}>
              {result.tierEmoji} {t.tiers[result.rarityTier] || result.rarityTier}
            </span>
          </div>
          <div className="famous-stat-row">
            <span className="famous-stat-label">{t.result.famous.oneInLabel}</span>
            <span className="famous-stat-value">
              {result.oneIn.toLocaleString('en-US')}
            </span>
          </div>
        </div>

        <div className="famous-conclusion" style={{ background: `${result.tierColor}20`, borderLeft: `4px solid ${result.tierColor}` }}>
          {t.result.famous.conclusion.replace('{name}', person.name).split('{tier}')[0]}<strong>{t.tiers[result.rarityTier] || result.rarityTier}</strong>{t.result.famous.conclusion.replace('{name}', person.name).split('{tier}')[1]}
        </div>
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
  const { score, rarityTier, tierColor, tierEmoji, oneIn: baseOneIn, traitBreakdown } =
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
        name: rawAnswers.name,
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
      setAiStory(story);
      setIsTyping(true);
      trackEvent('ai_story_generated');
    } catch (error) {
      console.error('Groq Story Fallback:', error);
      // Fallback silently to rule-based story
      setAiStory('');
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
  const [modalName, setModalName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Cosmic Mode State
  const [isCosmic, setIsCosmic] = useState(false);

  const COSMIC_MULTIPLIER = 1250000;
  const oneIn = isCosmic ? Math.round(baseOneIn * COSMIC_MULTIPLIER) : baseOneIn;

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
  const currentTierData = isCosmic ? getCosmicTier(rarityTier) : { name: t.tiers[rarityTier] || rarityTier, emoji: tierEmoji };

  const hasBirthday = !!rawAnswers.bDay && !!rawAnswers.bMonth && !!rawAnswers.bYear;
  const birthdayTwinMonth = hasBirthday ? Math.round((isCosmic ? 10000000000000 : 8280000000) / 365.25) : 0;
  const birthdayTwinExact = hasBirthday ? Math.round((isCosmic ? 10000000000000 : 8280000000) / 365.25 / 60) : 0;

  // Staggered reveal & Modal popup
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    const m = setTimeout(() => { if (score > 0) setShowModal(true); }, 2800);
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
        oneIn: baseOneIn,
        country: rawAnswers.country || 'Global',
        topSkills: [...skillTraits].sort((a, b) => a.fraction - b.fraction).slice(0, 3).map(s => s.value),
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
      <main className={`result-page ${isCosmic ? 'result-page--cosmic' : ''}`}>

      {/* ── Decorative Earth / Planetary System ────────────────────── */}
      {!isCosmic ? (
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
                <span className="hero-1in-label">{t.result.oneIn}</span>
                <SlotCounter target={oneIn} className="hero-massive-count" />
              </div>
              
              <div className="hero-badge-wrap">
                <div className="floating-badge-premium" style={{ '--tierColor': tierColor }}>
                  <div className="badge-glow-pulse" />
                  <span className="badge-emoji-main">{currentTierData.emoji}</span>
                  <span className="badge-tier-name">{currentTierData.name}</span>
                </div>
              </div>
            </div>

            <p className="hero-premium-subtitle">
              {isCosmic ? t.result.oneInSubUniverse : t.result.oneInSubEarth}
            </p>

            {!isEmbed && (
              <div className="scale-toggle-premium mt-8">
                <span className={`scale-label ${!isCosmic ? 'active' : ''}`}>{t.result.scale.earth}</span>
                <button 
                  className={`scale-switch ${isCosmic ? 'active' : ''}`}
                  onClick={() => {
                    const newMode = !isCosmic;
                    setIsCosmic(newMode);
                    trackEvent('cosmic_mode_toggled', { mode: newMode ? 'cosmic' : 'earth' });
                  }}
                  aria-label="Toggle Cosmic Mode"
                >
                  <div className="scale-thumb"></div>
                </button>
                <span className={`scale-label ${isCosmic ? 'active' : ''}`}>{t.result.scale.universe}</span>
              </div>
            )}
          </div>
        </section>

        {/* ── STATS PILLS ROW ─────────────────────────────────────────────────── */}
        <section className="result-stats-pills">
           <div className="stat-pill-card" style={{ '--accentColor': tierColor }}>
              <div className="pill-accent-bar" />
              <div className="pill-content">
                <span className="pill-label">{t.result.rarityScore}</span>
                <span className="pill-value">{score}<span className="pill-max">/100</span></span>
              </div>
           </div>
           <div className="stat-pill-card" style={{ '--accentColor': tierColor }}>
              <div className="pill-accent-bar" />
              <div className="pill-content">
                <span className="pill-label">{t.result.topPercent}</span>
                <span className="pill-value">
                  {(1 / baseOneIn * 100) < 0.0001 ? '<0.0001%' : parseFloat((1 / baseOneIn * 100).toFixed(4)) + '%'}
                </span>
              </div>
           </div>
           <div className="stat-pill-card" style={{ '--accentColor': tierColor }}>
              <div className="pill-accent-bar" />
              <div className="pill-content">
                <span className="pill-label">{t.result.tierLabel}</span>
                <span className="pill-value tier-pill-name" style={{ color: tierColor }}>{currentTierData.name}</span>
              </div>
           </div>
        </section>

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
                  /* Fallback Rule-based Story */
                  t.result.story.messages[fallbackStoryKey] && t.result.story.messages[fallbackStoryKey].split('{name}').map((part, i) => (
                    <span key={i}>
                      {part}
                      {i === 0 && t.result.story.messages[fallbackStoryKey].includes('{name}') && (
                        <strong className="story-name-highlight" style={{ color: tierColor }}>
                          {rawAnswers.name || (t.HI ? 'आप' : 'You')}
                        </strong>
                      )}
                    </span>
                  ))
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
            <p className="result-section-sub">{isCosmic ? t.result.birthday.subUniverse : t.result.birthday.subEarth}</p>
            <div className="birthday-stats-row">
              <div className="birthday-stat-pill teal">
                <span className="bday-num"><SlotCounter target={birthdayTwinMonth} className="bday-slot" /></span>
                <span className="bday-label">{isCosmic ? t.result.birthday.monthShareUniverse : t.result.birthday.monthShareEarth} {t.result.birthday.monthShareText}</span>
              </div>
              <div className="birthday-stat-pill coral">
                <span className="bday-num"><SlotCounter target={birthdayTwinExact} className="bday-slot" /></span>
                <span className="bday-label">{isCosmic ? t.result.birthday.exactShareUniverse : t.result.birthday.exactShareEarth} {t.result.birthday.exactShareText}</span>
              </div>
            </div>
          </section>
        )}

        {/* ── Famous Person Comparison ──────────────────────────────── */}
        <FamousCompareSection />

        {/* ── Daily Fact ─────────────────────────────────────────── */}
        <DailyFact />

        {/* ── Action Buttons (Equal Width Row) ────────────────────── */}
        <section className="result-actions-row">
          <button
            className={`action-btn action-btn-secondary ${downloading ? 'busy' : ''}`}
            onClick={async () => {
              setDownloading(true);
              await document.fonts.ready;
              requestAnimationFrame(() => {
                downloadScoreCard({ oneIn, rarityTier, tierEmoji, tierColor, score, t });
                setDownloading(false);
              });
            }}
          >
            {downloading ? '⏳ ' + t.result.share.generating : '⬇️ ' + t.result.share.download}
          </button>

          <button
            className="action-btn action-btn-secondary"
            onClick={async () => {
              await document.fonts.ready;
              downloadCertificate({ 
                name: rawAnswers.name, 
                oneIn, 
                rarityTier, 
                tierColor, 
                t 
              });
              trackEvent('certificate_downloaded');
            }}
          >
            🏅 {t.HI ? 'प्रमाणपत्र डाउनलोड करें' : 'Download Certificate'}
          </button>

          {!isEmbed && (
            <button
              className="action-btn action-btn-primary"
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
                  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(challengerData))));
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
              <span className="relative z-10">{copiedChallenge ? '✅ ' + (t.HI ? 'लिंक कॉपी हो गया!' : 'Link copied!') : '⚔️ ' + t.result.actions.challenge}</span>
            </button>
          )}

          {!isEmbed && (
            <Link to="/leaderboard" className="action-btn action-btn-secondary">
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

        {isCosmic && !isEmbed && (
          <div className="cosmic-disclaimer">
            <p>{t.result.cosmicDisclaimer}</p>
          </div>
        )}
        
        {isEmbed && (
          <div className="text-center pt-8 pb-4 z-10 relative mt-4">
            <a href="https://unique.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/60 text-xs font-medium transition-colors">
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
