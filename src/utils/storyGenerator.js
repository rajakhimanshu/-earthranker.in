/**
 * Returns a translation key for a story based on user traits.
 * The UI (Result.jsx) will use this key with t.result.story.messages[key]
 */
export function generateStoryKey(answers, traitBreakdown, excludeKey = null) {
  const skills = answers.skills || [];
  const nSkills = skills.length;

  let pool = [];

  // Logic to determine which story key to return
  if (nSkills >= 5) {
    pool = ['polymath', 'blueprint', 'original'];
  } else if (nSkills >= 3) {
    pool = ['generalist', 'blueprint', 'original'];
  } else {
    const isRare = traitBreakdown.some(t => t.fraction < 0.05);
    if (isRare) {
      pool = ['unique', 'special', 'rare', 'blueprint', 'original'];
    } else {
      pool = ['miracle', 'explorer', 'individual', 'unique'];
    }
  }

  // Filter out the current key to ensure a "new" story appears if possible
  const filteredPool = pool.filter(k => k !== excludeKey);
  const finalPool = filteredPool.length > 0 ? filteredPool : pool;

  return finalPool[Math.floor(Math.random() * finalPool.length)];
}
