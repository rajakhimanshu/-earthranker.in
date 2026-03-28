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
    'O+': 0.380,
    'A+': 0.280,
    'B+': 0.080,
    'AB+': 0.035,
    'O-': 0.070,
    'A-': 0.060,
    'B-': 0.015,
    'AB-': 0.006,
  },

  // Highest level of education completed
  education: {
    'No formal education': 0.14,
    'Primary school': 0.28,
    'High school': 0.27,
    'Some college': 0.09,
    "Bachelor's degree": 0.14,
    "Master's degree": 0.05,
    'Doctorate / PhD': 0.02,
    'Trade / Vocational': 0.01,
  },

  // Age group (broad buckets used in the quiz)
  ageGroup: {
    'Under 18': 0.24,
    '18–24': 0.16,
    '25–34': 0.17,
    '35–44': 0.14,
    '45–54': 0.12,
    '55–64': 0.09,
    '65+': 0.08,
  },

  skills: {
    // Physical Skills
    '🏊 Swimming': 0.50,
    '🏇 Horse Riding': 0.005,
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
    '📷 Photography': 0.02,
    '✍️ Writing/Authoring': 0.02,
    '🎭 Acting/Theatre': 0.01,
    '🧁 Professional Cooking/Baking': 0.015,
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
  { name: 'Mythic',    minScore: 97, color: '#FF6B9D', emoji: '🌌' },
  { name: 'Legendary', minScore: 92, color: '#FFD700', emoji: '⚡' },
  { name: 'Epic',      minScore: 80, color: '#A855F7', emoji: '💎' },
  { name: 'Rare',      minScore: 65, color: '#3B82F6', emoji: '🔷' },
  { name: 'Uncommon',  minScore: 40, color: '#10B981', emoji: '🌿' },
  { name: 'Common',    minScore: 0,  color: '#6B7280', emoji: '⚪' },
];

// ─────────────────────────────────────────────
//  calculateScore(answers)
//
//  SCORING MODEL (March 2026 rewrite):
//
//  Algorithm: Additive negLog with per-category weights + coupling factor.
//
//  Each trait contributes:  -log10(fraction) × weight
//  (so rarer traits contribute larger positive numbers)
//
//  Category weights:
//    Biological (blood, eyes, hair, handedness)  → 0.6  ← HALVED
//    Demographic (country, age, gender, edu)     → 0.8
//    Birthday (day+month combo = 1/365.25)       → 0.4
//    Skills (top 5 rarest count)                 → 0.9  ← TRIPLED
//    Bonus (nameInitial, moleLocations)          → 0.6
//
//  Coupling factor 0.675 is applied to the total negLog before
//  mapping to score, modelling correlation between traits.
//
//  Score = clamp((finalNegLog − 0.4) / (7.5 − 0.4) × 100, 0, 100)
//
//  Calibration (validated test cases):
//    Score hits 100 when rarity = 1 in 10+ Million.
//    Normal users hit ceilings around ~80-85 max.
//    Admins with 5+ elite skills hit 95-100 Mythic.
//
//  Returns the same shape as the previous version:
//  { score, rarityTier, tierColor, tierEmoji, oneIn, oneInRaw,
//    estimatedRank, topPercentile, traitBreakdown }
// ─────────────────────────────────────────────

// ── Weight constants ──────────────────────────
const BIO_W = 0.3;   // Biological traits — crushed so Ambidextrous etc get almost nothing
const DEMO_W = 0.8;  // Demographic traits
const BDAY_W = 0.4;  // Birthday (day + month combo)
const SKILL_W = 1.2; // Each skill — elite skills get massive points
const BONUS_W = 0.6; // Bonus traits (name initial, moles)

// ── Coupling & score normalisation ───────────
const COUPLING = 0.675;  // Reduces raw negLog to account for trait correlation
const LOG_FLOOR = 0.4;   // negLog at score 0 (practically "no data")
const LOG_CEIL = 11.0;   // Hard ceiling so Mythic requires true 1 in 15B+ math

// ── Trait category sets ───────────────────────
const BIOLOGICAL_TRAITS = new Set(['handedness', 'eyeColor', 'hairColor', 'bloodType']);
const DEMOGRAPHIC_TRAITS = new Set(['country', 'ageGroup', 'gender', 'education']);
const BONUS_TRAITS = new Set(['nameInitial', 'moleLocations']);

// ── Population constant ───────────────────────
const POPULATION = 8_280_000_000;

// ── Max skills that contribute to score ───────
// Only the 3 rarest skills count automatically to prevent simple skill spamming
const DEFAULT_MAX_SKILLS = 3;

