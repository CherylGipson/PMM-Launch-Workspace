export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPICAPIKEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Anthropic API key in environment variables.' });
  }

  const { featureName, brief, launchStage, persona, notes } = req.body || {};
  if (!featureName || !brief || !launchStage || !persona) {
    return res.status(400).json({ error: 'Feature name, brief, launch stage, and persona are required.' });
  }

  const prompt = `You are creating a PMM launch pack for a nonprofit software company.

Return valid JSON only with these exact keys:
- messaging_foundation
- persona_talk_tracks
- sales_enablement_snippets
- faq_objection_handling
- launch_readiness_gaps

Each value should be a polished markdown-friendly string with bullets and short subheads where helpful.

Context:
Feature name: ${featureName}
Feature brief: ${brief}
Launch stage: ${launchStage}
Persona: ${persona}
Constraints or notes: ${notes || 'None provided'}

Requirements:
1. Messaging Foundation: positioning statement, value proposition, 3 messaging pillars, differentiators, and proof points to validate.
2. Persona Talk Tracks: narrative tailored to the stated persona, pain points, discovery questions, and likely resonant outcomes.
3. Sales Enablement Snippets: concise one-pager style copy including elevator pitch, why it matters now, and 3 reusable snippets for sales/customer-facing teams.
4. FAQ / Objection Handling: top likely objections or questions with clear PMM-style responses. Include where proof is still needed.
5. Launch-Readiness Gaps: what appears confirmed, what is missing, open questions, dependencies, enablement gaps, and recommended next actions.

Style:
- Practical, crisp, PMM-ready
- No hype
- Use concrete language
- Call out uncertainty where evidence is missing
- Keep each section useful enough to paste into a real launch workflow`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2200,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'Anthropic API request failed.' });
    }

    const text = data?.content?.map(c => c.text || '').join('') || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return res.status(500).json({ error: 'Model response was not valid JSON.' });
      parsed = JSON.parse(match[0]);
    }

    return res.status(200).json({
      messaging_foundation: parsed.messaging_foundation || '',
      persona_talk_tracks: parsed.persona_talk_tracks || '',
      sales_enablement_snippets: parsed.sales_enablement_snippets || '',
      faq_objection_handling: parsed.faq_objection_handling || '',
      launch_readiness_gaps: parsed.launch_readiness_gaps || ''
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unexpected server error.' });
  }
}
