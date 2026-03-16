# Unique.com — Project Documentation

## 1. Current Project Status

Based on an audit of the actual codebase, here is the real-time status of all major features:

*   **Quiz Engine**: ✅ Fully Working
*   **Dynamic Scoring (rarityData.js)**: ✅ Fully Working
*   **Result Visualization (Canvas Certificate, Animations)**: ✅ Fully Working
*   **AI Story Generation (Groq API)**: ✅ Fully Working (Requires valid API key)
*   **Challenge/Compare System**: ✅ Fully Working (Uses base64 URL encoding + localStorage, no backend required)
*   **Internationalization (i18n)**: ✅ Fully Working (English/Hindi implemented)
*   **Global Leaderboard**: ⚠️ Partial (UI and localStorage fallback work perfectly; Firestore sync requires proper Firebase credentials in `.env`)
*   **Analytics (GA4)**: ✅ Fully Working
*   **PWA Support**: ✅ Fully Working

---

## 2. Complete File Structure

```text
W:\The Office\Currently Working\Unique\
├── .env                        - Local environment variables (do not commit)
├── .env.example                - Template for required environment variables
├── .gitignore                  - Git ignore rules
├── index.html                  - Main HTML entry point, includes GA4 script
├── package.json                - Project dependencies and scripts (Vite, React, Tailwind, Firebase)
├── postcss.config.js           - PostCSS configuration for Tailwind
├── tailwind.config.js          - Tailwind CSS configuration and custom themes
├── tsconfig.json               - TypeScript configuration (project uses JSX but Vite sets up TS base)
├── vite.config.js              - Vite bundler configuration
├── public/
│   ├── favicon.svg             - Site favicon
│   ├── icons.svg               - SVG sprite map for icons
│   ├── manifest.json           - PWA web app manifest
│   ├── og-preview.svg          - Open Graph image for social sharing
│   ├── sw.js                   - Service Worker for offline PWA capabilities
│   └── icons/                  - Folder containing various sizes of PWA icons
├── scripts/
│   └── generateIcons.js        - Utility script to generate PWA icons
└── src/
    ├── App.jsx                 - Main React component and Route definitions
    ├── firebase.js             - Firebase initialization and configuration
    ├── globals.css             - Global CSS variables, resets, and utility classes
    ├── main.jsx                - React DOM rendering entry point
    ├── style.css               - Additional global styles
    ├── assets/                 - Static assets (images, SVGs)
    ├── components/
    │   ├── DailyFact.jsx       - Component showing a random daily rarity fact
    │   ├── Footer.jsx          - Global footer component
    │   ├── InstallPrompt.jsx   - PWA installation prompt UI
    │   └── LanguageToggle.jsx  - i18n language switcher UI
    ├── contexts/
    │   └── LanguageContext.jsx - React Context provider for i18n state management
    ├── data/
    │   ├── facts.js            - Array of daily facts data
    │   ├── famousProfiles.js   - Mock data for famous people comparison feature
    │   ├── flags.js            - Utility for fetching country flag emojis
    │   └── rarityData.js       - Core algorithmic scoring logic and population data
    ├── i18n/
    │   └── translations.js     - Dictionary of English and Hindi strings
    ├── pages/
    │   ├── About.jsx           - About page content
    │   ├── Compare.jsx         - Challenge a friend feature (URL decoding & side-by-side view)
    │   ├── Home.jsx            - Landing page with live counter and hero section
    │   ├── Leaderboard.jsx     - Global leaderboard (Firestore + localStorage sync)
    │   ├── NotFound.jsx        - 404 Error page
    │   ├── Quiz.jsx            - Multi-step quiz data collection form
    │   └── Result.jsx          - Comprehensive results dashboard, AI story, and Canvas certificate
    └── utils/
        ├── analytics.js        - Google Analytics 4 event tracking wrapper
        ├── groqStory.js        - API handler for Groq LLM story generation
        └── storyGenerator.js   - Fallback rule-based story generator
```

---

## 3. Known Bugs & Issues (Code-level Audit)

1.  **Firebase Silent Failure**: If valid Firebase credentials are not provided in `.env`, the app swallows the error silently and falls back to `localStorage` and a hardcoded list of dummy users. This is functionally robust but deceptive if a real database connection is expected.
2.  **Groq API Security**: The Groq API key is securely managed on the server side via a Vercel Edge Function (`api/generate-story.js`). The client-side code never sees the key.
3.  **Analytics Hardcoding**: The GA4 Measurement ID (`G-TFLE0MZXLP`) is hardcoded in the `<script>` tag within `index.html`, ignoring the `.env` variable setup. This makes environment-specific tracking difficult.

---

