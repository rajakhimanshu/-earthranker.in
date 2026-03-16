// ─────────────────────────────────────────────
//  Rarity fractions for every quiz answer
//  Values represent the fraction of the global
//  population that has that trait (0 → 1).
// ─────────────────────────────────────────────

export const TRAITS = {
  handedness: {
    Left: 0.10,
    Right: 0.89,
    Ambidextrous: 0.01,
  },

  eyeColor: {
    Brown: 0.79,
    Blue: 0.08,
    Green: 0.02,
    Hazel: 0.05,
    Gray: 0.03,
    Other: 0.03,
  },

  bloodType: {
    'O+':  0.380,
    'A+':  0.280,
    'B+':  0.080,
    'AB+': 0.035,
    'O-':  0.070,
    'A-':  0.060,
    'B-':  0.015,
    'AB-': 0.006,
  },

  // Highest level of education completed
  education: {
    'No formal education':    0.14,
    'Primary school':         0.28,
    'High school':            0.27,
    'Some college':           0.09,
    "Bachelor's degree":      0.14,
    "Master's degree":        0.05,
    'Doctorate / PhD':        0.02,
    'Trade / Vocational':     0.01,
  },

  // Age group (broad buckets used in the quiz)
  ageGroup: {
    'Under 18': 0.24,
    '18–24':    0.16,
    '25–34':    0.17,
    '35–44':    0.14,
    '45–54':    0.12,
    '55–64':    0.09,
    '65+':      0.08,
  },

  skills: {
    // Physical Skills
    '🏊 Swimming': 0.50,
    '🏇 Horse Riding': 0.02,
    '🚗 Driving (Car)': 0.40,
    '🏍️ Riding (Bike/Motorbike)': 0.15,
    '🤸 Gymnastics': 0.01,
    '🥊 Martial Arts': 0.04,
    '🧗 Rock Climbing': 0.02,
    '⛷️ Skiing/Snowboarding': 0.03,
    '🤿 Scuba Diving': 0.005,
    '🪂 Skydiving': 0.002,

    // Technical Skills
    '💻 Programming/Coding': 0.03,
    '📈 Trading/Investing': 0.008,
    '✈️ Flying a Plane': 0.001,
    '🔧 Mechanical Repair': 0.05,
    '⚕️ Medical Training': 0.02,
    '🎛️ Music Production': 0.01,
    '🔬 Scientific Research': 0.005,
    '🌐 Multiple Languages (3+)': 0.03,
    '🤖 AI/Machine Learning': 0.002,
    '🎮 Game Development': 0.005,

    // Creative & Other
    '🎨 Painting/Drawing': 0.05,
    '🎵 Playing Instrument': 0.08,
    '📷 Photography': 0.06,
    '✍️ Writing/Authoring': 0.02,
    '🎭 Acting/Theatre': 0.01,
    '🧁 Professional Cooking/Baking': 0.02,
    '🪡 Tailoring/Fashion Design': 0.01,
    '🌱 Farming/Agriculture': 0.20,
    '⚖️ Legal Knowledge': 0.01,
    '🕌 Religious Scholarship': 0.005,
  },

  country: {
    'India': 0.175,
    'China': 0.177,
    'United States': 0.042,
    'Brazil': 0.027,
    'Pakistan': 0.028,
    'Nigeria': 0.022,
    'Bangladesh': 0.021,
    'Russia': 0.018,
    'Ethiopia': 0.016,
    'Mexico': 0.016,
    'Japan': 0.016,
    'Philippines': 0.014,
    'Egypt': 0.013,
    'DR Congo': 0.012,
    'Vietnam': 0.012,
    'Iran': 0.011,
    'Turkey': 0.011,
    'Germany': 0.010,
    'Thailand': 0.009,
    'United Kingdom': 0.008,
    'France': 0.008,
    'Tanzania': 0.008,
    'South Africa': 0.007,
    'Myanmar': 0.007,
    'Kenya': 0.007,
    'South Korea': 0.006,
    'Colombia': 0.006,
    'Spain': 0.006,
    'Uganda': 0.006,
    'Argentina': 0.006,
    'Algeria': 0.006,
    'Sudan': 0.006,
    'Iraq': 0.005,
    'Ukraine': 0.005,
    'Canada': 0.005,
    'Poland': 0.005,
    'Morocco': 0.005,
    'Uzbekistan': 0.004,
    'Saudi Arabia': 0.004,
    'Malaysia': 0.004,
  },

  hairColor: {
    'Black': 0.15,
    'Brown': 0.45,
    'Blonde': 0.16,
    'Red': 0.02,
    'White': 0.05,
    'Gray': 0.06,
    'Other': 0.11
  },

  gender: {
    'Male': 0.50,
    'Female': 0.495,
    'Non-binary': 0.004,
    'Prefer not to say': 0.001
  }
};

// ─────────────────────────────────────────────
//  Rarity tiers — ordered from most to least rare
// ─────────────────────────────────────────────

export const TIERS = [
  { name: 'Mythic',     minScore: 90, color: '#FF6B9D', emoji: '🌌' },
  { name: 'Legendary',  minScore: 75, color: '#FFD700', emoji: '⚡' },
  { name: 'Epic',       minScore: 60, color: '#A855F7', emoji: '💎' },
  { name: 'Rare',       minScore: 45, color: '#3B82F6', emoji: '🔷' },
  { name: 'Uncommon',   minScore: 30, color: '#10B981', emoji: '🌿' },
  { name: 'Common',     minScore: 0,  color: '#6B7280', emoji: '⚪' },
];

