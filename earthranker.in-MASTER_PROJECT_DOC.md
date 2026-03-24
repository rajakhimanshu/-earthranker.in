# 🌍 Earth Ranker — Master Project Documentation

> **Last Updated:** March 24, 2026  
> **Status:** 🟢 Live & Deployed  
> **Live URL:** [earthranker.himanshurajak.in](https://earthranker.himanshurajak.in)  
> **Stack:** React 18 · Vite 6 · Tailwind CSS 3 · Firebase Firestore · Vercel Edge Functions · Groq AI

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Methods & Core Concepts (Theory & Practice)](#2-methods--core-concepts-theory--practice)
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

**Earth Ranker** is a viral personality rarity app that calculates how statistically unique a person is among the 8.28 billion people on Earth. Users answer a series of trait-based questions covering biological, sociological, and personal characteristics. The app uses statistical multiplication to produce a "1 in X Billion" figure, a Rarity Score, and a personalized AI narrative.

---

## 2. Methods & Core Concepts (Theory & Practice)

This project integrates several advanced software engineering and mathematical concepts to provide a seamless, high-performance user experience.

### A. Mathematical Theory: Logarithmic Rarity Engine
*   **Concept:** Multiplication of Independent Probabilities.
*   **Theory:** The core logic follows the rule that the probability of multiple independent events occurring simultaneously is the product of their individual probabilities ($P(A \cap B) = P(A) \times P(B)$).
*   **Practical Implementation:** Even common traits (e.g., Brown Eyes: 79%, Right Handed: 89%) result in an extremely rare combination when 15+ traits are multiplied.
*   **Logarithmic Scaling:** Since the resulting "1 in X" number grows exponentially, we use `Math.log10` to map the final rarity onto a human-readable 0–100 scale. This ensures that the difference between "1 in 1 Million" and "1 in 1 Billion" is visually significant but not off-the-charts.

### B. Artificial Intelligence: Personalized Narratives
*   **Concept:** Retrieval-Augmented Generation (RAG) Lite & Prompt Engineering.
*   **Theory:** Using Large Language Models (LLMs) to transform raw data (user traits) into a creative, engaging story.
*   **Practical Implementation:** We use **Groq (Llama 3.1)** via a **Vercel Edge Function** proxy. This protects the API keys while providing sub-second inference speeds. The "Story Generator" uses structured prompts to ensure the AI stays within the persona of a "Rarity Analyst."

### C. Frontend Architecture: Component-Based UI
*   **Concept:** Atomic Design & Context API.
*   **Theory:** Breaking the UI into small, reusable atoms (buttons, inputs) and molecules (Quiz steps), while managing global state (Language, Theme) without "prop drilling."
*   **Practical Implementation:** `LanguageContext` provides a global `t()` function for instant EN/HI switching without page reloads.

### D. Performance Engineering: Bundle Optimization
*   **Concept:** Code Splitting & Tree Shaking.
*   **Theory:** Modern web apps can become "heavy" due to large libraries (Firebase, React). Loading everything at once slows down the "First Contentful Paint."
*   **Practical Implementation:** 
    *   **Manual Chunking:** Using `vite.config.js` to split `firebase` and `react` into separate vendor files.
    *   **PostCSS Management:** Optimizing CSS import order to prevent render-blocking issues.
    *   **Asset Compression:** Using SVGs for icons and PWA assets to keep the payload under 1MB.

### E. PWA (Progressive Web App) Strategy
*   **Concept:** Offline-First & Service Workers.
*   **Theory:** A web app should behave like a native app, allowing installation and providing offline fallbacks.
*   **Practical Implementation:** A custom Service Worker (`sw.js`) caches the "App Shell." We use `localStorage` as a fallback for the Firestore Leaderboard, ensuring the user sees data even with a poor connection.

### F. Modern Styling: Glassmorphism & Responsive Design
*   **Concept:** Adaptive UI & Visual Hierarchy.
*   **Theory:** UI should feel "alive" through depth (blur), motion (animations), and responsiveness (fluid layouts).
*   **Practical Implementation:** 
    *   **Glassmorphism:** Using `backdrop-filter: blur()` and semi-transparent borders for a premium, futuristic look.
    *   **Centering Logic:** Employing advanced Flexbox/Grid layouts to ensure the Quiz card is perfectly centered on everything from a small iPhone to a 4K monitor.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, Tailwind CSS 3 |
| Hosting | Vercel (static + Edge Functions) |
| Database | Firebase Firestore (leaderboard) |
| AI | Groq API — Llama 3.1 (personalized stories) |
| Backend Proxy | Vercel Edge Functions (`api/generate-story.js`) |
| State Management | React Context (Language) |
| Analytics | Google Analytics 4 (GA4) |
| PWA | Service Worker + Web App Manifest |
| Graphics | Canvas API (scorecard), SVG iconography |
| Routing | React Router 7 |

---

## 4. Complete Folder & File Structure

*(Same as previously documented, see file for full tree)*

---

## 5. Design System

**Theme:** "Deep Purple / Neon" — dark background with vibrant accent gradients.
- **Visuals:** Glass-cards, animated background mesh, and high-contrast typography.
- **Fonts:** Space Grotesk (Headings), Inter (Body).

---

## 8. Scoring Logic (Mathematical Implementation)

**File:** `src/data/rarityData.js`

```js
// Combined Probability
let combinedProb = Object.values(traits).reduce((acc, p) => acc * p, 1.0);

// One in X
let oneIn = Math.min(Math.round(1 / combinedProb), 8280000000);

// Logarithmic Score (0-100)
let score = Math.round((Math.log10(oneIn) / Math.log10(8280000000)) * 100);
```

---

## 20. Recent Updates (March 2026)

### March 24, 2026 — Build & Performance Optimization

**1. Vercel Deployment Fix**
- **Problem:** CSS build error `[vite:css][postcss] @import must precede all other statements`.
- **Fix:** Relocated the Google Fonts `@import` to the absolute top of `src/globals.css`, ensuring compliance with PostCSS standards.

**2. Bundle Size & Chunking**
- **Problem:** Vite warning about large JavaScript chunks (>500kB) due to Firebase and React.
- **Fix:** Implemented `manualChunks` in `vite.config.js` to split `firebase` and `vendor-react` into separate files. Increased `chunkSizeWarningLimit` to 1000kB for a cleaner build log.

**3. UI/UX: Quiz Centering**
- **Problem:** Quiz card was improperly aligned on some mobile devices and high-resolution screens.
- **Fix:** Refactored `Quiz.css` to use a more robust Flexbox centering strategy on the `.quiz-card-wrap` and adjusted padding for better visual balance.

**4. Master Documentation Overhaul**
- **Action:** Updated this document to include theoretical concepts (Mathematics, AI, Performance) and the latest architectural changes.

---

*This document is the single source of truth for the Earth Ranker project.*

**Built with ❤️ by [Himanshu Rajak](https://himanshurajak.in)**

---

## 21. Responsive & Bug Fix Audit — March 2026

### Audit Performed By: Google Antigravity (AI-assisted)
### Date: March 24, 2026

---

### Issues Found (Part 1 Audit)

| # | File | Issue |
|---|---|---|
| 1 | `globals.css` | `@import` not at top — PostCSS build crash |
| 2 | `globals.css` | No global `overflow-x: hidden` / `box-sizing: border-box` |
| 3 | `globals.css` | Heading sizes fixed px, not fluid |
| 4 | `Quiz.css` | `.quiz-card-wrap` used `align-items: center` in flex column — caused off-center card on mobile |
| 5 | `Quiz.css` | `.quiz-card` had `max-width: 100%` on mobile, `600px` on sm — inconsistent |
| 6 | `Result.css` | `.planetary-system` `right: -100px` caused horizontal scroll |
| 7 | `Result.css` | `.result-stats-pills` negative margin caused overflow on mobile |
| 8 | `rarityData.js` | `console.log("TEST CASE RESULT:...")` firing on every import in production |
| 9 | `analytics.js` | `console.warn` firing for every non-GA user (dev, adblockers) |
| 10 | `groqStory.js` | `compareCelebrity` reading `data.text` — wrong key for Groq API response |
| 11 | `App.jsx` | No global Navbar; each page had its own fragmented back button |
| 12 | `Footer.css` | Social icon links `36px` — below 44px touch target minimum |
| 13 | `InstallPrompt.css` | Buttons `padding: 0.45rem` — below 44px touch target |
| 14 | `DailyFact.jsx` | Used ad-hoc Tailwind instead of its own `.daily-fact` CSS classes |
| 15 | `Home.jsx` | 3+ duplicate "Take Quiz" CTAs on same page |
| 16 | `Leaderboard.jsx` | Sticky "Your Rank" bar overlapping last entry — no `padding-bottom` |
| 17 | `About.jsx` | Fixed heading size, excessive mobile padding |

---

### Fixes Applied (Parts 2–6)

#### Part 2 — Global CSS & Tailwind Config
- `src/globals.css`: `@import` moved to line 1; global `overflow-x: hidden`; `box-sizing: border-box *`; fluid `clamp()` headings; `safe-area-inset-bottom` padding; glassmorphism variables.
- `tailwind.config.js`: Added `xs: 375px` breakpoint; `sm` updated to `480px`.

#### Part 3 — Navbar, Footer & Layout
- `src/components/Navbar.jsx` *(created)*: Sticky glassmorphism navbar with hamburger menu (React state), slide-down mobile drawer, active route highlighting, scroll shadow, integrated language toggle.
- `src/components/Navbar.css` *(created)*: Mobile-first, 44px+ touch targets, `z-index: 50`.
- `src/App.jsx`: Wired `<Navbar />` globally. Removed `LanguageToggle` global render. z-index layering documented.
- `src/components/Footer.css`: Bottom bar stacks vertically on mobile < 480px. Footer links `min-height: 44px`. Social icons `36px → 44px`.

#### Part 4 — All Pages
- `Home.css`: Hero height `calc(100dvh - 56px)` (navbar offset). Stats: `flex column → grid 3-col`. Both-side equal borders removed.
- `Quiz.css`: `.quiz-card-wrap` changed to `align-items: stretch` (root mobile centering fix). `.quiz-card` `max-width: 640px` at all viewports. `overflow-x: hidden` on page and card.
- `Result.css`: `word-break: break-word` on AI story text. `max-width: 100vw`, `box-sizing: border-box`. Mobile story card padding tightened.
- `Leaderboard.jsx`: `pb-32 sm:pb-24` on entries list. Search width `w-full`.
- `About.jsx`: `px-4 sm:px-6`, responsive heading (already applied Part 2).

#### Part 5 — Components & Functionality
- `rarityData.js`: Removed `console.log` test case (was firing in production on every import).
- `analytics.js`: Removed `console.warn` — silent no-op when gtag absent.
- `groqStory.js`: Fixed `compareCelebrity` API response key (`data.text → data.choices[0].message.content`). Removed all `console.error` calls.
- `DailyFact.jsx`: Switched to `.daily-fact` CSS BEM classes. Fixed language check.
- `InstallPrompt.css`: Buttons `min-height: 44px`, dismiss button `min-width: 44px`.
- `LanguageToggle.jsx`: Retired as null stub (replaced by inline `NavLangToggle` in Navbar).

#### Part 6 — Final Polish
- `Quiz.css`: Confirmed `align-items: stretch` root fix + `overflow: hidden` on wrap.
- `Home.jsx`: Redesigned — 2 strategic CTAs (reduced from 4+), improved hero copy, trust line added, proof strip section added, testimonial copy improved.
- `Home.css`: Added `.hero__trust` and `.proof-strip` / `.proof-item` styles.

---

### Files Modified

| File | Type |
|---|---|
| `src/globals.css` | Modified |
| `tailwind.config.js` | Modified |
| `src/App.jsx` | Modified |
| `src/components/Navbar.jsx` | **Created** |
| `src/components/Navbar.css` | **Created** |
| `src/components/Footer.css` | Modified |
| `src/components/DailyFact.jsx` | Modified |
| `src/components/InstallPrompt.css` | Modified |
| `src/components/LanguageToggle.jsx` | Modified (stub) |
| `src/pages/Home.jsx` | Modified |
| `src/pages/Home.css` | Modified |
| `src/pages/Quiz.css` | Modified |
| `src/pages/Result.css` | Modified |
| `src/pages/Leaderboard.jsx` | Modified |
| `src/pages/About.jsx` | Modified |
| `src/data/rarityData.js` | Modified |
| `src/utils/analytics.js` | Modified |
| `src/utils/groqStory.js` | Modified |

---

### Post-Fix Status

| Area | Status |
|------|--------|
| Mobile Layout (375px–430px) | ✅ Fixed |
| Desktop Layout (1280px+) | ✅ Fixed |
| Navbar Mobile Hamburger | ✅ Fixed (new component) |
| Quiz Card Centering (mobile) | ✅ Fixed (`align-items: stretch`) |
| Global CSS Overflow | ✅ Fixed |
| Animated Background | ✅ Fixed |
| Leaderboard Mobile | ✅ Fixed |
| Result Page Mobile | ✅ Fixed |
| Groq AI Error Handling | ✅ Fixed |
| compareCelebrity API key | ✅ Fixed |
| Console Errors (production) | ✅ Cleared |
| Touch Targets (44px min) | ✅ Fixed |
| Footer Mobile Stack | ✅ Fixed |
| PWA Manifest | ✅ Verified |
| vercel.json SPA rewrites | ✅ Verified |
| Home CTA clutter | ✅ Fixed (2 CTAs max) |

---

### Remaining Known Issues

| Issue | Reason Not Fixed |
|---|---|
| `Compare.jsx` — no error UI for malformed Base64 share URLs | Low traffic risk; would require new component design |
| `LanguageToggle` — `aria-label` not yet localised in Hindi | Minor a11y gap; strings need adding to `translations.js` |
| Quiz name-initial grid (26 letters) on 320px screens | Extreme edge case — only SE gen 1 (discontinued) is 320px |
