# 🌍 Earth Ranker — Official Project Guide

> **Project Name:** Earth Ranker  
> **Mission:** Celebrating human statistical uniqueness through data-driven insights.  
> **Developer:** Himanshu Rajak ([himanshurajak.in](https://www.himanshurajak.in/))
> **Last Polish:** March 24, 2026

---

## 1. Executive Summary
**Earth Ranker** is a premium, viral web application designed to calculate exactly how statistically rare a person is among the 8.28 billion humans on Earth. By analyzing biological, sociological, and personal traits, the platform provides a "1 in X" rarity figure, a 0–100 Rarity Score, and an AI-generated narrative explaining the user's uniqueness.

---

## 2. Core Features & Capabilities

### 🧪 Statistical Quiz Engine
A multi-step, animated interface that collects over 15 categories of data, including:
- **Biological:** Blood type, eye color, hair color, handedness.
- **Demographic:** Age, gender, country of origin.
- **Sociological:** Education level, language proficiency.
- **Personality:** Skills and unique life traits.

### 🤖 AI-Powered Narratives
Integrates with **Groq (Llama 3.1)** to generate personalized "Rarity Stories." The AI analyzes the user's specific combination of traits to write a creative, analytical summary of why they are unique.

### 🏆 Global Leaderboard
A real-time database powered by **Firebase Firestore** where users can submit their scores and see how they rank against others globally.

### 🎨 Visual Identity & UX (New March 24 Update)
- **Professional Rebranding:** About, Privacy, Terms, FAQ, and Contact pages have been redesigned with a high-end sidebar-nav or grid layout.
- **Theme:** Deep Purple / Neon dark mode with Glassmorphism.
- **Adaptive Design:** Fully optimized for mobile with horizontal navigation and fluid typography.
- **Mobile-First:** Installable as a **PWA (Progressive Web App)**.
- **Canvas Scorecards:** Generate high-resolution PNG share cards for social media.

---

## 3. The Mathematics of Rarity

The core of Earth Ranker is its **Logarithmic Rarity Engine**. The logic is based on the **Product Rule for Independent Events**.

### A. Probability Multiplication
If multiple traits are independent, the probability of them occurring together is the product of their individual probabilities.
- **Combined Probability:** $\prod_{i=1}^{n} P(trait_i)$

### B. The Scoring Formula
$$score = \left( \frac{\log_{10}(1 / combinedProbability)}{\log_{10}(8,280,000,000)} \right) \times 100$$

---

## 4. Production Readiness & Stability

### 🚀 Optimizations (March 24)
1.  **Vite Chunking:** Heavy libraries (Firebase, React) are split into separate chunks for faster page loads.
2.  **PostCSS Fix:** Resolved render-blocking CSS import issues for Vercel deployment.
3.  **Language Stability:** Removed the experimental language toggle to ensure a stable, English-only production experience.
4.  **Professional Polish:** Replaced "student project" phrasing with professional "Developed & Maintained by" credits.

---

## 5. Technology Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS.
- **Backend:** Vercel Edge Functions (AI Proxy).
- **Database:** Firebase Firestore (Real-time Leaderboard).
- **AI:** Groq Llama 3.1 Inference Engine.

---

*Generated on March 24, 2026, by the Earth Ranker Engineering Team.*
