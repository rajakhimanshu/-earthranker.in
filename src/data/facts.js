// ─────────────────────────────────────────────────────────────────────
//  Daily rarity facts — 30 entries.
//  A deterministic fact is selected by:  dayOfYear % FACTS.length
// ─────────────────────────────────────────────────────────────────────

export const FACTS = [
  "Only ~2% of the world has naturally green eyes.",
  "About 1 in 12 men (8%) are colorblind, but only 1 in 200 women.",
  "Fewer than 1% of people are truly ambidextrous.",
  "Just 0.6% of the global population has AB- blood — the rarest type.",
  "Left-handedness occurs in roughly 10% of the world's population.",
  "Natural red hair appears in only 1–2% of humans worldwide.",
  "Blue eyes are found in approximately 8% of the global population.",
  "Fewer than 2% of people worldwide hold a doctoral degree.",
  "Only about 4% of people are natural-born night owls who thrive after midnight.",
  "Heterochromia (two different colored eyes) affects fewer than 1% of people.",
  "Perfect pitch — hearing a note and naming it — is found in ~1 in 10,000 people.",
  "About 10,000 people in the world can taste the bitterness of PTC paper; most cannot.",
  "Double-jointed thumbs (Hitchhiker's thumb) appear in roughly 25% of people.",
  "O- blood is the universal donor type, carried by only 7% of people.",
  "Only 1 in 20,000 people are born with synesthesia, sensing letters as colors.",
  "Approximately 15% of people have an extra rib called a cervical rib.",
  "Fewer than 1% of people have 20/10 vision — twice as sharp as 'normal'.",
  "The gene for rolling one's tongue is present in about 65–81% of people.",
  "Only 11% of people predominantly use their left hand for everything.",
  "Hyperthymesia — perfect autobiographical memory — has been confirmed in fewer than 100 people globally.",
  "About 3% of people dream exclusively in black and white.",
  "Albinism occurs in roughly 1 in 20,000 people worldwide.",
  "Only about 17% of adults worldwide are lactose tolerant from birth.",
  "Functional tetrachromacy (seeing a fourth color dimension) is found in ~12% of women.",
  "A natural immunity to HIV exists in ~1% of people with a specific CCR5-delta32 mutation.",
  "Fingerprints are unique to every individual — including identical twins.",
  "Mirror-touch synesthesia — feeling others' physical sensations — affects ~1.6% of people.",
  "Natural blondes make up only about 2% of the global adult population.",
  "The ACTN3 'speed gene' variant is absent in ~18% of people — they have no fast-twitch muscle fibers.",
  "Fewer than 0.1% of people are estimated to carry all four Rh-null blood group antigens — the rarest blood on Earth.",
];

// ── Day-of-year helper ────────────────────────────────────────────────
function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff  = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / 86_400_000);
}

/** Returns today's deterministic fact string. */
export function getDailyFact() {
  return FACTS[dayOfYear() % FACTS.length];
}
