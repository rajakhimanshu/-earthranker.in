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
    Black: 0.55,
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
    '✍️ Writing/Authoring': 0.02,
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
  },

  // First letter of name — based on global name frequency data
  nameInitial: {
    A: 0.12, B: 0.06, C: 0.07, D: 0.06, E: 0.05,
    F: 0.04, G: 0.04, H: 0.05, I: 0.03, J: 0.08,
    K: 0.06, L: 0.05, M: 0.10, N: 0.05, O: 0.03,
    P: 0.06, Q: 0.002, R: 0.08, S: 0.11, T: 0.05,
    U: 0.01, V: 0.03, W: 0.03, X: 0.001, Y: 0.005,
    Z: 0.003,
  },

  // Mole location — fraction of people with a mole there
  moleLocations: {
    Face: 0.20,
    Hand: 0.15,
    Neck: 0.10,
    Back: 0.25,
    None: 0.40,
  },
};

// ─────────────────────────────────────────────
//  Rarity tiers — updated thresholds March 2026
// ─────────────────────────────────────────────

export const TIERS = [
  { name: 'Mythic',     minScore: 97, color: '#FF6B9D', emoji: '🌌' },
  { name: 'Legendary',  minScore: 89, color: '#FFD700', emoji: '⚡' },
  { name: 'Epic',       minScore: 78, color: '#A855F7', emoji: '💎' },
  { name: 'Rare',       minScore: 64, color: '#3B82F6', emoji: '🔷' },
  { name: 'Uncommon',   minScore: 45, color: '#10B981', emoji: '🌿' },
  { name: 'Common',     minScore: 0,  color: '#6B7280', emoji: '⚪' },
];

// ─────────────────────────────────────────────
//  calculateScore(answers)
//
//  NEW RULES (March 2026):
//  1. Traits are weighted by category:
//     - Physical/Biological (e.g. blood, eyes, moles) -> 1.0x
//     - Demographic (country, age, gender, edu) -> 0.9x
//     - Skills -> 0.65x
//  2. Only the TOP 3 rarest skills selected count toward the score.
//  3. Raw probabilities are multiplied after weighting (prob^weight).
//  4. Coupling Factor of 0.75 is applied: CombinedProb = RawProduct^0.75
//  5. Final Score (0-100) is logarithmic based on CombinedProb.
// ─────────────────────────────────────────────

export function calculateScore(answers) {
  const traitBreakdown = [];
  let rawProduct = 1;

  // Owner override for Himanshu (flex mode)
  const maxSkillsToCount = answers.maxSkillsOverride || 3;

  const selectedSkills = [];
  const otherTraits = [];

  // Demographic traits for 0.9x weighting
  const demographicTraits = ['country', 'ageGroup', 'gender', 'education'];

  for (const [trait, value] of Object.entries(answers)) {
    const traitMap = TRAITS[trait];
    
    // Handle Birthday (Physical: 1.0x)
    if (trait === 'bDay' || trait === 'bMonth' || trait === 'bYear') {
      if (!otherTraits.some(t => t.trait === 'birthday')) {
        const fraction = 1 / 365.25;
        otherTraits.push({
          trait: 'birthday',
          value: `${answers.bDay} ${answers.bMonth} ${answers.bYear}`,
          fraction,
          weight: 1.0
        });
      }
      continue;
    }

    if (!traitMap && trait !== 'country') continue;

    // Weight determination
    let weight = 1.0; 
    if (demographicTraits.includes(trait)) weight = 0.9;
    if (trait === 'skills') weight = 0.65;

    // Handle single or multiple values (e.g. skills, moles)
    const values = Array.isArray(value) ? value : [value];

    for (const v of values) {
      let fraction = traitMap ? traitMap[v] : null;
      
      // Fallback for country if not in map
      if (fraction == null && trait === 'country') fraction = 0.003;
      if (fraction == null) continue;

      const item = {
        trait,
        value: v,
        fraction,
        weight
      };

      if (trait === 'skills') {
        selectedSkills.push(item);
      } else {
        otherTraits.push(item);
      }
    }
  }

  // 1. Process Non-Skill Traits
  for (const item of otherTraits) {
    const weightedProb = Math.pow(item.fraction, item.weight);
    rawProduct *= weightedProb;

    traitBreakdown.push({
      trait: item.trait,
      value: item.value,
      fraction: item.fraction,
      percentage: `${(item.fraction * 100).toFixed(2)}%`,
      worldCount: Math.round(item.fraction * 8_280_000_000),
      isSkill: false
    });
  }

  // 2. Process Skills (Only top N count)
  const sortedSkills = [...selectedSkills].sort((a, b) => a.fraction - b.fraction);
  
  selectedSkills.forEach(skill => {
    // Only the top N with lowest probability count
    const isCounted = sortedSkills.slice(0, maxSkillsToCount).some(s => s.value === skill.value);
    
    if (isCounted) {
      const weightedProb = Math.pow(skill.fraction, skill.weight);
      rawProduct *= weightedProb;
    }

    traitBreakdown.push({
      trait: skill.trait,
      value: skill.value,
      fraction: skill.fraction,
      percentage: `${(skill.fraction * 100).toFixed(2)}%`,
      worldCount: Math.round(skill.fraction * 8_280_000_000),
      isSkill: true,
      counted: isCounted 
    });
  });

  if (rawProduct <= 0 || traitBreakdown.length === 0) {
    return {
      score: 0, rarityTier: 'Common', tierColor: '#6B7280', tierEmoji: '⚪',
      oneIn: 1, oneInRaw: 1, estimatedRank: 8_280_000_000, topPercentile: 100,
      traitBreakdown
    };
  }

  // 3. Combined Probability (Coupling Factor 0.75)
  const combinedProbability = Math.pow(rawProduct, 0.75);

  // 4. One-in-X Calculation
  const oneInRaw = 1 / combinedProbability;
  const oneIn = Math.min(Math.round(oneInRaw), 8_280_000_000);

  // 5. Final Score (0-100)
  const negLog = Math.log10(oneInRaw);
  const score = Math.min(100, Math.max(0, Math.round((negLog / 12) * 100)));

  // 6. Rank & Percentile (Population 8.28 Billion)
  const population = 8_280_000_000;
  const estimatedRank = Math.max(1, Math.round(combinedProbability * population));
  const topPercentile = combinedProbability * 100;

  // 7. Determine Tier
  const tier = TIERS.find((t) => score >= t.minScore) ?? TIERS[TIERS.length - 1];

  return {
    score,
    rarityTier: tier.name,
    tierColor: tier.color,
    tierEmoji: tier.emoji,
    oneIn,
    oneInRaw,
    estimatedRank,
    topPercentile,
    traitBreakdown,
  };
}


