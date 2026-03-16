# Unique.com — Project Overview 2026

## 1. Project Concept
**Unique.com** is a high-polish, interactive web application designed to calculate a user's "Global Rarity Score." It uses a probability engine to analyze a combination of biological and sociological traits, comparing the user against the 8.2 billion human population.

## 2. Core Features
- **Uniqueness Quiz:** A 9-step animated quiz covering core traits (Age, Gender, Country, Education) and bonus traits (Handedness, Blood Type, Eye/Hair Color, Skills, Birthday).
- **Rarity Engine:** A logarithmic scoring system (0–100) that multiplies independent trait probabilities to determine global rarity.
- **Dynamic Storytelling:** A rule-based, localized narrative generator that provides a "Rarity Story" based on the user's specific profile.
- **Global Leaderboard:** A real-time, Firestore-backed leaderboard showcasing the top 100 rarest profiles worldwide.
- **Compare Mode:** A peer-to-peer challenge system where users can share their rarity links and compare results side-by-side.
- **Cosmic Mode:** A "just-for-fun" toggle that scales rarity probabilities to a galactic level (10 trillion beings).
- **Multilingual Support:** Full English (EN) and Hindi (HI) localization.
- **PWA Ready:** Installable as a mobile app with offline caching and high-resolution icons.

## 3. Technical Stack
- **Frontend:** React 18, Vite 8, Tailwind CSS 3.
- **Routing:** React Router 7.
- **Backend/Database:** Firebase Firestore (Real-time updates).
- **Icons/Graphics:** SVG-based iconography, stylized CSS gradients, and high-performance Canvas scorecards.
- **State Management:** React Context (for Language/Theme).

## 4. Key Files & Architecture
- `src/pages/Quiz.jsx`: The core interactive engine of the app.
- `src/pages/Result.jsx`: Handles complex probability math and result visualization.
- `src/pages/Leaderboard.jsx`: Integrated with Firestore for live global rankings.
- `src/data/rarityData.js`: The "source of truth" for statistical fractions used in calculations.
- `src/utils/storyGenerator.js`: The logic engine for personalized narratives.
- `src/i18n/translations.js`: Centralized localization dictionary.

## 5. Development Guidelines
- **Surgical Edits:** All code changes must follow the established "Research -> Strategy -> Execution" lifecycle.
- **Performance:** Prioritize lightweight SVG/CSS over heavy assets.
- **Privacy:** Data is primarily processed locally; only public leaderboard names and scores are sent to the server.
- **Consistency:** Maintain the "Deep Purple / Neon" aesthetic across all components.
