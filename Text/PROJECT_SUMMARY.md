# Unique (Rarity) — Project Status & Summary

> **Current Status:** 🟢 Production Ready (98%)  
> **Stack:** React 18, Vite 8, Tailwind CSS 3, Firebase Firestore, Groq AI (Llama 3.1)

## 1. Project Overview
**Unique.com (Rarity)** is a highly interactive web application designed to calculate a user's statistical rarity among the 8.28 billion people on Earth. Users take a 9-step quiz about their biological traits, demographics, and skills. The system then computes a **Rarity Score (0-100)**, assigns a **Rarity Tier** (Common to Mythic), and displays a "1 in X" probability of another human sharing the exact same combination of traits.

## 2. Recent Updates & What Has Been Done
Over the recent development sessions, several critical features and security fixes have been successfully implemented:

*   **Secure Groq AI Integration:** Replaced the rule-based story generator with the Groq Llama 3.1 API. The prompt construction has been moved to a secure Vercel Edge Function (`api/generate-story.js`) to protect API keys and prevent malicious prompt injection. Added an "✨ AI Generated" badge and a session-based regeneration limit.
*   **Firestore Security Rules:** Implemented production-grade security rules for the Firebase Firestore leaderboard. It now allows public read access but strictly validates and limits new score submissions (`create` only), preventing unauthorized modifications or deletions.
*   **Dynamic Analytics Injection:** Updated the GA4 script in `index.html` to use dynamic environment variable substitution (`%VITE_GA_MEASUREMENT_ID%`), ensuring tracking is configurable across different environments.
*   **Result Page Redesign:** Completely overhauled the Result page (`/result`) for a premium, editorial feel. Implemented a sleek hero section, a clean 3-column stats row, and re-styled the trait breakdown as an alternating-row table.
*   **Rarity Score Calibration:** Verified the logarithmic scaling (0-100). All traits (including Hair Color and Gender) are now mathematically integrated into the scoring engine.
*   **Firebase Leaderboard:** Successfully integrated real Firebase Firestore. The Leaderboard page (`/leaderboard`) handles real-time score submissions, displays the top 50 users globally in real-time, and includes stylistic enhancements like country flags and dynamic rank badges.
*   **Bugs & UX Fixes:**
    *   Updated the global population baseline to 8.28 billion across the entire app.
    *   Implemented a Quiz page route guard (redirects direct visits to `/result` back to `/quiz` if no data exists).
    *   Fixed a cosmic toggle overlap issue with the language selector on mobile views.
    *   Ensured fonts are fully loaded before rendering the downloadable Canvas scorecard.
    *   Created a custom 404 "Not Found" fallback page for invalid routes.
*   **Multi-Language Support & Hindi Translation:** Added full EN/HI multi-language capabilities using `LanguageContext`, including a working header toggle, ensuring no crashes occur during language switching.

## 3. Core Project Details & Structure
### Key Pages
*   **Home (`/`):** Explains the concept and drives users to start the quiz.
*   **Quiz (`/quiz`):** A beautiful, animated 9-step form collecting traits (Age, Gender, Country, Education, Birthday, Handedness, Blood Type, Eye/Hair Color, Skills).
*   **Result (`/result`):** The core reveal page showing the Rarity Score, 1-in-X stat, Tier Badge, Trait Breakdown Table, the new AI Story, Birthday unique statistics, and Famous Person comparisons.
*   **Leaderboard (`/leaderboard`):** Real-time global ranking displaying the rarest calculated scores.
*   **Compare (`/compare`):** Friend comparison tool using base64-encoded URL payloads (stateless and fast).

## 4. Current Known Issues & Limitations
1.  **Compare Page Mini-Quiz:** While functional, the `/compare` page uses a "mini-quiz" which simplifies some traits compared to the main quiz for speed.
2.  **Language Completion:** Certain dynamic text elements might occasionally need ongoing translation-map verification.
3.  **AI Rate Limits:** The personalized rarity message depends on the Groq API. If rate limits are hit, it falls back to a rule-based generator.

## 5. Next Steps / Future Roadmap
1.  **Live Deployment:** Finalize production builds and deploy via Firebase Hosting.
2.  **Additional Quiz Steps:** Add more trait questions (e.g., personality types via MBTI, phobias) to further unique-ify the combinations.
3.  **Social Integration:** Further optimize the social sharing meta tags for better previews when sharing challenge links.
