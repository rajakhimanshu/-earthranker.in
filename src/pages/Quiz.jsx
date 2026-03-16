import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from '../contexts/LanguageContext';
import { trackEvent } from '../utils/analytics';
import './Quiz.css';

/* ─── Static Data ─────────────────────────────────────────────────── */
export const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Barbuda","Argentina",
  "Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados",
  "Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana",
  "Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon",
  "Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros",
  "Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Croatia","Cuba","Cyprus",
  "Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland",
  "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala",
  "Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia",
  "Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
  "Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya",
  "Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali",
  "Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco",
  "Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal",
  "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia",
  "Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru",
  "Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts & Nevis",
  "Saint Lucia","Saint Vincent & Grenadines","Samoa","San Marino","São Tomé & Príncipe",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia",
  "Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain",
  "Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan",
  "Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey",
  "Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe",
];

export const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];
export const EYE_COLORS  = ['Brown','Blue','Green','Hazel','Gray','Other'];
export const HAIR_COLORS = ['Black','Brown','Blonde','Red','White','Gray','Other'];

export const GENDERS = [
  { label: 'Male',              icon: '♂' },
  { label: 'Female',            icon: '♀' },
  { label: 'Non-binary',        icon: '⚧' },
  { label: 'Prefer not to say', icon: '·' },
];

export const HANDEDNESS = [
  { label: 'Right',          icon: '🤜' },
  { label: 'Left',           icon: '🤛' },
  { label: 'Ambidextrous',   icon: '🤲' },
];

export const EDUCATION = [
  'No formal schooling',
  'Primary school',
  'Secondary / High school',
  "Bachelor's degree",
  "Master's degree",
  'PhD / Doctorate',
];