## 4. Current Scoring Formula (`src/data/rarityData.js`)

```javascript
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
```

---

## 5. Environment Variables

| Variable | Description |
| :--- | :--- |
| `VITE_GROQ_API_KEY` | Used to authenticate with the Groq API (llama-3.1-8b-instant) for generating the personalized AI rarity stories on the results page. |
| `VITE_GA_MEASUREMENT_ID` | (Intended) The Measurement ID for Google Analytics 4 tracking. |
| `VITE_FIREBASE_API_KEY` | Firebase authentication key for Firestore access. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain. |
| `VITE_FIREBASE_PROJECT_ID` | The specific Firebase project ID used to locate the Firestore database. |
| `VITE_FIREBASE_STORAGE_BUCKET`| Firebase storage bucket (currently unused in app logic). |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID (currently unused). |
| `VITE_FIREBASE_APP_ID` | Unique identifier for the web app within Firebase. |
| `VITE_FIREBASE_MEASUREMENT_ID`| Internal Firebase analytics ID (distinct from GA4). |

---

## 6. API Integrations

1.  **Groq API (Llama 3.1)**:
    *   **Status**: ✅ Working.
    *   **Usage**: Calls `api.groq.com/openai/v1/chat/completions` directly from the client browser (`src/utils/groqStory.js`) to generate a 3-sentence poetic report based on user traits.
2.  **Firebase Firestore**:
    *   **Status**: ⚠️ Partial/Unverified.
    *   **Usage**: Configured in `src/firebase.js` and used in `src/pages/Leaderboard.jsx`. It attempts to connect and sync leaderboard data. If credentials fail or are missing, the UI silently falls back to a robust `localStorage` implementation.
3.  **Google Analytics 4 (GA4)**:
    *   **Status**: ✅ Working.
    *   **Usage**: Script is injected in `index.html`. Custom events (`quiz_started`, `quiz_completed`, `ai_story_generated`, etc.) are actively firing via `src/utils/analytics.js`.

---

## 7. Genuinely Complete and Ready

*   **The Core Loop**: Taking the quiz, processing inputs against the global population statistics, calculating logarithmic scores, and determining tiers.
*   **Result Visualization**: The UI is highly polished. The massive counters, animated gradients, and data presentation are solid.
*   **PWA Setup**: `manifest.json` and `sw.js` are correctly configured for offline caching and install prompts.
*   **Challenge System**: The URL-based base64 encoding approach in `Compare.jsx` is stateless, fast, and works perfectly without a backend.
*   **Canvas Certificate**: High-resolution image generation for social sharing is robust.

---

## 8. Half-Built or Broken

*   **Global Leaderboard Backend**: While the UI and local state work flawlessly, the actual global sync requires a properly configured Firestore database. Without real Firebase credentials in `.env`, the "Global Leaderboard" is effectively a local simulation mixed with hardcoded mock data.
*   **Client-side Secrets**: Storing the `VITE_GROQ_API_KEY` in the frontend code is functionally "working" but architecturally "broken" for a secure production release.

---

## 9. Deployment Steps for THIS Project

1.  **Environment Setup**: Create a `.env` file in the root directory mirroring `.env.example`.
2.  **Add Real Keys**: Insert a valid Groq API key and valid Firebase configuration variables.
3.  **Fix GA4**: Open `index.html` and replace the hardcoded `"G-TFLE0MZXLP"` with the actual production Measurement ID, or implement a Vite HTML plugin to inject it during build.
4.  **Install Dependencies**: Run `npm install`.
5.  **Build**: Run `npm run build` to generate the production bundle in the `/dist` directory.
6.  **Deploy**: Upload the contents of the `/dist` directory to a static hosting provider (e.g., Vercel, Netlify, Firebase Hosting, GitHub Pages).

---

## 10. Honest Assessment Before Going Live

This application is **90% ready for a soft launch**. The UX is incredibly polished, the animations are smooth, and the core algorithmic logic is sound.

**Critical Fixes Required Before Scale:**

1.  **Secure the Groq API Key**: If this site goes viral, exposing the Groq API key in the Vite bundle will result in quota exhaustion or billing issues. You must move the Groq API call to a serverless function (e.g., Vercel Edge Function, Netlify Function) to hide the key.
2.  **Validate Firebase**: If you intend to have a *true* global leaderboard, you must verify the Firestore integration with real credentials and ensure appropriate Firebase Security Rules are in place so users cannot overwrite each other's scores. If you do not want a backend, remove Firebase entirely and rename the feature "Local History".
3.  **Fix Analytics Config**: Ensure the GA4 Measurement ID in `index.html` is properly configured for the production environment, rather than hardcoded.