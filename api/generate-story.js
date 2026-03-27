export const config = {
  runtime: 'edge',
};

// Groq Free Tier: ~14,400 req/day
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

    // Basic Input Sanitization
    const sanitize = (str) => (str || '').toString().slice(0, 500).replace(/<[^>]*>/g, '');

    const {
      userName,
      name = 'You',
      country = 'Unknown',
      age = 'Unknown',
      education = 'Unknown',
      bloodType = 'Unknown',
      eyeColor = 'Unknown',
      skills = [],
      score = 0,
      tier = 'Common',
      oneIn = 1,
      estimatedRank = 'Unknown',
      topPercentile = 'Unknown'
    } = userProfile;

    const actualName = sanitize(userName || (name !== 'You' && name !== '' ? name : 'You'));
    const cleanCountry = sanitize(country);
    const cleanAge = sanitize(age);
    const cleanEducation = sanitize(education);
    const cleanBlood = sanitize(bloodType);
    const cleanEye = sanitize(eyeColor);
    const cleanSkills = (skills || []).map(s => sanitize(s));

    const promptText = `You are a poetic data scientist writing a personalised rarity report. 
Write exactly 3 sentences about this person's statistical rarity. 
Be specific — mention their actual traits by name. 
Mention their Global Rank (#${estimatedRank} out of 8.28 billion) and that they are in the top ${Number(topPercentile).toFixed(4)}% of the world population.
Make it feel like a personal revelation, not a generic compliment. 
Never use the phrases 'truly unique', 'one of a kind', or 'special'. 
Start with '${actualName !== 'You' ? actualName : '[userName]'},' if name is provided, or 'You' if not provided. Never invent or assume a name.

Traits: 
Name: ${actualName}, 
Country: ${cleanCountry}, 
Age: ${cleanAge}, 
Education: ${cleanEducation}, 
Blood Type: ${cleanBlood}, 
Eye Color: ${cleanEye}, 
Rare Skills: ${cleanSkills.join(', ')}, 
Score: ${score}/100, 
Tier: ${tier}, 
Global Rank: #${estimatedRank},
Top Percentile: ${Number(topPercentile).toFixed(4)}%,
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
