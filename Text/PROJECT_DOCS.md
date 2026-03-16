# Unique.com — Complete Project Documentation

> **Last updated:** March 2026  
> **Stack:** React 18 · Vite 8 · Tailwind CSS 3 · Firebase Firestore · React Router 7

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [How To Start The Project](#2-how-to-start-the-project)
3. [Complete Folder & File Structure](#3-complete-folder--file-structure)
4. [Design System](#4-design-system)
5. [Every Page — Detailed Breakdown](#5-every-page--detailed-breakdown)
6. [Quiz — All Steps](#6-quiz--all-steps)
7. [Scoring Logic](#7-scoring-logic)
8. [Rarity Tiers](#8-rarity-tiers)
9. [Features List](#9-features-list)
10. [Components](#10-components)
11. [Data Files](#11-data-files)
12. [Animations & CSS](#12-animations--css)
13. [PWA Details](#13-pwa-details)
14. [Known Issues & Limitations](#14-known-issues--limitations)
15. [What Is NOT Built Yet](#15-what-is-not-built-yet)
16. [Deployment Guide](#16-deployment-guide)
17. [Future Features Roadmap](#17-future-features-roadmap)

---

## 1. Project Overview

**Unique.com** is a web application that calculates how statistically rare a person is among the 8 billion people on Earth. Users answer a 9-step quiz about their biological traits, demographic background, and personal skills. The app multiplies the independent probabilities of each trait and produces a **Rarity Score** (0–100), a **Rarity Tier** (Common → Mythic), and a **"1 in X"** figure showing exactly how rare their combination is.

### Original Idea
Conceived in December 2023 as a viral curiosity tool — a "What makes you unique?" calculator that could spread through social sharing. The core insight: even if each individual trait is common, the *combination* of all traits together is almost always extraordinarily rare.

### Current Status
- ✅ Full quiz flow (9 steps) working end-to-end
- ✅ Real probability scoring engine
- ✅ Firebase Firestore leaderboard (real-time, with fallback data)
- ✅ Social share buttons (Twitter, WhatsApp, LinkedIn, copy link)
- ✅ Downloadable PNG score card (Canvas API)
- ✅ Birthday twin calculation
- ✅ Cosmic scale toggle (Earth vs Universe mode)
- ✅ Famous person comparison (10 profiles)
- ✅ Personalised rarity story (16 skill-combination narrative paths)
- ✅ Daily Rare Fact widget
- ✅ Embed widget (`?embed=true` query param on /quiz and /result)
- ✅ Hindi language support (EN ↔ HI toggle)
- ✅ PWA — installable on Android and iOS
- ✅ Mobile responsive

### Vision
A globally shareable, emotionally resonant tool that makes statistics feel personal. Target: millions of completions driven by social sharing ("I'm 1 in 4.2 million!").

---

## 2. How To Start The Project

### Prerequisites
- Node.js 18+ installed
- A terminal (PowerShell, CMD, or any shell)

### Steps

**1. Open the project folder**
```
W:\The Office\Currently Working\Unique
```

**2. Install dependencies (first time only)**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```
> On Windows with PowerShell execution policy restrictions, use:
> ```bash
> cmd /c "npm run dev"
> ```

**4. Open in browser**
```
http://localhost:5173
```

**5. Stop the server**
Press `Ctrl + C` in the terminal.

### Other Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Build for production (outputs to `/dist`) |
| `npm run preview` | Preview the production build locally |

---

## 3. Complete Folder & File Structure

```
Unique/
├── public/                        # Static files served as-is
│   ├── favicon.svg                # Browser tab icon (SVG)
│   ├── icons.svg                  # Source icon artwork
│   ├── og-preview.svg             # Open Graph social preview image
│   ├── manifest.json              # PWA manifest (name, colors, icons)
│   ├── sw.js                      # Service Worker (caching strategy)
│   └── icons/
│       ├── icon-192.svg           # PWA home screen icon 192×192
│       └── icon-512.svg           # PWA splash screen icon 512×512
│
├── src/
│   ├── main.jsx                   # React root mount + service worker registration
│   ├── App.jsx                    # Router setup, LanguageProvider wrapper, global layout
│   ├── globals.css                # CSS variables, resets, utility classes (.glass-card, .text-gradient)
│   ├── style.css                  # Additional global styles
│   ├── counter.ts                 # Unused Vite scaffold file (can be deleted)
│   ├── main.ts                    # Unused Vite scaffold file (can be deleted)
│   │
│   ├── pages/
│   │   ├── Home.jsx               # Landing page: hero, how-it-works, tier showcase
│   │   ├── Home.css               # Styles for Home page (particles, hero, feature cards)
│   │   ├── Quiz.jsx               # 9-step quiz form with validation and animation
│   │   ├── Quiz.css               # Styles for quiz: cards, progress bar, option buttons
│   │   ├── Result.jsx             # Result display: score, breakdown, shares, modal, cosmic mode
│   │   ├── Result.css             # All result page styles (hex badge, trait bars, share buttons)
│   │   ├── Compare.jsx            # Friend comparison page (currently uses mock data)
│   │   ├── Leaderboard.jsx        # Global leaderboard — reads from Firebase Firestore
│   │   └── About.jsx              # About page: FAQ, how it works, embed widget code
│   │
│   ├── components/
│   │   ├── Footer.jsx             # Site footer: logo, nav links, social icons, disclaimer
│   │   ├── Footer.css             # Footer layout and link styles
│   │   ├── DailyFact.jsx          # "Rare Fact of the Day" card (appears on Result page)
│   │   ├── DailyFact.css          # Styles for the fact card
│   │   ├── InstallPrompt.jsx      # PWA install banner (Android: native prompt; iOS: manual)
│   │   ├── InstallPrompt.css      # Styles for the install banner
│   │   └── LanguageToggle.jsx     # Fixed top-right EN/HI toggle button
│   │
│   ├── contexts/
│   │   └── LanguageContext.jsx    # React context: current language, t() translations, toggleLang()
│   │
│   ├── i18n/
│   │   └── translations.js        # All EN and HI strings exported as EN and HI objects
│   │
│   ├── data/
│   │   ├── rarityData.js          # TRAITS map (all rarity fractions), TIERS array, calculateScore()
│   │   ├── facts.js               # 30 daily rare facts + getDailyFact() helper
│   │   ├── famousProfiles.js      # 10 famous person profiles with traits for comparison
│   │   └── flags.js               # Country → flag emoji lookup map (getFlag() helper)
│   │
│   ├── utils/
│   │   └── storyGenerator.js      # generateStory() — 16 skill-combination narrative paths
│   │
│   ├── assets/                    # Vite-managed static assets (images, etc.)
│   └── firebase.js                # Firebase app init + Firestore db export
│
├── index.html                     # HTML entry point: meta tags, root div, script
├── package.json                   # Dependencies and npm scripts
├── tailwind.config.js             # Tailwind config (font families, color extensions)
├── postcss.config.js              # PostCSS (autoprefixer + tailwindcss plugins)
├── tsconfig.json                  # TypeScript config (used by build step only)
└── .gitignore                     # Ignores node_modules, dist, .env files
```

---

## 4. Design System

### Colors

| Variable | Hex | Usage |
|---|---|---|
| `--color-primary` | `#6C47FF` | CTA buttons, links, borders, progress bars, primary glow |
| `--color-coral` | `#FF6B6B` | Accent color, gradient ends, Mythic tier, coral stat pills |
| `--color-teal` | `#00D4AA` | Secondary accent, teal stat pills, How-It-Works step 3 |
| `--color-navy` | `#1A1A2E` | Page background color |
| `--color-surface` | `#16213E` | Card/surface background |
| `--color-muted` | `#0F3460` | Track backgrounds, muted surfaces |
| `--color-text` | `#EAEAEA` | Primary body text |
| `--color-subtext` | `#9BA3B8` | Secondary text, placeholders, labels |

**Additional tier colors (defined in `rarityData.js`):**

| Tier | Hex |
|---|---|
| Mythic | `#FF6B9D` |
| Legendary | `#FFD700` |
| Epic | `#A855F7` |
| Rare | `#3B82F6` |
| Uncommon | `#10B981` |
| Common | `#6B7280` |

### Fonts

| Variable | Family | Weights | Usage |
|---|---|---|---|
| `--font-heading` | `Space Grotesk` | 300–700 | All headings (h1–h6), buttons, badges, nav |
| `--font-body` | `Inter` | 300–700 | Body text, paragraphs, form inputs |

Both fonts are loaded from Google Fonts via `@import` in `globals.css`.

### Key CSS Utility Classes

| Class | Definition | Usage |
|---|---|---|
| `.glass-card` | `background: rgba(22,33,62,0.7); backdrop-filter: blur(16px); border: 1px solid rgba(108,71,255,0.2); border-radius: 1rem` | All section cards across the app |
| `.text-gradient` | Purple→Coral gradient clip | Hero headline accents, section titles |
| `.gradient-primary` | 135° linear `#6C47FF → #9B6BFF` | CTA buttons |
| `.gradient-coral` | 135° linear `#FF6B6B → #FF9B9B` | Coral accent elements |
| `.gradient-teal` | 135° linear `#00D4AA → #00FFC8` | Teal accent elements |

### Spacing Patterns
- Section padding: `py-20` (5rem top/bottom)
- Card padding: `p-6` (1.5rem) standard; `p-8` for hero CTA cards
- Gap between cards: `gap-5` (1.25rem)
- Max content width: `max-w-2xl` (42rem) on most pages; `max-w-[680px]` on Result page

### Border Radius
- Cards: `1rem` (16px) via `.glass-card`
- Buttons: `rounded-xl` (12px) for CTA; `rounded-full` for pills/toggles
- Inputs: `rounded-xl` (12px)

---

## 5. Every Page — Detailed Breakdown

### 5.1 Home Page (`/`)

**Purpose:** Landing page — explains the concept, builds trust, drives users to start the quiz.

**Sections:**

1. **Hero Section**
   - 40 animated floating particle dots (pure CSS, random size/position/delay)
   - Two radial glow blobs (purple + coral, `aria-hidden`)
   - Eyebrow badge: "8,000,000,000 people on Earth"
   - H1 headline: "How unique are you, **really?**" (last word in purple→coral gradient)
   - H2 subtitle paragraph
   - CTA button (Link to `/quiz`) with shimmer animation
   - Three micro-stats: "8B+ People · 50+ Traits · 6 Tiers"
   - Scroll hint (animated bouncing dot)

2. **How It Works Section**
   - 3 feature cards: Enter Traits → Calculate Rarity → Share Score
   - Each card: step number, emoji icon, title, body text, color accent line

3. **Rarity Tiers Section**
   - 6 tier badges: Common → Mythic, each showing icon, name, percentile range
   - Description: "Each tier represents how rare your combination of traits is"
   - Two CTAs: "Take the Quiz — It's Free" + "View Leaderboard →"

**Interactions:** Click CTA → navigate to `/quiz`. Click Leaderboard → navigate to `/leaderboard`.

**Components used:** `<Particles />` (internal), `<Footer />`

**Animations:** Particle float animation, CTA shimmer sweep, hero blob pulse

---

### 5.2 Quiz Page (`/quiz`)

**Purpose:** Collect all user traits across 9 steps with validation.

See **Section 6** for full step-by-step breakdown.

**Embed Mode:** Append `?embed=true` to hide the header, back link, and footer. A "Powered by Unique.com" link appears at the bottom instead.

**Sections:**
- Top header bar: back link, step dots, step counter (hidden in embed mode)
- Progress bar (fills left-to-right as user advances)
- Animated quiz card (slides in from direction of travel)
- Step label with emoji and "Step X of 9 — [Name]" eyebrow
- Step content (varies per step)
- Navigation buttons: Back (disabled on step 1) + Next/Finish

**Decorative elements:** Two blurred blob divs (`quiz-blob--1`, `quiz-blob--2`)

**On finish:** Calls `navigate('/result', { state: { answers } })` passing all answers via React Router location state.

---

### 5.3 Result Page (`/result`)

**Purpose:** Display the calculated rarity score with full breakdown and sharing options.

**If no state:** Shows "No results yet. Take the quiz!" with link to `/quiz`.

**Sections (in order):**

1. **Scale Toggle** — Earth 🌍 / Universe 🔭 switch (hidden in embed mode)
2. **Decorative Visual** — Animated planetary system (Earth mode) or cosmic background (Universe mode)
3. **Eyebrow pill** — "✨ Results are in"
4. **Hero Counter** — "You are · 1 in · [animated slot counter]"
5. **Sub-label** — "X people on Earth share your exact trait combination"
6. **Hex Badge** — Hexagonal tier badge with emoji and tier name
7. **Tier pip row** — 6 dots showing position among all tiers
8. **Rarity Score label** — "Rarity Score: XX / 100"
9. **Trait Breakdown** — Animated bar chart for each non-skill trait (rarity label, value, %)
10. **Rarity Story** — Personalised paragraph from `generateStory()` (only if skills selected)
11. **Rare Skills** — Pill tags for each skill with "only X% of people worldwide"
12. **Multi-Skilled Anomaly banner** — Shown if ≥3 rare skills (<5% each)
13. **Birthday Rarity** — Shown if birthday was entered; slot counters for month-share and exact-share twins
14. **Famous Person Comparison** — Roll a random famous person; see their tier vs yours
15. **Daily Rare Fact** — `<DailyFact />` widget
16. **Share Section** — Twitter, WhatsApp, LinkedIn, Copy Link buttons + Download Score Card (PNG via Canvas)
17. **Challenge + Nav links** — Challenge a Friend button; nav to Leaderboard, Retake Quiz, Home
18. **Cosmic Disclaimer** — Only visible in cosmic mode: explains the Drake Equation estimates
19. **Leaderboard Modal** — Pops up 2.8s after page load (once per session) to optionally submit score to Firebase

---

### 5.4 Compare Page (`/compare`)

**Purpose:** Compare your rarity score against friends. Currently a UI skeleton.

**Sections:**
- Back to Home link
- "Compare Rarity" heading (gradient on "Rarity")
- Invite input + button (input is functional but not wired to backend)
- 4 mock comparison bars (You, Alex R., Jamie L., Sam T.) with animated fill

**Status:** ⚠️ Partial — UI exists; real friend-invite and score-linking not implemented.

---

### 5.5 Leaderboard Page (`/leaderboard`)

**Purpose:** Show the top 50 rarest scores submitted globally.

**Data source:** Firebase Firestore collection `leaderboard`, ordered by `score DESC`, limit 50. Uses `onSnapshot` for real-time updates. Falls back to 10 hard-coded entries if Firebase fails or is empty.

**Sections:**
- Back to Home link
- "Global Leaderboard" heading (gradient on "Leaderboard")
- Subtitle + red "LIVE" pulsing badge
- Loading state (pulse animation with translated loading text)
- Entry cards (rank, display name, country flag, tier emoji + name, 1-in-X, score, time ago)
- Top 3 entries have gold/silver/bronze rank color and gradient background
- Error message (if Firebase fails — shown alongside fallback data)
- "Take Quiz →" CTA at bottom

**Re-renders:** Every 60 seconds via `setInterval` to keep relative timestamps accurate.

---

### 5.6 About Page (`/about`)

**Purpose:** Explain the project, answer FAQs, provide embed code.

**Sections:**
- Back to Home link
- "About **Unique.com**" heading (gradient on brand)
- Subtitle: two lines explaining the concept
- 4 feature cards: Science-backed, Fully anonymous, Probability engine, Built for curiosity
- FAQ accordion (3 questions): How is score calculated? Where does data come from? Is my data stored?
- Embed Widget section: syntax-highlighted iframe snippet + "Copy" button (clipboard API)
- CTA card: "Ready to find out?" + link to quiz

---

## 6. Quiz — All Steps

The quiz uses a single `Quiz` component with a `step` state (0–8). Steps are defined by `getSteps(t)` which returns the label and emoji for each step's eyebrow. All step labels pull from `t.quiz.questions.*`.

### Step 1 — Age & Name (step index: 0)
| Property | Value |
|---|---|
| Question | "Let's get started." |
| Inputs | Text (name, optional) + Number (age, required) |
| Validation | Age required; must be 13–100 |
| Emoji | 🎂 |

### Step 2 — Gender (step index: 1)
| Property | Value |
|---|---|
| Question | "What is your gender?" |
| Input type | `<OptionGrid>` — 2 columns |
| Options | Male ♂ · Female ♀ · Non-binary ⚧ · Prefer not to say · |
| Validation | Must select one |
| Emoji | 🧬 |

> **Note:** Gender is collected for UI purposes but is **not** currently used in the probability calculation (no gender trait in `TRAITS`).

### Step 3 — Country (step index: 2)
| Property | Value |
|---|---|
| Question | "Where are you from?" |
| Input type | Custom `<CountrySelect>` (search with dropdown) |
| Options | 195 countries (full list in `Quiz.jsx` `COUNTRIES` array) |
| Validation | Must select a country |
| Emoji | 🌍 |

> **Note:** Country is collected but not currently used in probability calculation.

### Step 4 — Education (step index: 3)
| Property | Value |
|---|---|
| Question | "What is your highest education level?" |
| Input type | `<select>` dropdown (styled) |
| Options | No formal schooling · Primary school · Secondary / High school · Bachelor's degree · Master's degree · PhD / Doctorate |
| Validation | Must select one |
| Emoji | 🎓 |

### Step 5 — Birthday (step index: 4)
| Property | Value |
|---|---|
| Question | "When is your birthday?" |
| Input type | 3 `<select>` dropdowns: Day (1–31) · Month (Jan–Dec) · Year (1950–2010) |
| Validation | All three must be selected |
| Purpose | Used to calculate birthday twin counts (not used in rarity score) |
| Emoji | 🎉 |

### Step 6 — Handedness (step index: 5)
| Property | Value |
|---|---|
| Question | "Are you left- or right-handed?" |
| Input type | `<OptionGrid>` — 3 columns |
| Options | Right 🤜 · Left 🤛 · Ambidextrous 🤲 |
| Validation | Must select one |
| Emoji | ✋ |

### Step 7 — Blood Type (step index: 6)
| Property | Value |
|---|---|
| Question | "What is your blood type?" |
| Input type | `<OptionGrid>` — 3 columns |
| Options | A+ · A- · B+ · B- · AB+ · AB- · O+ · O- · Unknown |
| Validation | Must select one |
| Emoji | 🩸 |

### Step 8 — Eye & Hair Color (step index: 7)
| Property | Value |
|---|---|
| Question | "Your eye & hair color" |
| Input type | Two `<OptionGrid>` — 3 columns each |
| Eye options | Brown · Blue · Green · Hazel · Gray · Other |
| Hair options | Black · Brown · Blonde · Red · White · Gray |
| Validation | Both must be selected |
| Emoji | 👁️ |

> **Note:** Hair color is collected but only Eye Color is currently wired into `TRAITS` for scoring.

### Step 9 — Skills & Hobbies (step index: 8)
| Property | Value |
|---|---|
| Question | "Your Skills & Hobbies ⚡" |
| Input type | `<SkillsSelection>` — tabbed chip picker |
| Tabs | Physical Skills · Technical Skills · Creative & Other |
| Validation | None — optional |
| Emoji | ⚡ |

**All available skills (30 total):**

*Physical:* 🏊 Swimming · 🏇 Horse Riding · 🚗 Driving (Car) · 🏍️ Riding (Bike/Motorbike) · 🤸 Gymnastics · 🥊 Martial Arts · 🧗 Rock Climbing · ⛷️ Skiing/Snowboarding · 🤿 Scuba Diving · 🪂 Skydiving

*Technical:* 💻 Programming/Coding · 📈 Trading/Investing · ✈️ Flying a Plane · 🔧 Mechanical Repair · ⚕️ Medical Training · 🎛️ Music Production · 🔬 Scientific Research · 🌐 Multiple Languages (3+) · 🤖 AI/Machine Learning · 🎮 Game Development

*Creative & Other:* 🎨 Painting/Drawing · 🎵 Playing Instrument · 📷 Photography · ✍️ Writing/Authoring · 🎭 Acting/Theatre · 🧁 Professional Cooking/Baking · 🪡 Tailoring/Fashion Design · 🌱 Farming/Agriculture · ⚖️ Legal Knowledge · 🕌 Religious Scholarship

---

## 7. Scoring Logic

All scoring logic lives in `src/data/rarityData.js` in the `calculateScore(answers)` function.

### Step 1 — Answer Normalisation (in `Result.jsx`)

Before calling `calculateScore`, raw quiz answers are normalised by `normaliseAnswers()`:

```js
// Maps quiz answer keys → rarityData keys
hand      → handedness
eyeColor  → eyeColor
blood     → bloodType
education → education  (also passes through EDUCATION_MAP)
age       → ageGroup   (bucketed via AGE_BUCKET_MAP)
skills    → skills     (array, passed through directly)
```

Education values are mapped:
| Quiz value | rarityData key |
|---|---|
| No formal schooling | No formal education |
| Primary school | Primary school |
| Secondary / High school | High school |
| Bachelor's degree | Bachelor's degree |
| Master's degree | Master's degree |
| PhD / Doctorate | Doctorate / PhD |

Age is bucketed:
| Age range | Bucket |
|---|---|
| 13–17 | Under 18 |
| 18–24 | 18–24 |
| 25–34 | 25–34 |
| 35–44 | 35–44 |
| 45–54 | 45–54 |
| 55–64 | 55–64 |
| 65+ | 65+ |

### Step 2 — Combined Probability

For each normalised answer, the fraction is looked up in the `TRAITS` map and multiplied together:

```js
combinedProbability = fraction_1 × fraction_2 × fraction_3 × … × fraction_n
```

Skills are an array — each selected skill's fraction is included individually.

### Step 3 — Logarithmic Scaling

```js
raw   = -Math.log10(combinedProbability)
score = ((raw - 0) / (12 - 0)) × 100   // clamped to [0, 100]
```

- `raw = 0` → score 0 (probability = 1, everyone shares this)
- `raw = 12` → score 100 (probability = 10⁻¹², one-in-a-trillion)
- A typical 5-trait answer sits around score 40–60

### Step 4 — 1-in-X Calculation

```js
oneIn = Math.round(1 / combinedProbability)
```

### Step 5 — Tier Assignment

Tiers are checked in descending `minScore` order (Mythic first):

```js
const tier = TIERS.find(t => score >= t.minScore) ?? TIERS[last]
```

### Return Value

```js
{
  score,          // number, 1 decimal place, 0–100
  rarityTier,     // string e.g. "Legendary"
  tierColor,      // hex string e.g. "#FFD700"
  tierEmoji,      // string e.g. "⚡"
  oneIn,          // integer e.g. 4200000
  traitBreakdown  // Array<{ trait, value, fraction, percentage, isSkill }>
}
```

---

## 8. Rarity Tiers

| Tier | Min Score | Color | Emoji | Percentile (Home page) |
|---|---|---|---|---|
| Mythic | 90 | `#FF6B9D` | 🌌 | Top 0.01% |
| Legendary | 75 | `#FFD700` | ⚡ | Top 0.5% |
| Epic | 60 | `#A855F7` | 💎 | Top 3% |
| Rare | 45 | `#3B82F6` | 🔷 | Top 10% |
| Uncommon | 30 | `#10B981` | 🌿 | Top 25% |
| Common | 0 | `#6B7280` | ⚪ | Top 50% |

**Cosmic Mode equivalents:**

| Normal | Cosmic |
|---|---|
| Common | Stardust ✨ |
| Uncommon | Comet ☄️ |
| Rare | Nebula 🌌 |
| Epic | Supernova 💥 |
| Legendary | Pulsar 💫 |
| Mythic | Singularity 🕳️ |

---

## 9. Features List

| Feature | Status | Notes |
|---|---|---|
| Animated score reveal (slot counter) | ✅ Built | easeOutExpo over 3.2s, log-space interpolation |
| Shareable Canvas PNG score card | ✅ Built | 1080×1080, hex grid pattern, gold number |
| Share buttons (Twitter, WhatsApp, LinkedIn) | ✅ Built | Opens native share URLs |
| Copy link button | ✅ Built | Clipboard API |
| Challenge a Friend button | ⚠️ Partial | Copies link + navigates to Compare; no real challenge system |
| Global Leaderboard | ✅ Built | Firebase Firestore real-time, fallback data, top 50 |
| Leaderboard submission modal | ✅ Built | Auto-pops 2.8s after result; once per session |
| Birthday uniqueness twins | ✅ Built | Month + exact birthday twin counts |
| Cosmic scale toggle | ✅ Built | 1250× multiplier, relabelled tiers |
| Random famous person comparison | ✅ Built | 10 profiles, shuffle button, tier comparison |
| Skills & hobbies step | ✅ Built | 30 skills across 3 tabs |
| Skill combination rarity stories | ✅ Built | 16 narrative paths in `storyGenerator.js` |
| Daily rare fact widget | ✅ Built | 30 facts, deterministic by day-of-year |
| Embed widget (`?embed=true`) | ✅ Built | Works on /quiz and /result; hides chrome |
| Hindi language (EN ↔ HI) | ✅ Built | Full translation via LanguageContext |
| PWA support | ✅ Built | manifest.json + service worker |
| Install prompt (iOS + Android) | ✅ Built | 30-second delay, session-dismissable |
| Mobile responsiveness | ✅ Built | Responsive layouts across all pages |
| Dark mode | ✅ Built | Dark-only by design; no light mode toggle |
| Trait breakdown bar chart | ✅ Built | Animated, log-scale fill, rarity labels |
| Multi-Skilled Anomaly banner | ✅ Built | Shown when ≥3 rare skills |
| Country flag on leaderboard | ✅ Built | `getFlag()` lookup from `flags.js` |
| Relative timestamps on leaderboard | ✅ Built | Updates every 60 seconds |
| Compare page (real scores) | ❌ Not yet | Currently shows mock data only |
| Google Analytics / tracking | ❌ Not yet | — |
| AI-generated rarity story | ⚠️ Partial | Rule-based in `storyGenerator.js`; not AI |
| Certificate / PDF download | ❌ Not yet | — |
| Hair color in scoring | ⚠️ Partial | Collected but fraction not in TRAITS |
| Gender in scoring | ⚠️ Partial | Collected but fraction not in TRAITS |
| Country in scoring | ⚠️ Partial | Collected but fraction not in TRAITS |

---

## 10. Components

### `<Footer />` — `src/components/Footer.jsx`
**Props:** None  
**Returns:** `<footer>` element with brand column (logo, tagline, social icons) and nav columns (Explore: Quiz/Leaderboard/Compare, Learn: About/How-It-Works/Data Sources)  
**Uses:** `useTranslation()`, `Link` from react-router-dom  
**Social icons:** Inline SVG for X/Twitter, Instagram, GitHub

---

### `<DailyFact />` — `src/components/DailyFact.jsx`
**Props:** None  
**Returns:** `<aside>` with 💡 header and today's fact string  
**Uses:** `getDailyFact()` from `../data/facts`  
**Determination:** `dayOfYear() % 30` — same fact all day, changes at midnight

---

### `<InstallPrompt />` — `src/components/InstallPrompt.jsx`
**Props:** None  
**Returns:** A slide-up banner or `null`  
**State:** `deferredPrompt`, `show`, `isIOS`, `dismissed`  
**Logic:**
- Only renders on mobile viewport (`≤768px`)
- Checks `display-mode: standalone` — does nothing if already installed
- Android: captures `beforeinstallprompt` event; calls `prompt()` on button click
- iOS: shows manual "Tap Share → Add to Home Screen" instructions
- Shows after 30-second delay
- Dismissed state stored in `sessionStorage` as `pwa-prompt-dismissed`

---

### `<LanguageToggle />` — `src/components/LanguageToggle.jsx`
**Props:** None  
**Returns:** Fixed-position button (top-right, z-50) showing current language label  
**Uses:** `useTranslation()` for `lang`, `toggleLang`, `languageConfig.label`  
**Labels:** `🇬🇧 EN` (English) or `🇮🇳 HI` (Hindi)

---

### `<OptionGrid />` — internal sub-component of `Quiz.jsx`
**Props:** `options` (array of string | `{label, icon}`), `value` (selected), `onChange` (fn), `cols` (1–4)  
**Returns:** CSS grid of buttons; active button gets `option-btn--active` class

---

### `<CountrySelect />` — internal sub-component of `Quiz.jsx`
**Props:** `value` (string), `onChange` (fn)  
**State:** `query` (search text), `open` (dropdown open)  
**Returns:** Search input + dropdown list; filters COUNTRIES array; picks on mousedown

---

### `<SkillsSelection />` — internal sub-component of `Quiz.jsx`
**Props:** `selected` (string[]), `onChange` (fn)  
**State:** `activeTab` (category name)  
**Returns:** Tab bar + chip grid; toggle chips on/off

---

### `<SlotCounter />` — internal sub-component of `Result.jsx`
**Props:** `target` (number), `className` (string)  
**State:** `display` (animated current value)  
**Returns:** `<span>` with animated number  
**Animation:** easeOutExpo RAF loop over 3200ms, interpolated in log-space

---

### `<HexBadge />` — internal sub-component of `Result.jsx`
**Props:** `tier` (string), `color` (hex), `emoji` (string)  
**Returns:** Hexagonal CSS clip-path badge with emoji, tier name, and glow

---

### `<TraitBar />` — internal sub-component of `Result.jsx`
**Props:** `trait`, `value`, `fraction`, `delay`  
**State:** `width` (animated bar fill %)  
**Returns:** Row with trait name, rarity label badge, value, percentage, and animated fill bar  
**Rarity classification:** `<1%` Ultra Rare · `<5%` Rare · `<20%` Uncommon · else Common

---

### `<FamousCompareSection />` — internal sub-component of `Result.jsx`
**Props:** None  
**State:** `person`, `result`, `isRolling`  
**Returns:** Section with shuffle button; displays randomly selected famous person's tier + 1-in-X vs yours  
**Data:** Uses `famousProfiles` array and calls `calculateScore()` on each profile's traits

---

### `useTranslation()` — `src/contexts/LanguageContext.jsx`
**Returns:** `{ lang, setLang, toggleLang, languageConfig, t }`  
- `lang`: `'en'` or `'hi'`
- `t`: the full translation object for the current language
- `toggleLang()`: switches between en and hi, persists to `localStorage`
- `languageConfig`: `{ key, label, data }` for current language

---

## 11. Data Files

### `src/data/rarityData.js`

**`TRAITS`** — probability map for each scoreable trait:

| Trait category | Keys | Fraction range |
|---|---|---|
| `handedness` | Left, Right, Ambidextrous | 0.01 – 0.89 |
| `eyeColor` | Brown, Blue, Green, Hazel, Gray, Other | 0.02 – 0.79 |
| `bloodType` | O+, A+, B+, AB+, O-, A-, B-, AB- | 0.006 – 0.380 |
| `education` | No formal – Doctorate | 0.01 – 0.28 |
| `ageGroup` | Under 18 – 65+ | 0.08 – 0.24 |
| `skills` | 30 skills | 0.001 – 0.50 |

**`TIERS`** — array of 6 tier objects: `{ name, minScore, color, emoji }`

**`calculateScore(answers)`** — see Section 7 for full documentation

---

### `src/data/facts.js`

- **30 daily facts** in the `FACTS` array (index 0–29)
- Each fact is a single English string about human biological or statistical rarity
- **`getDailyFact()`**: returns `FACTS[dayOfYear() % 30]` — deterministic, changes at midnight

Example facts:
- "Only ~2% of the world has naturally green eyes."
- "Fewer than 1% of people are truly ambidextrous."
- "Just 0.6% of the global population has AB- blood."

---

### `src/data/famousProfiles.js`

**10 famous profiles**, each with `{ name, emoji, fact, traits }`:

| # | Name | Emoji | Handedness | Eye | Blood | Education |
|---|---|---|---|---|---|---|
| 1 | Elon Musk | 🚀 | Left | Green | O- | Self-taught |
| 2 | Albert Einstein | 🧠 | Right | Brown | A- | PhD |
| 3 | Marie Curie | 🔬 | Right | Gray | A+ | PhD |
| 4 | Nikola Tesla | ⚡ | Right | Blue | Unknown | Some College |
| 5 | Leonardo da Vinci | 🎨 | Ambidextrous | Hazel | Unknown | Self-taught |
| 6 | Cleopatra | 👑 | Right | Brown | Unknown | Master's |
| 7 | Barack Obama | 🏛️ | Left | Brown | AB+ | Professional |
| 8 | Bill Gates | 💻 | Left | Blue | O+ | Some College |
| 9 | Serena Williams | 🎾 | Right | Brown | O+ | High School |
| 10 | Marilyn Monroe | 🌟 | Left | Blue | AB- | High School |

---

### `src/data/flags.js`

- Country name → flag emoji lookup
- Used by `getFlag(countryName)` in the Leaderboard
- Covers ~195 countries

---

### `src/i18n/translations.js`

Exports two objects: `EN` and `HI`. Both have identical key structures.

**Top-level sections:**

| Key | Contents |
|---|---|
| `nav` | back, home, leaderboard, about, quiz, compare, retake |
| `home` | heroTitle, heroSub, startBtn, stats (traits/calc/score), tiersTitle, tiersSub |
| `quiz` | back, step, of, next, finish, questions (all 9 steps), errors (all validation messages) |
| `result` | All result page strings including scale, eyebrow, share, modal, birthday, famous, cosmic |
| `footer` | tagline, explore, learn, howItWorks, dataSources, disclaimer |
| `about` | back, title, subtitles, faqTitle, 3 Q&A pairs, ctaTitle, ctaSub |
| `compare` | backToHome, title, subtitle, placeholder, invite |
| `leaderboard` | back, title, subtitle, live, loading, error |
| `tiers` | Mythic, Legendary, Epic, Rare, Uncommon, Common |
| `sharingText` | Template with `{oneIn}` and `{tier}` placeholders |
| `poweredBy` | "Powered by Unique.com" |

---

### `src/utils/storyGenerator.js`

**`generateStory(name, answers, rawBreakdown)`** — returns a personalised rarity story paragraph.

**16 story paths in priority order:**

| # | Trigger | Story theme |
|---|---|---|
| 1 | ≥5 skills | Polymath / Leonardo da Vinci |
| 2 | Programming + Trading | Tech-Finance intersection |
| 3 | Horse Riding + Swimming + Driving | Complete Warrior |
| 4 | Programming + (Drawing or Instrument) | Creative Tech |
| 5 | Scuba + (Skydiving or Flying) | Sky & Sea |
| 6 | Medical + Martial Arts | Healer-Warrior |
| 7 | Biking + Climbing + Skiing | Adrenaline Junkie |
| 8 | Mechanical + (Farming or Cooking or Tailoring) | The Maker |
| 9 | Languages + (Writing or Acting) | The Communicator |
| 10 | Research + (Legal or Religious) | The Scholar |
| 11 | ≥3 creative skills | The Creator |
| 12 | AI/Coding/GameDev + ≥2 skills | Tech Explorer |
| 13 | Flying alone | Sky pilot |
| 14 | ≥3 physical only | Physical master |
| 15 | Photography + Research | The Observer |
| 16 | Fallback (rare traits / any skills / no skills) | Three generic endings |

---

### `src/firebase.js`

```js
// Initialises Firebase app and exports Firestore db
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",         // ← must be replaced for production
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

---

## 12. Animations & CSS

### `Home.css`

| Animation | Keyframe | Element | Duration | Effect |
|---|---|---|---|---|
| `particle-float` | y: 0 → -30px → 0; opacity oscillates | `.particle` spans | 8–18s random | Floating particles in hero |
| `shimmer` | `translateX(-100% → 150%)` | `.cta-btn__shimmer` pseudo | 2.5s infinite | Light sweep across button |
| `scroll-hint-bounce` | y: 0 → 8px | `.scroll-hint__dot` | 1.5s infinite | Bouncing scroll indicator |
| `blob-pulse` | scale + opacity | `.glow-blob` | 6s/8s infinite | Background glow breathing |
| `hero-fade-up` | y: 30px → 0; opacity: 0 → 1 | `.hero__content` children | 0.6–0.9s | Staggered hero entrance |

### `Quiz.css`

| Animation | Keyframe | Element | Duration | Effect |
|---|---|---|---|---|
| `slide-in-forward` | x: 60px → 0; opacity: 0 → 1 | `.quiz-card--forward` | 0.35s ease-out | Card slides in from right |
| `slide-in-back` | x: -60px → 0; opacity: 0 → 1 | `.quiz-card--back` | 0.35s ease-out | Card slides in from left |
| `blob-drift-1` | large translate + rotate path | `.quiz-blob--1` | 18s infinite | Background blob drift |
| `blob-drift-2` | offset translate + rotate | `.quiz-blob--2` | 22s infinite | Second blob drift |
| `finish-pulse` | box-shadow expand → contract | `.quiz-btn--finish` | 2s infinite | Finish button glow pulse |
| `dot-pop` | scale: 0 → 1.3 → 1 | `.quiz-step-dot.done` | 0.25s | Step dot completes |

### `Result.css`

| Animation | Keyframe | Element | Duration | Effect |
|---|---|---|---|---|
| `result-in` | y: 24px → 0; opacity: 0 → 1 | `.result-content--in` | 0.7s ease-out | Result reveal on load |
| `orbit` | rotate 360° | `.orbit-container` | 8s linear infinite | Moon orbits Earth |
| `earth-spin` | rotate360° | `.earth-texture` | 20s linear infinite | Earth texture rotation |
| `hex-glow-pulse` | box-shadow size oscillation | `.hex-glow` | 2.5s infinite | Hex badge aura pulse |
| `bar-fill` | width: 0 → target% | `.trait-fill` | via JS timeout + CSS transition | Trait bar fill animation |
| `cosmic-star` | random opacity flicker | `.cosmic-bg::before` | 3s infinite | Star field shimmer |
| `slot-count` | controlled by RAF in JS | `SlotCounter` span | 3.2s | easeOutExpo number count |
| `scale-switch-slide` | thumb translateX | `.scale-thumb` | 0.35s ease | Toggle slide |

### `Footer.css`

| Animation | Keyframe | Element | Duration | Effect |
|---|---|---|---|---|
| `footer-link-slide` | `::after` underline scaleX 0 → 1 | `.site-footer__link:hover` | 0.25s | Link underline reveal |

### `InstallPrompt.css`

| Animation | Keyframe | Element | Duration | Effect |
|---|---|---|---|---|
| `prompt-slide-up` | y: 80px → 0; opacity: 0 → 1 | `.install-prompt--in` | 0.4s ease-out | Banner slides up from bottom |

---

## 13. PWA Details

### `public/manifest.json`

| Field | Value |
|---|---|
| `name` | Unique.com |
| `short_name` | Unique |
| `description` | Discover how rare you are among 8 billion people on Earth. |
| `start_url` | `/` |
| `display` | `standalone` |
| `orientation` | `portrait-primary` |
| `theme_color` | `#6C47FF` |
| `background_color` | `#1A1A2E` |
| `icons` | SVG 192×192 + SVG 512×512 |
| `categories` | entertainment, lifestyle |

> ⚠️ Note: SVG icons may not be accepted by all platforms for PWA installation. PNG versions should be added for broader compatibility.

### Service Worker (`public/sw.js`)

**Cache name:** `unique-v1`

**Strategy:**
- **Install:** Pre-caches app shell: `/`, `/index.html`, `/manifest.json`, `/src/main.jsx`
- **Activate:** Deletes any old caches not named `unique-v1`; immediately claims clients
- **Navigation requests (HTML):** Network-first → cache fallback → offline response
- **Static assets:** Cache-first → network fallback (caches successful same-origin responses)

### Registration (`src/main.jsx`)

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => console.warn('SW registration failed:', err));
  });
}
```

Only registers on `window.load` to avoid interfering with Vite HMR in development.

### Install Prompt Behaviour

| Platform | Mechanism | User action |
|---|---|---|
| Android/Chrome | `beforeinstallprompt` event | Click "Install" button in banner |
| iOS/Safari | No native event | Manual: Tap Share → Add to Home Screen |
| Desktop Chrome | `beforeinstallprompt` | Not shown (only mobile ≤768px) |

Banner appears after **30 seconds** of browsing. Dismissed state stored in `sessionStorage`.

---

## 14. Known Issues & Limitations

1. **Firebase config is placeholder** — `src/firebase.js` contains `"YOUR_API_KEY"` etc. The leaderboard will fail to write/read without real credentials. Falls back to FALLBACK_ENTRIES gracefully.

2. **`t.result.storyTitle` / `storySub` not translated** — The Rarity Story section header ("Your Rarity Story") and subtext are hardcoded English in `Result.jsx` because these keys were not added to translations.js. They always display in English regardless of language.

3. **Hair color not scored** — `hairColor` is collected in the quiz but the `TRAITS` map has no `hairColor` key. It is silently ignored by `calculateScore()`.

4. **Gender not scored** — Same as above.

5. **Country not scored** — Same as above.

6. **Famous profiles have non-standard education values** — Profiles use keys like `"Self-taught"`, `"Some College"`, `"Professional"`, `"Master's"`, `"PhD"` which do not all exactly match the TRAITS map. Unrecognised values are skipped; scores may be approximate.

7. **SVG-only PWA icons** — Some operating systems (especially older Android) require PNG icons for proper PWA installation. The current manifest uses SVG-only.

8. **Service worker caches `/src/main.jsx`** — This path only exists in Vite dev mode. In production the file is bundled as a hashed JS file. The SW install does not fail (uses `allSettled`), but the cached path is effectively dead in production.

9. **Score card font loading** — The Canvas scorecard tries to use `"Space Grotesk"` which may not be loaded in the Canvas context. Falls back to `"Arial"`. The visual may differ slightly.

10. **Compare page is mock-only** — The friend comparison page shows hardcoded data (`MOCK_USERS`). No real invitation or score sharing system exists.

11. **`counter.ts` and `main.ts` are unused** — Vite scaffold files that were never cleaned up. They will not cause build errors but add noise.

---

## 15. What Is NOT Built Yet

- **Real friend comparison** — No backend for linking two players' scores; Compare page is a UI mockup only
- **Certificate / PDF download** — No printable certificate; only 1080×1080 PNG score card
- **Streak / returning user features** — No local tracking of past scores
- **Light mode / theme toggle** — Dark-only design; no toggle
- **Additional quiz steps** — Original vision included sleep patterns, diet, personality type, etc.
- **Hair color, gender, country scoring** — Collected but not wired into probability calculation
- **Google Analytics / event tracking** — No analytics integration
- **Custom domain DNS setup** — App runs on localhost; no live domain configured
- **Firebase Hosting deployment** — Build + deploy pipeline not yet configured
- **AI-generated story narratives** — Current stories are rule-based; no LLM integration
- **Multi-language (beyond EN/HI)** — Only two languages currently
- **Social login / saved results** — No accounts; results are session-only
- **Email sharing** — No mailto: share option
- **Offline mode beyond app shell** — Service worker caches shell but quiz results are not cached

---

## 16. Deployment Guide

### Step 1 — Build for Production

```bash
npm run build
```

This runs `tsc && vite build`. Output is placed in the `/dist` folder. The build is fully static (HTML + JS + CSS assets).

### Step 2 — Set Up Firebase

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g. `uniquecom`)
3. Enable **Firestore Database** in the Firebase console (start in production mode)
4. Enable **Firebase Hosting**

### Step 3 — Configure Firebase in the App

Replace all placeholder values in `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "uniquecom.firebaseapp.com",
  projectId:         "uniquecom",
  storageBucket:     "uniquecom.appspot.com",
  messagingSenderId: "1234567890",
  appId:             "1:1234567890:web:abcdef123456"
};
```

Get these values from: Firebase Console → Project Settings → Your apps → Web app → Config.

### Step 4 — Set Up Firestore Security Rules

In the Firebase console, go to Firestore → Rules and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{docId} {
      allow read: if true;
      allow create: if request.resource.data.score is number
                    && request.resource.data.score >= 0
                    && request.resource.data.displayName is string
                    && request.resource.data.displayName.size() <= 20;
    }
  }
}
```

### Step 5 — Install Firebase CLI and Deploy

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

When prompted:
- Public directory: `dist`
- Single-page app: **Yes**
- Overwrite index.html: **No**

```bash
npm run build
firebase deploy --only hosting
```

### Step 6 — Expected Live URL

```
https://uniquecom.web.app
https://uniquecom.firebaseapp.com
```

### Step 7 — Connect a Custom Domain

1. Firebase Console → Hosting → Add custom domain
2. Enter your domain (e.g. `unique.com`)
3. Add the provided DNS records in your domain registrar
4. Wait for SSL certificate provisioning (15–60 minutes)

---

## 17. Future Features Roadmap

Listed in recommended priority order:

| Priority | Feature | Why |
|---|---|---|
| 🔴 1 | **Replace Firebase placeholder config** | Leaderboard currently writes to a broken project; first thing needed for a live app |
| 🔴 2 | **Deploy to Firebase Hosting** | Make the app publicly accessible |
| 🟠 3 | **Add PNG PWA icons** | SVG icons fail on older devices; add 192×192 and 512×512 PNGs |
| 🟠 4 | **Wire hair color + gender into scoring** | More traits = more precision = higher viral claim ("1 in X" gets larger) |
| 🟠 5 | **Country-weighted scoring** | E.g., O+ is common in India but rarer in some Nordic countries |
| 🟡 6 | **Google Analytics / Mixpanel** | Track quiz completion rate, share click rate, leaderboard submissions |
| 🟡 7 | **Real friend challenge system** | Generate a shareable link with encoded score params; landing page decodes and shows comparison |
| 🟡 8 | **Additional quiz steps** | Sleep hours, diet type, personality type (MBTI), birth order, native language |
| 🟢 9 | **AI-generated rarity story** | Replace rule-based stories with GPT-4o mini API call for truly personalised narratives |
| 🟢 10 | **Streak / returning user badge** | Track visit history in localStorage; show "You're back!" badge with updated score |
| 🟢 11 | **Certificate PDF download** | Printable "Certificate of Rarity" with name, score, tier, date |
| 🟢 12 | **Premium tier / paywalled report** | Full PDF report with all trait percentiles; Stripe integration for one-time payment |
| 🔵 13 | **Additional languages** | Spanish, French, Portuguese for LatAm/Europe reach |
| 🔵 14 | **Personalised email** | Enter email, receive "Your Rarity Certificate" PDF — doubles as mailing list |

---

## 18. Recent Updates & Firebase Bug Fixes (March 15, 2026)

Today, significant improvements were made to the Global Leaderboard's data synchronisation and error handling, ensuring robust real-time capabilities even when Firebase rules restrict certain operations.

### What Was Fixed
1. **Firestore Real-time Sync across Tabs:**
   - **Issue:** Tabs were showing different leaderboard states because Firestore was disabled initially, forcing the app to fall back to `localStorage` which doesn't sync natively across active tabs.
   - **Fix:** Added a `window.addEventListener('storage')` hook in `Leaderboard.jsx` so the offline fallback now instantly synchronises score updates across all open tabs.
2. **Firestore Security Rules Override Bug:**
   - **Issue:** The `upsertEntry` function was using `setDoc(docRef, data, { merge: true })`. However, the newly applied Firebase Security Rules only allowed `create` (not `update`), causing silent permission denials.
   - **Fix:** Removed `{ merge: true }` so the function strictly performs a `create` operation. Since every leaderboard attempt generates a unique UUID, there is no risk of overwriting existing records, and this change perfectly aligns with the security rules.
3. **Graceful Error Handling for Malformed Documents:**
   - **Issue:** Injecting test scores without full profiles (e.g., missing `tier` or `score`) caused a UI crash in React (`TypeError: Cannot read properties of undefined`).
   - **Fix:** Implemented default fallback values (`tier = 'Common'`, `score = 0`, `country = 'Global'`, `topSkills = []`) when mapping over Firestore documents. The UI now gracefully renders incomplete records without crashing the application.

---

*This document was generated from a complete read of every source file in the project. Any new files or features added after this date should be documented here.*