// ─────────────────────────────────────────────
//  calculateScore(answers)
//
//  answers  – plain object whose keys match the
//             TRAITS keys, e.g.:
//             { handedness: 'Left', eyeColor: 'Blue', … }
//
//  Returns  – {
//               score        : number  0-100,
//               rarityTier   : string  (tier name),
//               tierColor    : string  (hex),
//               tierEmoji    : string,
//               oneIn        : number  (1-in-X),
//               traitBreakdown: Array<{
//                 trait      : string,
//                 value      : string,
//                 fraction   : number,
//                 percentage : string,
//               }>,
//             }
// ─────────────────────────────────────────────

export function calculateScore(answers) {
  const traitBreakdown = [];
  let combinedProbability = 1;

  for (const [trait, value] of Object.entries(answers)) {
    const traitMap = TRAITS[trait];
    
    // Handle special case: birthday (not in TRAITS map but used for score if present)
    if (trait === 'bDay' || trait === 'bMonth' || trait === 'bYear') {
      // We only count birthday as a single probability event once
      if (!traitBreakdown.some(t => t.trait === 'birthday')) {
        const fraction = 1 / 365.25;
        combinedProbability *= fraction;
        traitBreakdown.push({
          trait: 'birthday',
          value: `${answers.bDay} ${answers.bMonth} ${answers.bYear}`,
          fraction,
          percentage: `${(fraction * 100).toFixed(2)}%`,
          worldCount: Math.round(fraction * 8_280_000_000),
          isSkill: false
        });
      }
      continue;
    }

    if (!traitMap && trait !== 'country') continue;

    if (Array.isArray(value)) {
      for (const v of value) {
        const fraction = traitMap ? traitMap[v] : null;
        if (fraction != null) {
          combinedProbability *= fraction;
          traitBreakdown.push({
            trait,
            value: v,
            fraction,
            percentage: `${(fraction * 100).toFixed(2)}%`,
            worldCount: Math.round(fraction * 8_280_000_000),
            isSkill: trait === 'skills'
          });
        }
      }
      continue;
    }

    let fraction = traitMap ? traitMap[value] : null;

    if (fraction == null) {
      if (trait === 'country') {
        fraction = 0.003; // Fallback for countries not in top 40
      } else {
        continue;
      }
    }

    combinedProbability *= fraction;

    traitBreakdown.push({
      trait,
      value,
      fraction,
      percentage: `${(fraction * 100).toFixed(2)}%`,
      worldCount: Math.round(fraction * 8_280_000_000),
      isSkill: false
    });
  }

  // Guard against edge-case (no recognised answers)
  if (combinedProbability <= 0 || traitBreakdown.length === 0) {
    return {
      score: 0,
      rarityTier: 'Common',
      tierColor: TIERS[TIERS.length - 1].color,
      tierEmoji: TIERS[TIERS.length - 1].emoji,
      oneIn: 1,
      traitBreakdown,
    };
  }

  // ── Logarithmic scoring — calibrated to real trait probability ranges ───
  //
  //  Combined probability with real inputs:
  //    Core only (4 required steps, all avg values):  prob ≈ 4e-3  negLog≈2.4  → score~16
  //    All steps filled, all average values:          prob ≈ 1e-5  negLog≈4.8  → score~32
  //    1-2 rare traits + common skills:               prob ≈ 1e-8  negLog≈8    → score~53
  //    Rare traits (PhD+AB-+Ambidextrous+Gray):       prob ≈ 1e-9  negLog≈9    → score~60
  //    Rare traits + 3 rare skills (Flying+AI+Scuba): prob ≈ 1e-14 negLog≈14   → score~93
  //    Most extreme combo possible:                   prob ≈ 1e-20 negLog≈20   → score~100
  //
  //  Formula: score = clamp((negLog / 15) * 100, 0, 100)
  //    negLog=0  → score=0   (prob=1 — impossible in practice with any trait selected)
  //    negLog=7.5→ score=50  (1 in 300M range — genuinely rare)
  //    negLog=15 → score=100 (prob=1e-15 — extreme rarity)
  //
  //  Tier distribution with real inputs:
  //    Common     (0–30):  core-only fills, all very average traits
  //    Uncommon  (30–50):  average person who completes all steps with common traits
  //    Rare      (50–65):  someone with 1-2 rare traits + some skills
  //    Epic      (65–80):  multiple rare traits + moderate skills
  //    Legendary (80–92):  very rare combos + several rare skills
  //    Mythic    (92–100): extreme rarity — rare traits + many rare skills
  // ────────────────────────────────────────────────────────────────────────

  // oneIn: realistic "1 in X people" on Earth (8.28B cap for display clarity)
  const oneIn = Math.min(
    Math.round(1 / combinedProbability),
    8_280_000_000
  );

  const score = Math.round((Math.log10(oneIn) / Math.log10(8280000000)) * 100);

  // Determine tier (TIERS ordered highest minScore first)
  const tier = TIERS.find((t) => score >= t.minScore) ?? TIERS[TIERS.length - 1];

  return {
    score,
    rarityTier: tier.name,
    tierColor: tier.color,
    tierEmoji: tier.emoji,
    oneIn,
    traitBreakdown,
  };
}

// Test case for typical person
console.log("TEST CASE RESULT:", calculateScore({
  handedness: 'Right',
  eyeColor: 'Brown',
  bloodType: 'O+',
  education: 'High school',
  ageGroup: '25–34',
  country: 'India',
  hairColor: 'Black',
  gender: 'Male'
}));
