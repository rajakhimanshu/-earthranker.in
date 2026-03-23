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
    const { userName, userTraits, celebrityName } = await req.json();

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

    const promptText = `You are a personality data expert. The user wants to compare themselves with ${cleanCelebrityName}. 
Based on publicly known information about ${cleanCelebrityName}, generate a trait comparison. 
Return ONLY valid JSON, no extra text:
{
  "celebrityName": "${cleanCelebrityName}",
  "celebrityEmoji": "one relevant emoji",
  "matchScore": number between 15 and 85,
  "sharedTraits": ["trait1", "trait2", "trait3"],
  "keyDifferences": ["difference1", "difference2"],
  "funFact": "one interesting comparison sentence",
  "rarityNote": "how their rarity compares to the user"
}

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
      temperature: 0.7,
      response_format: { type: "json_object" }
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
    
    // Extract the JSON content from Groq response
    const content = data.choices[0].message.content;
    
    return new Response(content, {
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
