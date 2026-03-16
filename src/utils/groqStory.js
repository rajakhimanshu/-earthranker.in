/**
 * Calls internal Vercel API proxy to generate a personalized rarity story.
 * The API key is stored securely on the server side.
 */
export async function generateAIStory(userProfile) {
  try {
    const response = await fetch('/api/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userProfile })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Proxy Error:', errorText);
      throw new Error(`Failed to generate story: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Failed to generate AI story:', error);
    throw error;
  }
}
