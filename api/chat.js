// Vercel serverless function — proxies to Claude API so the key
// never touches the browser. Called by the AiTutor component.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, category, videoTitle, systemOverride } = req.body;
  if (!messages || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // The tutor uses a custom system prompt on its opening message
  // (to generate a video summary + check question). After that it
  // falls back to the standard tutor prompt.
  const systemPrompt = systemOverride || `You are an expert tutor on the Apex learning platform helping a student who is studying "${category}".
${videoTitle ? `They are currently watching: "${videoTitle}".` : ''}

Your job:
- Answer questions clearly and concisely about ${category} topics
- Relate answers back to what they're learning when possible
- Use simple language — assume the student is motivated but not an expert
- Be encouraging and direct — real answers, no filler
- If they ask something off-topic, gently redirect them back to ${category}

Keep responses under 150 words unless a longer explanation is genuinely needed.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || 'API error' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
