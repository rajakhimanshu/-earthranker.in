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
    const { userProfile } = await req.json();

    if (!userProfile) {
      return new Response(JSON.stringify({ error: 'Missing userProfile in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const {
      name = 'You',
      country = 'Unknown',
      age = 'Unknown',
      education = 'Unknown',
      bloodType = 'Unknown',
      eyeColor = 'Unknown',
      skills = [],
      score = 0,
      tier = 'Common',
      oneIn = 1
    } = userProfile;

    const promptText = `You are a poetic data scientist writing a personalised rarity report. 
Write exactly 3 sentences about this person's statistical rarity. 
Be specific — mention their actual traits by name. 
Make it feel like a personal revelation, not a generic compliment. 
Never use the phrases 'truly unique', 'one of a kind', or 'special'. 
Start with their name if provided or 'You' if not. 

Traits: 
Name: ${name}, 
Country: ${country}, 
Age: ${age}, 
Education: ${education}, 
Blood Type: ${bloodType}, 
Eye Color: ${eyeColor}, 
Rare Skills: ${skills.join(', ')}, 
Score: ${score}/100, 
Tier: ${tier}, 
1 in ${oneIn.toLocaleString('en-US')} people.`;

    const groqRequestBody = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: promptText
        }
      ],
      max_tokens: 200,
      temperature: 0.8
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

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Standard for Edge, Vercel handles actual CORS in vercel.json usually
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
