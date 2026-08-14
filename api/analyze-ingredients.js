module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metoden støttes ikke.' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: 'Bildeanalyse må aktiveres ved å legge OPENAI_API_KEY inn som miljøvariabel i Vercel.'
    });
    return;
  }

  const image = req.body && req.body.image;
  if (typeof image !== 'string' || !image.startsWith('data:image/')) {
    res.status(400).json({ error: 'Bildet mangler eller har feil format.' });
    return;
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 160,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You identify visible food ingredients in photos. Return JSON only in the form {"ingredients":["ingredient 1","ingredient 2"]}. Include only clearly visible ingredients, use simple English ingredient names, and never include cookware, packaging, brands, or guesses.'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Identify the clearly visible food ingredients in this image.' },
              { type: 'image_url', image_url: { url: image, detail: 'low' } }
            ]
          }
        ]
      })
    });

    const payload = await upstream.json();
    if (!upstream.ok) {
      res.status(502).json({ error: 'Bildeanalysen kunne ikke fullføres akkurat nå.' });
      return;
    }

    const content = payload.choices && payload.choices[0] && payload.choices[0].message && payload.choices[0].message.content;
    const parsed = JSON.parse(content || '{}');
    const ingredients = Array.isArray(parsed.ingredients)
      ? parsed.ingredients
          .filter(item => typeof item === 'string')
          .map(item => item.trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 12)
      : [];

    res.status(200).json({ ingredients });
  } catch (error) {
    res.status(500).json({ error: 'Noe gikk galt under bildeanalysen.' });
  }
};