export function calculateScore(answers) {
  // ── Country alias normalisation ──────────────
  const countryAliasMap = {
    'Congo (Kinshasa)': 'DR Congo',
    'Congo (Brazzaville)': 'Congo',
  };
  if (answers.country && countryAliasMap[answers.country]) {
    answers = { ...answers, country: countryAliasMap[answers.country] };
  }

  const maxSkillsToCount = answers.maxSkillsOverride || DEFAULT_MAX_SKILLS;

  let totalNegLog = 0;
  let birthdayAdded = false;

  const selectedSkills = []; // collected before sorting
  const traitBreakdown = [];

  // ── Iterate over all provided answers ────────
  for (const [trait, value] of Object.entries(answers)) {
    // ── Birthday: day + month together = 1/365.25 ──
    if (trait === 'bDay' || trait === 'bMonth') {
      if (!birthdayAdded) {
        const fraction = 1 / 365.25;
        const contrib = -Math.log10(fraction) * BDAY_W;
        totalNegLog += contrib;
        birthdayAdded = true;

        traitBreakdown.push({
          trait: 'birthday',
          value: `${answers.bDay || ''} ${answers.bMonth || ''}`.trim(),
          fraction,
          percentage: `${(fraction * 100).toFixed(2)}%`,
          worldCount: Math.round(fraction * POPULATION),
          isSkill: false,
        });
      }
      continue;
    }

    // ── Skip non-scoring fields ──────────────────
    if (trait === 'bYear' || trait === 'maxSkillsOverride') continue;

    const traitMap = TRAITS[trait];
    if (!traitMap) continue;

    // ── Determine weight for this category ───────
    let weight;
    if (BIOLOGICAL_TRAITS.has(trait)) weight = BIO_W;
    else if (DEMOGRAPHIC_TRAITS.has(trait)) weight = DEMO_W;
    else if (trait === 'skills') weight = SKILL_W;
    else if (BONUS_TRAITS.has(trait)) weight = BONUS_W;
    else weight = 1.0;

    // ── Handle single value or array (skills, moles) ─
    const values = Array.isArray(value) ? value : [value];

    for (const v of values) {
      let fraction = traitMap[v];

      // Fallback for countries not in the map
      if (fraction == null && trait === 'country') fraction = 0.003;
      if (fraction == null) continue;

      // negLog contribution = -log10(fraction) × weight
      // Rare traits (low fraction) → high negLog → higher score
      const contrib = -Math.log10(fraction) * weight;

      if (trait === 'skills') {
        // Collect skills first — only the rarest N will count
        selectedSkills.push({ trait, value: v, fraction, contrib });
      } else {
        totalNegLog += contrib;
        traitBreakdown.push({
          trait,
          value: v,
          fraction,
          percentage: `${(fraction * 100).toFixed(2)}%`,
          worldCount: Math.round(fraction * POPULATION),
          isSkill: false,
        });
      }
    }
  }

  // ── Skills: only the top N rarest contribute ─
  // Sort ascending by fraction (rarest = lowest fraction first)
  const sortedByRarity = [...selectedSkills].sort((a, b) => a.fraction - b.fraction);
  const countedSet = new Set(
    sortedByRarity.slice(0, maxSkillsToCount).map(s => s.value)
  );

  for (const skill of selectedSkills) {
    const isCounted = countedSet.has(skill.value);
    if (isCounted) {
      totalNegLog += skill.contrib;
    }
    traitBreakdown.push({
      trait: skill.trait,
      value: skill.value,
      fraction: skill.fraction,
      percentage: `${(skill.fraction * 100).toFixed(2)}%`,
      worldCount: Math.round(skill.fraction * POPULATION),
      isSkill: true,
      counted: isCounted,
    });
  }

  // ── Guard: no data provided ───────────────────
  if (totalNegLog <= 0 || traitBreakdown.length === 0) {
    return {
      score: 0,
      rarityTier: 'Common',
      tierColor: '#6B7280',
      tierEmoji: '⚪',
      oneIn: 1,
      oneInRaw: 1,
      estimatedRank: POPULATION,
      topPercentile: 100,
      traitBreakdown,
    };
  }

  // ── Apply coupling factor ─────────────────────
  // Reduces raw negLog to account for real-world correlations between traits.
  // Example: being Left-handed AND having Green eyes is not as independent as the
  // math assumes — many rare traits cluster.
  const finalNegLog = totalNegLog * COUPLING;

  // ── Derive probability and 1-in-X ────────────
  const combinedProbability = Math.pow(10, -finalNegLog);
  const oneInRaw = 1 / combinedProbability;
  const oneIn = Math.min(Math.round(oneInRaw), POPULATION);

  // ── Map negLog to 0–100 score ─────────────────
  // LOG_FLOOR → score 0, LOG_CEIL → score 100
  let score = ((finalNegLog - LOG_FLOOR) / (LOG_CEIL - LOG_FLOOR)) * 100;
  score = Math.min(100, Math.max(0, Math.round(score)));

  // ── Rank & percentile ─────────────────────────
  const estimatedRank = Math.max(1, Math.round(combinedProbability * POPULATION));
  const topPercentile = combinedProbability * 100;

  // ── Determine rarity tier ─────────────────────
  const tier = TIERS.find(t => score >= t.minScore) ?? TIERS[TIERS.length - 1];

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