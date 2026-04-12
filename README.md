# 🌍 EarthRanker — How Rare Are You?

> A science-backed quiz that calculates the exact statistical probability of your unique combination of human traits among 8.28 billion people on Earth.

**Live Site → [earthranker.himanshurajak.in](https://earthranker.himanshurajak.in)**

---

## ✨ What is EarthRanker?

EarthRanker is a free, anonymous, 2-minute quiz that uses real global demographic data and a probability engine to answer one question: **how statistically rare are you?**

Every answer you give — your age, country, blood type, handedness, eye color, skills — is cross-referenced against real-world population data from sources like the WHO, UNESCO, CIA World Factbook, and peer-reviewed genetics research. The result is a genuine statistical calculation, not a personality quiz.

You get:
- A **rarity score** from 0–100
- A **tier badge** (Common → Uncommon → Rare → Epic → Legendary → Mythic)
- A **"1 in X"** number showing how many people on Earth share your exact combination
- An **AI-generated personal story** about your rarity
- A **Certificate of Rarity** and **Score Card** you can download and share
- A spot on the **Global Leaderboard**

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Custom CSS |
| Routing | React Router v6 |
| Backend / DB | Firebase Firestore |
| AI Story | Groq API (LLaMA 3) |
| Analytics | Google Analytics 4 |
| Hosting | Vercel |
| PWA | Service Worker (sw.js) |

---

## 🧮 How the Algorithm Works

The scoring engine is based on the **Product Rule for Independent Events**.

### Step 1 — Trait Probability Multiplication
Every trait the user selects has a global frequency fraction. These are multiplied together:

```
P(Total) = P(Trait₁) × P(Trait₂) × P(Trait₃) × ... × P(Traitₙ)
```

**Example:** Left-handed (10%) × AB- blood (0.6%) × Green eyes (2%) = `0.10 × 0.006 × 0.02 = 0.000012`

### Step 2 — Coupling Factor (γ = 0.82)
Because human traits aren't perfectly independent, a coupling factor is applied to prevent scores from inflating too quickly:

```
CombinedProbability = (∏ P(traits)) ^ 0.82
```

### Step 3 — Logarithmic Scoring (0–100)
The probability is converted to a human-readable score:

```
Score = min(100, max(0, (log₁₀(1 / CombinedProbability) / 12) × 100))
```

A score of **82** = "1 in 8.28 Billion" (unique on Earth).  
A score of **100** = "1 in 1 Trillion" (unique in human history).

### Tier Thresholds

| Tier | Score Range | Rarity |
|---|---|---|
| 🌌 Mythic | 90+ | Top 0.01% |
| ⚡ Legendary | 75–89 | Top 0.5% |
| 💎 Epic | 60–74 | Top 3% |
| 🔷 Rare | 45–59 | Top 10% |
| 🌿 Uncommon | 30–44 | Top 25% |
| ⚪ Common | 0–29 | Top 50% |

### Data Sources

| Trait | Source |
|---|---|
| Blood Type | WHO Global Safety Reports |
| Handedness | Scientific American / Meta-analysis of 2M+ individuals |
| Eye & Hair Color | Forensic Science International: Genetics |
| Education | UNESCO Institute for Statistics / World Bank |
| Population | UN Department of Economic and Social Affairs |
| Country Stats | CIA World Factbook / Worldometer (2024–2026) |

---

## 📁 Project Structure

```
earthranker/
├── public/
│   ├── sw.js                    # Service worker (PWA)
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── InstallPrompt.jsx
│   ├── contexts/
│   │   └── LanguageContext.jsx  # i18n (English + Hindi)
│   ├── data/
│   │   ├── rarityData.js        # All trait probabilities
│   │   └── famousProfiles.js    # Celebrity comparison data
│   ├── pages/
│   │   ├── Home.jsx / Home.css
│   │   ├── Quiz.jsx / Quiz.css
│   │   ├── Result.jsx / Result.css
│   │   ├── Leaderboard.jsx
│   │   ├── Compare.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── FAQ.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   └── Terms.jsx
│   ├── utils/
│   │   ├── groqStory.js         # AI story generation
│   │   ├── storyGenerator.js    # Fallback story logic
│   │   └── analytics.js        # GA4 event tracking
│   ├── firebase.js              # Firebase config & init
│   ├── App.jsx                  # Routes (lazy loaded)
│   ├── main.jsx                 # Entry point
│   └── globals.css              # Global styles & variables
├── scripts/
│   └── reorder-leaderboard.js  # Firestore rank maintenance
├── vite.config.js
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore enabled
- A Groq API key (for AI stories)

### Installation

```bash
# Clone the repo
git clone https://github.com/rajakhimanshu/earthranker.git
cd earthranker

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🏆 Features

- **11-step quiz** covering age, gender, country, education, handedness, blood type, eye/hair color, skills, birthday, and bonus traits
- **AI-generated personal story** powered by Groq (LLaMA 3) — unique to every user
- **Celebrity comparison** — find which famous person has a similar rarity profile
- **Universe Mode** — scales your rarity to cosmic proportions (Milky Way scale)
- **Global Leaderboard** — compete against users worldwide, sorted by rarity score
- **Shareable Certificate** — downloadable PNG certificate of rarity
- **Shareable Score Card** — Instagram/WhatsApp-ready score image
- **Multi-language support** — English and Hindi
- **PWA support** — installable on mobile as a native-like app
- **100% private** — no login required, no personal data stored permanently

---

## 🌐 Pages

| Route | Description |
|---|---|
| `/` | Landing page with rarity tiers and social proof |
| `/quiz` | The 11-step quiz |
| `/result` | Your rarity score, AI story, and sharing options |
| `/leaderboard` | Global rankings sorted by rarity score |
| `/compare` | Compare your score with a friend |
| `/about` | About the project and team |
| `/faq` | Frequently asked questions |
| `/contact` | Contact form |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |

---

## 🔧 Utility Scripts

### Reorder Leaderboard by Rarity

If Firestore data needs to be re-ranked (e.g., after a scoring algorithm update):

```bash
node scripts/reorder-leaderboard.js
```

This fetches all leaderboard documents, sorts by rarity score descending, and updates the `rank` field on each document in batches.

---

## 📊 Bundle Size (Production Build)

| Chunk | Size (gzipped) |
|---|---|
| react-vendor | ~59 KB |
| firebase | ~87 KB |
| index (app core) | ~23 KB |
| Quiz page | ~7 KB |
| Result page | ~10 KB |
| Leaderboard | ~6 KB |
| **Total JS** | **~750 KB** |

Code splitting via Vite `manualChunks` — only the landing page loads on first visit. All other routes are lazy loaded.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Developer

**Himanshu Rajak**  
[himanshurajak.in](https://himanshurajak.in) · [GitHub](https://github.com/rajakhimanshu)

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you find EarthRanker interesting, please consider giving it a ⭐ on GitHub — it helps more people discover the project.

*Statistics are approximate and used for entertainment purposes. For educational and fun use only.*
