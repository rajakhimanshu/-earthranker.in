# 🧪 Earth Ranker — Probability Algorithm & Data Verification

This document provides a transparent breakdown of the mathematics, algorithms, and data sources used to calculate the "Global Rarity Score."

---

## 1. The Core Mathematical Theory
The engine is based on the **Product Rule for Independent Events**. In probability theory, if two or more events are independent, the probability of them all occurring is the product of their individual probabilities.

### The Basic Formula:
$$P(Total) = P(Trait_1) \times P(Trait_2) \times P(Trait_3) \dots \times P(Trait_n)$$

### Why the numbers get so big:
Even with "common" traits, the math scales exponentially.
- **Example:** Imagine 10 common traits, each shared by **10%** of the population.
- **Calculation:** $0.1 \times 0.1 \times 0.1 \dots (10 times) = 0.0000000001$
- **Result:** **1 in 10 Billion.**
- Since the global population is only **8.28 Billion**, having even 10 common traits (10% each) already makes you statistically unique on Earth.

---

## 2. The "Coupling Factor" (Coupled Probability)
In reality, human traits are not perfectly independent (e.g., certain eye colors are more common with certain hair colors). If we used pure multiplication, *everyone* would be "1 in 8 Billion" after just 5-6 questions.

To make the score more realistic and "pull back" the extreme rarity, we apply a **Coupling Factor ($\gamma$)** of **0.82**.

### The Adjusted Formula:
$$CombinedProbability = (\prod P(traits))^{0.82}$$

By raising the raw product to a power less than 1, we reduce the rarity. This ensures that only users with truly diverse or rare traits hit the "1 in 8.28 Billion" cap.

---

## 3. Logarithmic Scoring (0–100)
Displaying a number like "1 in 4,523,102" is hard for humans to compare. We use a logarithmic scale to map the rarity onto a clean 0–100 score.

$$Score = \min(100, \max(0, \frac{\log_{10}(1/CombinedProbability)}{12} \times 100))$$

- **Base 12:** We use 12 as the denominator because $\log_{10}(10^{12})$ represents a rarity of **1 in 1 Trillion**, which we consider the "Mythic" ceiling for human traits.

---

## 4. Data Sources
The probabilities used in `src/data/rarityData.js` are compiled from the following global benchmarks:

| Trait | Primary Data Source |
| :--- | :--- |
| **Blood Type** | World Health Organization (WHO) Global Safety Reports |
| **Handedness** | Scientific American / Meta-analysis of 2M+ individuals |
| **Eye/Hair Color** | Forensic Science International: Genetics |
| **Education** | UNESCO Institute for Statistics / World Bank |
| **Population** | United Nations Department of Economic and Social Affairs (DESA) |
| **Country Stats** | CIA World Factbook / Worldometer (2024–2026 Projections) |

---

## 5. Verification Example
If you select:
1. **Left Handed** (10% / 0.10)
2. **AB- Blood** (0.6% / 0.006)
3. **Green Eyes** (2% / 0.02)

**Raw Math:** $0.10 \times 0.006 \times 0.02 = 0.000012$ (1 in 83,333)
**With Coupling (0.82):** $(0.000012)^{0.82} \approx 0.000093$ (1 in 10,752)

Even with just 3 traits, you are already "rarer" than 10,000 people. When you add Age, Gender, Country, Education, and 5+ Skills, hitting the **8.28 Billion** mark is mathematically inevitable for most humans.

---

## 6. Universe Mode (Cosmic Rarity)
In Universe Mode, we multiply your Earth rarity by a **Cosmic Multiplier (1,250,000)**. This represents the estimated number of "Earth-like" habitable planets in the observable galaxy. This is a speculative multiplier used for entertainment purposes.

---
*Documented by the Earth Ranker Engineering Team for transparency and verification.*