/* ─── Sub-components ──────────────────────────────────────────────── */
export function OptionGrid({ options, value, onChange, cols = 2 }) {
  return (
    <div className="option-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map((opt) => {
        const label = typeof opt === 'string' ? opt : opt.label;
        const icon  = typeof opt === 'string' ? null : opt.icon;
        const active = value === label;
        return (
          <button
            key={label}
            type="button"
            className={`option-btn${active ? ' option-btn--active' : ''}`}
            onClick={() => onChange(label)}
          >
            {icon && <span className="option-btn__icon">{icon}</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function CountrySelect({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);
  const ref = useRef(null);

  const filtered = query
    ? COUNTRIES.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : COUNTRIES;

  function pick(country) {
    onChange(country);
    setQuery(country);
    setOpen(false);
  }

  return (
    <div className="country-select" ref={ref}>
      <div className="country-input-wrap">
        <span className="country-input-icon">🌍</span>
        <input
          className="country-input"
          placeholder="Search country…"
          value={query}
          onFocus={() => { setOpen(true); if (value && query === value) setQuery(''); }}
          onChange={e => { setQuery(e.target.value); setOpen(true); onChange(''); }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          autoComplete="off"
        />
        {value && <span className="country-check">✓</span>}
      </div>
      {open && filtered.length > 0 && (
        <ul className="country-dropdown">
          {filtered.slice(0, 80).map(c => (
            <li key={c}
                className={`country-item${value === c ? ' country-item--active' : ''}`}
                onMouseDown={() => pick(c)}>
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const SKILL_CATEGORIES = {
  'Physical Skills': [
    '🏊 Swimming', '🏇 Horse Riding', '🚗 Driving (Car)', '🏍️ Riding (Bike/Motorbike)',
    '🤸 Gymnastics', '🥊 Martial Arts', '🧗 Rock Climbing', '⛷️ Skiing/Snowboarding',
    '🤿 Scuba Diving', '🪂 Skydiving'
  ],
  'Technical Skills': [
    '💻 Programming/Coding', '📈 Trading/Investing', '✈️ Flying a Plane', '🔧 Mechanical Repair',
    '⚕️ Medical Training', '🎛️ Music Production', '🔬 Scientific Research', '🌐 Multiple Languages (3+)',
    '🤖 AI/Machine Learning', '🎮 Game Development'
  ],
  'Creative & Other': [
    '🎨 Painting/Drawing', '🎵 Playing Instrument', '📷 Photography', '✍️ Writing/Authoring',
    '🎭 Acting/Theatre', '🧁 Professional Cooking/Baking', '🪡 Tailoring/Fashion Design',
    '🌱 Farming/Agriculture', '⚖️ Legal Knowledge', '🕌 Religious Scholarship'
  ]
};

export function SkillsSelection({ selected = [], onChange }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Physical Skills');
  const categories = Object.keys(SKILL_CATEGORIES);
  const catLabels = {
    'Physical Skills': t.skillCats.physical,
    'Technical Skills': t.skillCats.technical,
    'Creative & Other': t.skillCats.creative
  };

  const toggleSkill = (skill) => {
    if (selected.includes(skill)) {
      onChange(selected.filter(s => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  return (
    <div className="skills-section">
      <div className="skills-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`skills-tab ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {catLabels[cat] || cat}
          </button>
        ))}
      </div>
      <div className="skills-grid">
        {SKILL_CATEGORIES[activeTab].map(skill => {
          const isSelected = selected.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              className={`skill-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleSkill(skill)}
            >
              <span className="skill-chip-text">{skill}</span>
              {isSelected && <span className="skill-chip-check">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step metadata ───────────────────────────────────────────────── */
const getSteps = (t) => [
  { id: 'age',       label: t?.quiz?.questions?.start?.title?.replace('.', '') || 'Start',          emoji: '🎂', isCore: true },
  { id: 'gender',    label: t?.quiz?.questions?.gender?.title?.replace('?', '') || 'Gender',       emoji: '🧬', isCore: true },
  { id: 'country',   label: t?.quiz?.questions?.country?.title?.replace('?', '') || 'Country',      emoji: '🌍', isCore: true },
  { id: 'education', label: t?.quiz?.questions?.education?.title?.replace('?', '') || 'Education',    emoji: '🎓', isCore: true },
  { id: 'hand',      label: t?.quiz?.questions?.hand?.title?.replace('?', '') || 'Handedness',   emoji: '✋', isOptional: true },
  { id: 'blood',     label: t?.quiz?.questions?.blood?.title?.replace('?', '') || 'Blood Type',   emoji: '🩸', isOptional: true },
  { id: 'traits',    label: t?.quiz?.questions?.traits?.title || 'Eye & Hair Color',       emoji: '👁️', isOptional: true },
  { id: 'skills',    label: t?.quiz?.questions?.skills?.title?.split(' ')[0] || 'Skills',       emoji: '⚡', isOptional: true },
  { id: 'birthday',  label: t?.quiz?.questions?.birthday?.title?.replace('?', '') || 'Birthday',     emoji: '🎉', isOptional: true },
];

/* ─── Main Component ──────────────────────────────────────────────── */
export default function Quiz() {
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const { t } = useTranslation();
  const [step, setStep]     = useState(0);
  const [dir,  setDir]      = useState('forward'); // for animation direction
  
  // Generate sessionId on quiz start
  useEffect(() => {
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', crypto.randomUUID());
    }
    trackEvent('quiz_started');
  }, []);
  const [animKey, setAnimKey] = useState(0);
  const [answers, setAnswers] = useState({
    name: '', age: '', gender: '', country: '', education: '',
    bDay: '', bMonth: '', bYear: '',
    hand: '', blood: '', eyeColor: '', hairColor: '',
    skills: []
  });
  const [errors, setErrors] = useState({});

  function set(field, val) {
    setAnswers(a => ({ ...a, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  }

  const STEPS = getSteps(t);

  /* Validation helpers */

  function validateCore() {
    const e = {};
    const age = Number(answers.age);
    if (!answers.age) e.age = t.quiz.errors.ageReq;
    else if (age < 13 || age > 100) e.age = t.quiz.errors.ageRange;
    if (!answers.gender) e.gender = t.quiz.errors.req;
    if (!answers.country) e.country = t.quiz.errors.countryReq;
    if (!answers.education) e.education = t.quiz.errors.eduReq;
    return Object.keys(e).length === 0;
  }

  // Check if we are doing core validation (steps 0-3) vs optional
  function validateStep(currentStep) {
    const e = {};
    if (currentStep === 0) {
      const age = Number(answers.age);
      if (!answers.age) e.age = t.quiz.errors.ageReq;
      else if (age < 13 || age > 100) e.age = t.quiz.errors.ageRange;
    }
    if (currentStep === 1 && !answers.gender)   e.gender    = t.quiz.errors.req;
    if (currentStep === 2 && !answers.country)  e.country   = t.quiz.errors.countryReq;
    if (currentStep === 3 && !answers.education) e.education = t.quiz.errors.eduReq;
    
    // If they fill out parts of a step but leave others blank, prompt them. Otherwise, let them skip via the skip button.
    if (currentStep === 6 && (answers.eyeColor || answers.hairColor) && !(answers.eyeColor && answers.hairColor)) {
      if (!answers.eyeColor) e.eyeColor = t.quiz.errors.eyeReq;
      if (!answers.hairColor) e.hairColor = t.quiz.errors.hairReq;
    }
    
    if (currentStep === 8 && (answers.bDay || answers.bMonth || answers.bYear)) {
      if (!answers.bDay || !answers.bMonth || !answers.bYear) e.birthday = t.quiz.errors.bdayReq;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (!validateStep(step)) return;
    if (step < STEPS.length - 1) {
      setDir('forward');
      setAnimKey(k => k + 1);
      setStep(s => s + 1);
    }
  }

  function skip() {
    if (step < STEPS.length - 1) {
      setDir('forward');
      setAnimKey(k => k + 1);
      setStep(s => s + 1);
    }
  }

  function back() {
    if (step > 0) {
      setDir('back');
      setAnimKey(k => k + 1);
      setStep(s => s - 1);
    }
  }

  function finish() {
    // If they finish early, just ensure core is valid
    if (!validateCore()) return;
    navigate(`/result${isEmbed ? '?embed=true' : ''}`, { state: { answers } });
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const isLast   = step === STEPS.length - 1;

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        // If current step is valid, move to next
        if (validateStep(step)) {
          // Prevent default form submission to avoid double-triggers in inputs
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            e.preventDefault();
          }
          if (isLast) finish();
          else handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, answers, isLast, finish, handleNext, validateStep]);

  return (
    <>
      <div className={`quiz-page ${isEmbed ? 'quiz-page--embed' : ''}`}>
      {/* ── Top bar ───────── */}
      {!isEmbed && (
        <header className="quiz-header">
          <Link to="/" className="quiz-back-link">{t.quiz.back}</Link>
          <div className="quiz-header-steps">
            {STEPS.map((s, i) => (
              <div key={s.id}
                   className={`quiz-step-dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
                   title={s.label} />
            ))}
          </div>
          <span className="quiz-step-counter">{step + 1} / {STEPS.length}</span>
        </header>
      )}

      {/* ── Progress bar ─── */}
      <div className="quiz-progress-track">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Card ────────────────────────────────────────────── */}
      <div className="quiz-card-wrap">
        <form 
          key={animKey} 
          className={`quiz-card quiz-card--${dir}`}
          onSubmit={(e) => {
            e.preventDefault();
            if (isLast) finish();
            else handleNext();
          }}
        >
          {/* Step label */}
          <div className="quiz-eyebrow">
            <span className="quiz-step-emoji">{STEPS[step].emoji}</span>
            {STEPS[step].isCore ? t.quiz.coreStats : t.quiz.bonusStats} — {STEPS[step].label}
          </div>

          {/* ── STEP CONTENT ────────────────────────────────── */}

          {/* Step 1 — Age and Optional Name */}
          {step === 0 && (
            <div className="quiz-field">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#4ADE80] uppercase tracking-wider">
                ⏱️ {t.quiz.takesTime}
              </div>
              <h2 className="quiz-question">{t.quiz.questions.start.title}</h2>
              <p  className="quiz-hint">{t.quiz.questions.start.hint}</p>
              
              <div className="flex flex-col gap-4">
                <div className="age-input-wrap">
                  <input
                    type="number"
                    className={`age-input${errors.age ? ' input--error' : ''}`}
                    placeholder={t.quiz.questions.start.agePlaceholder}
                    min={13} max={100}
                    value={answers.age}
                    onChange={e => set('age', e.target.value)}
                    autoFocus
                  />
                  <span className="age-unit">{t.quiz.questions.start.ageUnit}</span>
                </div>
              </div>
              {errors.age && <p className="field-error">{errors.age}</p>}
            </div>
          )}

          {/* Step 2 — Gender */}
          {step === 1 && (
            <div className="quiz-field">
              <h2 className="quiz-question">{t.quiz.questions.gender.title}</h2>
              <p  className="quiz-hint">{t.quiz.questions.gender.hint}</p>
              <OptionGrid options={GENDERS} value={answers.gender} onChange={v => set('gender', v)} cols={2} />
              {errors.gender && <p className="field-error">{errors.gender}</p>}
            </div>
          )}

          {/* Step 3 — Country */}
          {step === 2 && (
            <div className="quiz-field">
              <h2 className="quiz-question">{t.quiz.questions.country.title}</h2>
              <p  className="quiz-hint">{t.quiz.questions.country.hint}</p>
              <CountrySelect value={answers.country} onChange={v => set('country', v)} />
              {errors.country && <p className="field-error">{errors.country}</p>}
            </div>
          )}

          {/* Step 4 — Education */}
          {step === 3 && (
            <div className="quiz-field">
              <h2 className="quiz-question">{t.quiz.questions.education.title}</h2>
              <p  className="quiz-hint">{t.quiz.questions.education.hint}</p>
              <div className="select-wrap">
                <select
                  className={`styled-select${errors.education ? ' input--error' : ''}`}
                  value={answers.education}
                  onChange={e => set('education', e.target.value)}
                >
                  <option value="" disabled>{t.quiz.questions.education.defaultOption}</option>
                  {EDUCATION.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
              {errors.education && <p className="field-error">{errors.education}</p>}
            </div>
          )}

          {/* Step 5 — Handedness */}
          {step === 4 && (
            <div className="quiz-field">
              <h2 className="quiz-question">{t.quiz.questions.hand.title}</h2>
              <p  className="quiz-hint">{t.quiz.questions.hand.hint}</p>
              <OptionGrid options={HANDEDNESS} value={answers.hand} onChange={v => set('hand', v)} cols={3} />
              {errors.hand && <p className="field-error">{errors.hand}</p>}
            </div>
          )}

          {/* Step 6 — Blood type */}
          {step === 5 && (
            <div className="quiz-field">
              <h2 className="quiz-question">{t.quiz.questions.blood.title}</h2>
              <p  className="quiz-hint">{t.quiz.questions.blood.hint}</p>
              <OptionGrid options={BLOOD_TYPES} value={answers.blood} onChange={v => set('blood', v)} cols={3} />
              {errors.blood && <p className="field-error">{errors.blood}</p>}
            </div>
          )}

          {/* Step 7 — Eye + Hair color */}
          {step === 6 && (
            <div className="quiz-field">
              <h2 className="quiz-question">{t.quiz.questions.traits.title}</h2>
              <p  className="quiz-hint">{t.quiz.questions.traits.hint}</p>

              <div className="trait-group">
                <label className="trait-label">{t.quiz.questions.traits.eye}</label>
                <OptionGrid options={EYE_COLORS} value={answers.eyeColor} onChange={v => set('eyeColor', v)} cols={3} />
                {errors.eyeColor && <p className="field-error">{errors.eyeColor}</p>}
              </div>

              <div className="trait-group">
                <label className="trait-label">{t.quiz.questions.traits.hair}</label>
                <OptionGrid options={HAIR_COLORS} value={answers.hairColor} onChange={v => set('hairColor', v)} cols={3} />
                {errors.hairColor && <p className="field-error">{errors.hairColor}</p>}
              </div>
            </div>
          )}

          {/* Step 8 — Skills */}
          {step === 7 && (
            <div className="quiz-field">
              <h2 className="quiz-question">{t.quiz.questions.skills.title}</h2>
              <p  className="quiz-hint">{t.quiz.questions.skills.hint}</p>
              <p className="text-sm text-[#4ADE80] font-medium mb-4">{t.quiz.selectAll}</p>
              <SkillsSelection selected={answers.skills} onChange={v => set('skills', v)} />
            </div>
          )}

          {/* Step 9 — Birthday */}
          {step === 8 && (
            <div className="quiz-field">
              <h2 className="quiz-question text-[1.5rem]">{t.quiz.questions.birthday.title}</h2>
              <p className="quiz-hint">{t.quiz.questions.birthday.hint}</p>
              
              <div className="birthday-inputs">
                <div className="select-wrap">
                  <select className={`styled-select${errors.birthday ? ' input--error' : ''}`} value={answers.bDay} onChange={e => set('bDay', e.target.value)}>
                    <option value="" disabled>{t.quiz.questions.birthday.day}</option>
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="select-arrow">▾</span>
                </div>
                
                <div className="select-wrap">
                  <select className={`styled-select${errors.birthday ? ' input--error' : ''}`} value={answers.bMonth} onChange={e => set('bMonth', e.target.value)}>
                    <option value="" disabled>{t.quiz.questions.birthday.month}</option>
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span className="select-arrow">▾</span>
                </div>
                
                <div className="select-wrap">
                  <select className={`styled-select${errors.birthday ? ' input--error' : ''}`} value={answers.bYear} onChange={e => set('bYear', e.target.value)}>
                    <option value="" disabled>{t.quiz.questions.birthday.year}</option>
                    {Array.from({length: 2010 - 1950 + 1}, (_, i) => 2010 - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <span className="select-arrow">▾</span>
                </div>
              </div>
              {errors.birthday && <p className="field-error">{errors.birthday}</p>}
            </div>
          )}

          {/* ── Optional Step Additions ─────────────────────── */}
          {STEPS[step].isOptional && step !== 3 && (
            <div className="mt-4 text-center">
              <button onClick={skip} className="text-xs text-white/40 hover:text-white/80 transition-colors uppercase tracking-wider">
                {t.quiz.skipStep}
              </button>
              <p className="text-[0.7rem] text-[#6C47FF]/70 mt-2 font-medium">{t.quiz.accurateNote}</p>
            </div>
          )}

          {/* ── Nav buttons ─────────────────────────────────── */}
          {step === 3 ? (
            <div className="flex flex-col gap-3 mt-8">
              <button type="button" className="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-[1.05rem] border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2" onClick={finish}>
                {t.quiz.quickResults}
              </button>
              <button type="submit" className="quiz-btn--next w-full py-4 flex items-center justify-center gap-2 rounded-xl font-bold text-[1.05rem]">
                {t.quiz.addMore} <span className="text-xs opacity-70 font-normal">{t.quiz.moreAccurate}</span>
              </button>
              <button type="button" className="text-sm text-white/50 hover:text-white mt-2" onClick={back}>
                {t.quiz.back}
              </button>
            </div>
          ) : (
            <div className="quiz-nav">
              {step > 0 ? (
                <button type="button" className="quiz-btn quiz-btn--back" onClick={back}>
                  {t.quiz.back}
                </button>
              ) : (
                <div />
              )}

              {!isLast ? (
                <button type="submit" className="quiz-btn quiz-btn--next">
                  {t.quiz.next}
                </button>
              ) : (
                <button type="submit" className="quiz-btn quiz-btn--finish">
                  <span className="quiz-btn__shimmer" aria-hidden="true" />
                  {t.quiz.finish}
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Decorative background blobs */}
      <div className="quiz-blob quiz-blob--1" aria-hidden="true" />
      <div className="quiz-blob quiz-blob--2" aria-hidden="true" />
      
      {isEmbed && (
        <div className="text-center pb-4 z-10 relative">
          <a href="https://unique.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/60 text-xs font-medium transition-colors">
            {t.poweredBy}
          </a>
        </div>
      )}
    </div>
    {!isEmbed && <Footer />}
    </>
  );
}
