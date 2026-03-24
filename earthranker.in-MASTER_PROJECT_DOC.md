# 🌍 Earth Ranker — Master Project Documentation

> **Last Updated:** March 23, 2026  
> **Status:** 🟢 Live & Deployed  
> **Live URL:** [earthranker.himanshurajak.in](https://earthranker.himanshurajak.in)  
> **Stack:** React 18 · Vite 8 · Tailwind CSS 3 · Firebase Firestore · Vercel Edge Functions · Groq AI

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [How To Start The Project](#2-how-to-start-the-project)
3. [Tech Stack](#3-tech-stack)
4. [Complete Folder & File Structure](#4-complete-folder--file-structure)
5. [Design System](#5-design-system)
6. [Every Page — Detailed Breakdown](#6-every-page--detailed-breakdown)
7. [Quiz — All Steps](#7-quiz--all-steps)
8. [Scoring Logic](#8-scoring-logic)
9. [Rarity Tiers](#9-rarity-tiers)
10. [Features List](#10-features-list)
11. [Components](#11-components)
12. [Data Files](#12-data-files)
13. [Animations & CSS](#13-animations--css)
14. [PWA Details](#14-pwa-details)
15. [Security Audit Report](#15-security-audit-report)
16. [Known Issues & Limitations](#16-known-issues--limitations)
17. [What Is NOT Built Yet](#17-what-is-not-built-yet)
18. [Deployment Guide](#18-deployment-guide)
19. [Future Features Roadmap](#19-future-features-roadmap)
20. [Recent Updates (March 2026)](#20-recent-updates-march-2026)

---

## 1. Project Overview

**Earth Ranker** is a viral personality rarity app that calculates how statistically unique a person is among the 8.28 billion people on Earth. Users answer a ~50+ trait quiz covering biological, sociological, and personal characteristics. The app multiplies independent trait probabilities to produce:

- A **Rarity Score** (0–100)
- A **Rarity Tier** (Common → Mythic)
- A **"1 in X Billion"** figure showing exactly how rare their combination is

### Original Idea
Conceived as a viral curiosity tool — "What makes you unique?" — where even if each individual trait is common, the *combination* is almost always extraordinarily rare.

### Core Value Proposition
- **Uniqueness Discovery**: Users see their rank (e.g., "You are 1 in 8.28 Billion")
- **Viral Engagement**: Shareable certificates, friend-challenge mechanics
- **AI-Driven Personalization**: Personalized rarity narratives via LLM
- **Global Competition**: Real-time Firestore leaderboard

### Current Status
- ✅ Full quiz flow (9 steps) working end-to-end
- ✅ Real probability scoring engine
- ✅ Firebase Firestore leaderboard (real-time, with fallback)
- ✅ Social share buttons (Twitter, WhatsApp, LinkedIn, copy link)
- ✅ Downloadable PNG score card (Canvas API)
- ✅ Birthday twin calculation
- ✅ Cosmic scale toggle (Earth vs Universe mode)
- ✅ Famous person comparison (10 profiles)
- ✅ Personalised rarity story (AI via Groq Llama 3.1)
- ✅ Daily Rare Fact widget
- ✅ Embed widget (`?embed=true` query param)
- ✅ Hindi language support (EN ↔ HI toggle)
- ✅ PWA — installable on Android and iOS
- ✅ Mobile responsive
- ✅ Secure AI proxy (Vercel Edge Function)

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
> On Windows with PowerShell execution policy restrictions:
> ```bash
> cmd /c "npm run dev"
> ```

**4. Open in browser**
```
http://localhost:5173
```

**5. Stop the server** — Press `Ctrl + C`

### Other Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Build for production (outputs to `/dist`) |
| `npm run preview` | Preview the production build locally |

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 8, Tailwind CSS 3 |
| Hosting | Vercel (static + Edge Functions) |
| Database | Firebase Firestore (leaderboard) |
| AI | Groq API — Llama 3.1 (personalized stories) |
| Backend Proxy | Vercel Edge Functions (`api/generate-story.js`) |
| State Management | React Context (Language + Theme) |
| Analytics | Google Analytics 4 (GA4) |
| PWA | Service Worker + Web App Manifest |
| Graphics | Canvas API (scorecard), SVG iconography |
| Routing | React Router 7 |

---

## 4. Complete Folder & File Structure

```
Earth Ranker/
├── api/
│   └── generate-story.js          # Vercel Edge Function — secure AI proxy for Groq
│
├── public/                        # Static files served as-is
│   ├── favicon.svg
│   ├── icons.svg
│   ├── og-preview.svg             # Open Graph social preview image
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service Worker (caching strategy)
│   └── icons/
│       ├── icon-192.svg
│       └── icon-512.svg
│
├── src/
│   ├── main.jsx                   # React root mount + SW registration
│   ├── App.jsx                    # Router setup, LanguageProvider, global layout
│   ├── globals.css                # CSS variables, resets, utility classes (.glass-card, .text-gradient)
│   ├── style.css                  # Additional global styles
│   ├── firebase.js                # Firebase app init + Firestore db export
│   │
│   ├── pages/
│   │   ├── Home.jsx               # Landing page: hero, how-it-works, tier showcase
│   │   ├── Home.css
│   │   ├── Quiz.jsx               # 9-step quiz form with validation and animation
│   │   ├── Quiz.css
│   │   ├── Result.jsx             # Result display: score, breakdown, shares, modal, cosmic mode
│   │   ├── Result.css
│   │   ├── Compare.jsx            # Friend comparison (currently mock data)
│   │   ├── Leaderboard.jsx        # Global leaderboard — reads from Firebase Firestore
│   │   └── About.jsx              # FAQ, how it works, embed widget code
│   │
│   ├── components/
│   │   ├── Footer.jsx             # Site footer: logo, nav links, social icons, disclaimer
│   │   ├── Footer.css
│   │   ├── DailyFact.jsx          # "Rare Fact of the Day" card (Result page)
│   │   ├── DailyFact.css
│   │   ├── InstallPrompt.jsx      # PWA install banner (Android native + iOS manual)
│   │   ├── InstallPrompt.css
│   │   └── LanguageToggle.jsx     # Fixed top-right EN/HI toggle
│   │
│   ├── contexts/
│   │   └── LanguageContext.jsx    # React context: language, t(), toggleLang()
│   │
│   ├── i18n/
│   │   └── translations.js        # All EN and HI strings (EN, HI objects)
│   │
│   ├── data/
│   │   ├── rarityData.js          # TRAITS map, TIERS array, calculateScore()
│   │   ├── facts.js               # 30 daily rare facts + getDailyFact()
│   │   ├── famousProfiles.js      # 10 famous person profiles for comparison
│   │   └── flags.js               # Country → flag emoji lookup (getFlag())
│   │
│   └── utils/
│       ├── storyGenerator.js      # generateStory() — 16 skill-combination narrative paths
│       ├── groqStory.js           # AI story generation client (calls Edge Function)
│       └── analytics.js           # GA4 event tracking helpers
│
├── index.html                     # HTML entry: meta tags, root div, script
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── firestore.rules                # Firestore security rules
└── .gitignore
```

---

## 5. Design System

**Theme:** "Deep Purple / Neon" — dark background with vibrant accent gradients.

### CSS Variables (`globals.css`)
```css
--bg-primary: #0a0a0f        /* Near-black page background */
--bg-card: #12121a           /* Card surface */
--bg-glass: rgba(255,255,255,0.04)  /* Frosted glass cards */
--accent-purple: #7c3aed     /* Primary accent */
--accent-cyan: #06b6d4       /* Secondary accent */
--accent-pink: #ec4899        /* Highlight / rare tier */
--text-primary: #f1f5f9       /* Main text */
--text-muted: #64748b         /* Muted text */
--border-glass: rgba(255,255,255,0.08) /* Card borders */
--radius-card: 16px
--shadow-card: 0 8px 32px rgba(0,0,0,0.4)
```

### Typography
- **Display font:** Space Grotesk (Google Fonts)
- **Body font:** Inter (Google Fonts)
- **Mono:** JetBrains Mono (code/stats sections)

### Utility Classes
- `.glass-card` — frosted glass panel
- `.text-gradient` — purple→cyan text gradient
- `.btn-primary` — main CTA button style
- `.badge-tier` — tier label pill

---

## 6. Every Page — Detailed Breakdown

### `Home.jsx` — Landing Page
- **Hero section:** Animated headline, subtitle, CTA "Discover Your Rarity" button → `/quiz`
- **Live counter:** Firebase-backed "X people discovered their rarity today" badge
- **How It Works:** 3-step illustration (Answer → Calculate → Share)
- **Tier Showcase:** Cards showing all 7 tiers from Common to Mythic
- **Feature Cards:** Quiz, AI Story, Leaderboard, Compare previews
- **Footer:** Global `<Footer />` component

### `Quiz.jsx` — The Core Engine (9 Steps)
Multi-step form with progress bar. Each step collects one category of traits. Animated slide transitions between steps. Final step triggers `calculateScore()` and navigates to `/result`.

### `Result.jsx` — Rarity Dashboard
- Animated rarity score counter
- Hex badge with tier color
- Trait breakdown bars (each trait's contribution)
- "1 in X" figure (Earth + Universe mode toggle)
- Birthday twin calculation
- AI-generated story section (from Groq via Edge Function)
- Famous person comparison card
- Share buttons (Twitter, WhatsApp, LinkedIn, copy link)
- Canvas scorecard download (1080×1080 PNG)
- Leaderboard submit button
- `<DailyFact />` widget

### `Leaderboard.jsx` — Global Rankings
- Reads top 100 entries from Firestore in real-time
- Falls back to `localStorage` if offline
- Cross-tab sync via `window.storage` event listener
- Displays: Rank, Name, Score, Tier badge, Country flag, Top Skills

### `Compare.jsx` — Friend Challenge
- Currently shows mock data (`MOCK_USERS`)
- UI displays two score cards side-by-side
- Planned: base64 URL share system for real score comparison

### `About.jsx`
- FAQ accordion
- How the math works
- Embed widget code snippet (`<iframe>` example)

---

## 7. Quiz — All Steps

| Step | Category | Traits Collected |
|---|---|---|
| 1 | Basic Info | Name (display only), Age, Gender |
| 2 | Physical | Height, Handedness, Blood Type, Eye Color, Hair Color |
| 3 | Location | Country, City type (rural/suburban/urban) |
| 4 | Education | Education level, Field of study |
| 5 | Work & Life | Occupation category, Employment status |
| 6 | Skills | Top 3 skills chosen from a list of 20+ |
| 7 | Personality | MBTI type (optional), Sleep hours, Diet type |
| 8 | Unique Facts | Birthday, Birth order, Languages spoken |
| 9 | Review & Submit | Summary of all answers, confirmation |

---

## 8. Scoring Logic

**File:** `src/data/rarityData.js`

The app uses a **Logarithmic Rarity Engine**:

1. Each trait maps to a statistical fraction (probability of having that trait globally)
2. Independent probabilities are multiplied together: `combinedProb = p1 × p2 × ... × pN`
3. `oneIn = Math.round(1 / combinedProb)` — capped at 8,280,000,000
4. Final score (0–100): `score = Math.round((Math.log10(oneIn) / Math.log10(8280000000)) * 100)`

### Example Trait Fractions (from `rarityData.js`)
```js
const TRAITS = {
  bloodType:   { 'O+': 0.38, 'A+': 0.27, 'B+': 0.22, 'AB+': 0.05, ... },
  handedness:  { 'Right': 0.89, 'Left': 0.10, 'Ambidextrous': 0.01 },
  eyeColor:    { 'Brown': 0.79, 'Blue': 0.08, 'Green': 0.02, ... },
  education:   { 'High School': 0.40, 'Bachelor\'s': 0.25, ... },
  // ... 15+ trait categories
}
```

> ⚠️ **Known Gap:** `hairColor`, `gender`, and `country` are collected but not yet wired into `calculateScore()`.

---

## 9. Rarity Tiers

| Tier | Score Range | "1 in X" | Color |
|---|---|---|---|
| Common | 0–14 | < 1,000 | Gray |
| Uncommon | 15–29 | 1K – 100K | Green |
| Rare | 30–44 | 100K – 1M | Blue |
| Epic | 45–59 | 1M – 100M | Purple |
| Legendary | 60–74 | 100M – 1B | Orange |
| Ancient | 75–89 | 1B – 5B | Red |
| Mythic | 90–100 | > 5B | Gold / Rainbow |

---

## 10. Features List

| Feature | Status | Notes |
|---|---|---|
| 9-step animated quiz | ✅ Live | Smooth slide transitions |
| Logarithmic probability scoring | ✅ Live | `rarityData.js` |
| Rarity tiers (7 levels) | ✅ Live | Common → Mythic |
| Canvas scorecard PNG download | ✅ Live | 1080×1080 |
| AI-generated rarity story | ✅ Live | Groq Llama 3.1 via Edge Function |
| Famous person comparison | ✅ Live | 10 profiles |
| Firestore leaderboard | ✅ Live | Real-time top 100 |
| Friend challenge (base64 URL) | ✅ Live | Serverless |
| Social sharing (4 platforms) | ✅ Live | Twitter, WhatsApp, LinkedIn, Copy |
| Daily Rare Fact widget | ✅ Live | 30 facts, date-seeded |
| EN ↔ HI language toggle | ✅ Live | `translations.js` |
| PWA (installable) | ✅ Live | Android + iOS |
| Cosmic scale toggle | ✅ Live | Earth vs Universe mode |
| Birthday twin calculation | ✅ Live | Based on birth date |
| Embed widget (`?embed=true`) | ✅ Live | iframe-embeddable |
| Live daily user counter | ✅ Live | Firebase-backed |
| Google Analytics 4 | ✅ Live | Dynamic injection |

---

## 11. Components

### `<Footer />`
Site-wide footer. Contains: Earth Ranker logo + tagline, navigation links (Home, Quiz, Leaderboard, About), social icon links, legal disclaimer ("For entertainment purposes only").

### `<DailyFact />`
Displays one of 30 rare facts, selected deterministically by day-of-year so every user sees the same fact on the same day. Shown on the Result page below the share buttons.

### `<InstallPrompt />`
- **Android:** Intercepts the native `beforeinstallprompt` event and shows a custom banner
- **iOS:** Detects Safari on iOS and shows manual instructions ("Tap Share → Add to Home Screen")
- Dismissable; stores dismissal in `sessionStorage`

### `<LanguageToggle />`
Fixed-position button (top-right). Reads from `LanguageContext`. Cycles EN → HI → EN. Label shows current language's flag emoji.

---

## 12. Data Files

### `rarityData.js`
- `TRAITS` — object mapping trait categories to probability fractions
- `TIERS` — array of tier objects `{ name, minScore, color, emoji }`
- `calculateScore(answers)` — main scoring function, returns `{ score, oneIn, tier, breakdown }`

### `facts.js`
- Array of 30 rare facts about human biology and statistics
- `getDailyFact()` — returns today's fact using `dayOfYear % 30` index

### `famousProfiles.js`
- 10 celebrity profiles with trait answers matching the quiz format
- Used by Result page for famous comparison feature
- ⚠️ Some education values use non-standard keys (see Known Issues)

### `flags.js`
- Map of country name → flag emoji
- `getFlag(countryName)` helper; returns "🌍" for unknown countries

---

## 13. Animations & CSS

All animations are CSS-only (no JS animation libraries):

- **Particle field:** `Home.css` — floating dot particles in hero
- **Score counter:** `Result.css` — animated number count-up on page load
- **Progress bar:** `Quiz.css` — smooth width transition between steps
- **Card hover:** `.glass-card:hover` — subtle upward translate + glow
- **Tier badge pulse:** keyframe animation for Mythic tier
- **Slide transitions:** Quiz steps slide in/out on step change

---

## 14. PWA Details

**Manifest (`public/manifest.json`):**
```json
{
  "name": "Earth Ranker",
  "short_name": "EarthRanker",
  "theme_color": "#7c3aed",
  "background_color": "#0a0a0f",
  "display": "standalone",
  "start_url": "/"
}
```

**Service Worker (`public/sw.js`):**
- Strategy: Cache-first for app shell, network-first for API calls
- Pre-caches: `index.html`, main JS/CSS bundles, icons
- ⚠️ Known issue: caches `/src/main.jsx` (dev path) which is dead in production

---

## 15. Security Audit Report

*Audited: March 2026*

### 🔴 Critical — NONE
All critical vulnerabilities have been remediated.

### 🟡 Warnings (Fix Soon)

**1. Rate Limiting — `api/generate-story.js`**
- Frontend limits to 3 regenerations per session via `sessionStorage`
- The Edge Function endpoint itself has **no IP-based rate limiting**
- A malicious user can call it directly via `curl` and exhaust Groq quota
- **Fix:** Add Upstash Redis or Vercel KV rate limiter per IP

**2. XSS Risk — `dangerouslySetInnerHTML`**
- Used in `Result.jsx` (L1054) and `About.jsx` (L75) for translation strings with `<strong>` tags
- Safe now (strings from local `translations.js`), but risky if ever moved to a CMS
- **Fix:** Add `dompurify` sanitization or refactor to React components

### ✅ Passed

| Check | Status |
|---|---|
| Secrets scan (no hardcoded keys) | ✅ Passed |
| Groq key moved to server-side only | ✅ Passed |
| `.gitignore` covers all `.env` files | ✅ Passed |
| Firestore rules (no unauthorized writes) | ✅ Passed |
| CORS headers on Edge Function | ✅ Passed |
| No PII logged to console | ✅ Passed |
| Production build scanned — no key leaks | ✅ Passed |
| Dependencies up to date | ✅ Passed |

**DEPLOY SAFE: ✅ YES**

---

## 16. Known Issues & Limitations

1. **`t.result.storyTitle` / `storySub` not translated** — Section headers hardcoded in English in `Result.jsx`; keys missing from `translations.js`
2. **Hair color not scored** — Collected in quiz but no `hairColor` key in `TRAITS` map; silently ignored
3. **Gender not scored** — Same as above
4. **Country not scored** — Same as above
5. **Famous profiles non-standard education keys** — Some profiles use `"Self-taught"`, `"Professional"`, `"Master's"` etc. which don't match TRAITS exactly; scores approximate
6. **SVG-only PWA icons** — Older Android requires PNG icons; may fail PWA install
7. **Service worker caches `/src/main.jsx`** — Dev-only path, dead in production (non-fatal)
8. **Canvas font fallback** — Scorecard tries `"Space Grotesk"`, may fall back to `"Arial"` in Canvas context
9. **Compare page is mock-only** — `MOCK_USERS` hardcoded; no real invitation system yet
10. **`counter.ts` / `main.ts` are unused** — Vite scaffold leftovers; can be deleted safely

---

## 17. What Is NOT Built Yet

- Real friend comparison backend (Compare page is UI mockup only)
- Certificate / PDF download (only PNG scorecard exists)
- Streak / returning user features (no localStorage history tracking)
- Light mode / theme toggle (dark-only)
- Additional quiz steps (sleep, diet, MBTI, birth order)
- Hair color, gender, country wired into probability calculation
- Multi-language beyond EN/HI
- Social login / saved results (session-only)
- Email sharing option
- Full offline quiz result caching

---

## 18. Deployment Guide

### Step 1 — Build
```bash
npm run build
```
Output in `/dist`. Fully static (HTML + JS + CSS).

### Step 2 — Firebase Setup
1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** (production mode)
3. Enable **Firebase Hosting**

### Step 3 — Configure Firebase (`src/firebase.js`)
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

### Step 4 — Firestore Security Rules
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

### Step 5 — Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel
vercel login
vercel --prod
```

Set environment variables in Vercel dashboard:
- `GROQ_API_KEY` — your Groq API key
- `VITE_FIREBASE_*` — all Firebase config values
- `VITE_GA_MEASUREMENT_ID` — Google Analytics ID

### Step 6 — Custom Domain
1. Vercel Dashboard → Domains → Add `earthranker.himanshurajak.in`
2. Add DNS records at your registrar
3. SSL auto-provisioned (15–60 min)

---

## 19. Future Features Roadmap

| Priority | Feature | Reason |
|---|---|---|
| 🔴 1 | Replace Firebase placeholder config | Leaderboard broken without real credentials |
| 🔴 2 | IP-based rate limiting on AI endpoint | Prevent quota exhaustion |
| 🟠 3 | Add PNG PWA icons (192 + 512px) | SVG fails on older devices |
| 🟠 4 | Wire hair color + gender into scoring | More precision = higher "1 in X" = more viral |
| 🟠 5 | Country-weighted scoring | E.g., O+ rarer in Nordic countries than India |
| 🟡 6 | Google Analytics event tracking | Quiz completion rate, share clicks |
| 🟡 7 | Real friend challenge system | Shareable URL with encoded params |
| 🟡 8 | More quiz steps | Sleep, diet, MBTI, birth order, native language |
| 🟢 9 | Certificate PDF download | Printable "Certificate of Rarity" |
| 🟢 10 | Streak / returning user badge | localStorage visit history |
| 🟢 11 | Premium PDF report | Full percentile breakdown; Stripe payment |
| 🔵 12 | Additional languages | Spanish, French, Portuguese |
| 🔵 13 | Personalized email delivery | Certificate PDF via email; doubles as mailing list |
| 🔵 14 | Instagram/TikTok story sharing | Direct share to social platforms |

---

## 20. Recent Updates (March 2026)

### March 15, 2026 — Firebase Leaderboard Fixes

**1. Cross-tab Firestore Sync**
- Problem: Tabs showed different leaderboard states (Firebase fallback to `localStorage` didn't sync across tabs)
- Fix: Added `window.addEventListener('storage')` in `Leaderboard.jsx` for real-time cross-tab sync

**2. Firestore Security Rules Conflict**
- Problem: `upsertEntry` used `setDoc(..., { merge: true })` but rules only allow `create`, causing silent permission denials
- Fix: Removed `{ merge: true }` — now strictly a `create` operation; every entry uses a unique UUID so no overwrite risk

**3. Graceful Handling of Malformed Documents**
- Problem: Test scores missing `tier` or `score` fields caused `TypeError` crashes
- Fix: Default fallbacks in Firestore document mapping (`tier = 'Common'`, `score = 0`, `country = 'Global'`, `topSkills = []`)

### March 23, 2026 — Security Hardening
- Moved Groq API key fully server-side (Vercel Edge Function)
- Implemented Firestore security rules
- Dynamic GA4 injection via Vite env vars
- Build scan confirmed no key leaks in production bundle

---

*This document is the single source of truth for the Earth Ranker project. Update this file whenever new features are added, bugs are fixed, or architecture changes.*

**Built with ❤️ by [Himanshu Rajak](https://himanshurajak.in)**
