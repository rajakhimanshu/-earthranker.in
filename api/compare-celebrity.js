export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { userName, userTraits, celebrityName, rarityScore, rarityNumber } = await req.json();

    if (!celebrityName) {
      return new Response(JSON.stringify({ error: 'Missing celebrityName in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic Input Sanitization
    const sanitize = (str) => (str || '').toString().slice(0, 500).replace(/<[^>]*>/g, '');
    const cleanUserName = sanitize(userName);
    const cleanCelebrityName = sanitize(celebrityName);
    const cleanTraits = (userTraits || []).map(t => sanitize(t)).join(', ');

    const promptText = `You are a fun human rarity comparison engine. 
The user scored ${rarityScore}/100 on a human rarity quiz and is ranked 1 in ${rarityNumber} people on Earth.
Compare their rarity with ${cleanCelebrityName}.
Write exactly 3-4 sentences. Be creative, fun, and engaging.
Talk about how rare each person is in terms of traits, birth circumstances, and uniqueness.
End with a fun conclusion about who is rarer.

User Context:
Name: ${cleanUserName}
Traits: ${cleanTraits}`;

    const groqRequestBody = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: promptText
        }
      ],
      max_tokens: 400,
      temperature: 0.7
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(groqRequestBody),
    });

    const data = await response.json();
    
    // Extract the text content from Groq response
    const content = data.choices[0].message.content.trim();
    
    return new Response(JSON.stringify({ text: content }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
