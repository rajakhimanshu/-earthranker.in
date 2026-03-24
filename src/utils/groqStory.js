/**
 * Calls internal Vercel API proxy to generate a personalized rarity story.
 * The API key is stored securely on the server side.
 */
export async function generateAIStory(userProfile) {
  try {
    const response = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProfile })
    });

    if (!response.ok) {
      throw new Error(`Story API error: ${response.status}`);
    }

    const data = await response.json();

    // Guard against malformed response
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty story response');

    return content.trim();
  } catch {
    // Caller (Result.jsx) handles fallback — no console.error in production
    throw new Error('Failed to generate AI story');
  }
}

/**
 * Calls internal Vercel API proxy to compare user with a celebrity.
 * FIX: was reading data.text but API returns data.choices[0].message.content
 */
export async function compareCelebrity({ userName, userTraits, celebrityName, rarityScore, rarityNumber }) {
  try {
    const response = await fetch('/api/compare-celebrity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, userTraits, celebrityName, rarityScore, rarityNumber })
    });

    if (!response.ok) {
      throw new Error(`Compare API error: ${response.status}`);
    }

    const data = await response.json();

    // FIX: Support both response shapes (data.text legacy OR data.choices[0].message.content)
    const content =
      data?.choices?.[0]?.message?.content ||
      data?.text ||
      null;

    if (!content) throw new Error('Empty compare response');

    return content.trim();
  } catch {
    throw new Error('Failed to compare celebrity');
  }
}
