import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import { calculateScore, TIERS } from '../data/rarityData';
import { trackEvent } from '../utils/analytics';
import { 
  HANDEDNESS, EYE_COLORS, BLOOD_TYPES, SKILL_CATEGORIES,
  OptionGrid, SkillsSelection 
} from './Quiz';

const AGE_GROUPS = ['Under 18', '18–24', '25–34', '35–49', '50+'];

// Condensed list of 15 impactful skills
const CONDENSED_SKILLS = [
  '🏊 Swimming', '🤸 Gymnastics', '🥊 Martial Arts', '🤿 Scuba Diving', '🪂 Skydiving',
  '💻 Programming/Coding', '📈 Trading/Investing', '✈️ Flying a Plane', '⚕️ Medical Training', '🤖 AI/Machine Learning',
  '🎨 Painting/Drawing', '🎵 Playing Instrument', '✍️ Writing/Authoring', '🌱 Farming/Agriculture', '⚖️ Legal Knowledge'
];

function Confetti() {
  const pieces = Array.from({ length: 50 });
  const colors = ['#A855F7', '#FF6B6B', '#00D4AA', '#FFD700', '#3B82F6'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-confetti-fall"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            opacity: 0.8,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const [challenger, setChallenger] = useState(null);
  const [myAnswers, setMyAnswers] = useState({
    ageGroup: '', handedness: '', bloodType: '', eyeColor: '', skills: []
  });
  const [myResult, setMyResult] = useState(null);
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  // 1. Decode challenger data
  useEffect(() => {
    const challengerParam = searchParams.get('challenger');
    if (challengerParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(challengerParam))));
        setChallenger(decoded);
      } catch (err) {
        console.error("Failed to decode challenger data", err);
      }
    }
  }, [searchParams]);

  const handleFinish = () => {
    // Only use the 5 traits from mini-quiz
    const result = calculateScore(myAnswers);
    setMyResult(result);
    setShowConfetti(true);
  };

  const shareToWhatsApp = () => {
    trackEvent('share_clicked', { platform: 'whatsapp' });
    const text = `I just compared my rarity with ${challenger.displayName}! 
${challenger.displayName}: ${challenger.score}/100 (${challenger.tier})
Me: ${myResult.score}/100 (${myResult.rarityTier})
Find out how rare you are at ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  if (!challenger) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="text-8xl">🤔</div>
          <h1 className="text-3xl font-heading font-bold">No challenge link found</h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Ask a friend to share their challenge link, or take the quiz first to create your own.
          </p>
          <Link 
            to="/quiz" 
            className="block w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-lg hover:scale-[1.02] transition-transform"
          >
            Take the Quiz →
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const getWinnerMessage = () => {
    const diff = myResult.score - challenger.score;
    if (Math.abs(diff) <= 5) return "It's an incredibly close match! 🤝";
    if (diff > 5) return "You are rarer! 🏆";
    return `${challenger.displayName} is rarer! 🏆`;
  };

  const renderCard = (data, label, isChallenger = false) => {
    const tierColor = data.tierColor || TIERS.find(t => t.name === data.tier)?.color || '#A855F7';
    const tierEmoji = data.tierEmoji || TIERS.find(t => t.name === (data.tier || data.rarityTier))?.emoji || '💎';
    
    return (
      <div className="flex-1 flex flex-col gap-4 animate-fade-in">
        <div className="text-xs uppercase tracking-widest text-white/40 font-bold text-center">{label}</div>
        <div className="glass-card p-8 flex flex-col items-center relative border-white/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: tierColor }} />
          
          <h3 className="text-xl font-heading font-bold mb-6">{isChallenger ? data.displayName : (t.HI ? 'आप' : 'You')}</h3>
          
          <div className="text-6xl mb-4 drop-shadow-2xl" style={{ filter: `drop-shadow(0 0 15px ${tierColor}60)` }}>
            {tierEmoji}
          </div>
          
          <div className="text-sm font-heading font-black uppercase tracking-tighter mb-4" style={{ color: tierColor }}>
            {data.tier || data.rarityTier}
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-heading font-black tracking-tighter">
              1 in {data.oneIn.toLocaleString('en-US')}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">people on earth</div>
          </div>

          <div className="w-full flex justify-between items-center py-3 border-y border-white/5 mb-6">
            <span className="text-xs text-white/40 uppercase font-bold tracking-widest">Score</span>
            <span className="text-2xl font-heading font-black">{data.score}<span className="text-xs text-white/30">/100</span></span>
          </div>

          <div className="w-full">
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Top Skills</div>
            <div className="flex flex-wrap gap-2">
              {(isChallenger ? data.topSkills : data.traitBreakdown.filter(t => t.isSkill).map(s => s.value)).slice(0, 3).map(skill => (
                <span key={skill} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 whitespace-nowrap">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <main className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-8">
        {showConfetti && <Confetti />}
        
        <div className="max-w-[1100px] mx-auto">
          {myResult ? (
            <div className="space-y-12">
              <div className="text-center space-y-4 animate-fade-in">
                <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tighter bg-gradient-to-r from-purple-400 to-coral-400 bg-clip-text text-transparent">
                  {getWinnerMessage()}
                </h1>
                <p className="text-white/60 text-lg">Comparison Results</p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                {renderCard(challenger, "👤 Their Result", true)}
                <div className="flex items-center justify-center text-2xl font-heading italic opacity-20">VS</div>
                {renderCard(myResult, "👤 Your Result")}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button 
                  onClick={shareToWhatsApp}
                  className="px-10 py-4 rounded-2xl bg-green-600 font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  Share My Result 📱
                </button>
                <Link to="/quiz" className="px-10 py-4 rounded-2xl bg-white/10 border border-white/10 font-bold hover:bg-white/20 transition-colors text-center">
                  Retake Quiz
                </Link>
                <Link to="/leaderboard" className="px-10 py-4 rounded-2xl bg-white/10 border border-white/10 font-bold hover:bg-white/20 transition-colors text-center">
                  View Leaderboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Challenger View */}
              <div className="w-full lg:w-[400px] sticky top-12">
                {renderCard(challenger, "👤 Their Result", true)}
              </div>

              {/* Your Turn Mini-Quiz */}
              <div className="flex-1 w-full space-y-8">
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold text-center lg:text-left">👤 Your Turn</div>
                <div className="glass-card p-8 sm:p-12 border-purple-500/20 shadow-[0_0_50px_rgba(108,71,255,0.1)]">
                  <div className="flex gap-2 mb-12">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-purple-500' : 'bg-white/10'}`} />
                    ))}
                  </div>

                  <div className="min-h-[300px]">
                    {step === 1 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-heading font-bold">What is your age group?</h2>
                        <OptionGrid 
                          options={AGE_GROUPS} 
                          value={myAnswers.ageGroup} 
                          onChange={v => { setMyAnswers({...myAnswers, ageGroup: v}); setStep(2); }} 
                        />
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-heading font-bold">Which hand do you use?</h2>
                        <OptionGrid 
                          options={HANDEDNESS} 
                          value={myAnswers.handedness} 
                          onChange={v => { setMyAnswers({...myAnswers, handedness: v}); setStep(3); }} 
                        />
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-heading font-bold">What is your blood type?</h2>
                        <OptionGrid 
                          options={BLOOD_TYPES} 
                          value={myAnswers.bloodType} 
                          onChange={v => { setMyAnswers({...myAnswers, bloodType: v}); setStep(4); }} 
                          cols={3}
                        />
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-heading font-bold">What color are your eyes?</h2>
                        <OptionGrid 
                          options={EYE_COLORS} 
                          value={myAnswers.eyeColor} 
                          onChange={v => { setMyAnswers({...myAnswers, eyeColor: v}); setStep(5); }} 
                          cols={3}
                        />
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-heading font-bold">Pick your top 3 skills</h2>
                        <p className="text-sm text-white/40 mb-4">Choose from our most impactful traits</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {CONDENSED_SKILLS.map(skill => {
                            const isSelected = myAnswers.skills.includes(skill);
                            return (
                              <button
                                key={skill}
                                className={`p-3 rounded-xl border text-sm text-left transition-all ${isSelected ? 'bg-purple-600/20 border-purple-500' : 'bg-white/5 border-white/10'}`}
                                onClick={() => {
                                  if (isSelected) {
                                    setMyAnswers({...myAnswers, skills: myAnswers.skills.filter(s => s !== skill)});
                                  } else if (myAnswers.skills.length < 3) {
                                    setMyAnswers({...myAnswers, skills: [...myAnswers.skills, skill]});
                                  }
                                }}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                        <button 
                          disabled={myAnswers.skills.length < 1}
                          onClick={handleFinish}
                          className={`w-full py-5 rounded-2xl font-heading font-black text-xl mt-8 transition-all ${myAnswers.skills.length >= 1 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_10px_40px_rgba(108,71,255,0.3)]' : 'bg-white/10 opacity-50 cursor-not-allowed'}`}
                        >
                          Calculate My Score ✨
                        </button>
                      </div>
                    )}
                  </div>

                  {step > 1 && !myResult && (
                    <button onClick={() => setStep(step - 1)} className="mt-8 text-white/40 hover:text-white text-xs uppercase tracking-widest font-bold">
                      ← Go Back
                    </button>
                  )}
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
