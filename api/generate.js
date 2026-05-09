export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { feature, brief, stage, primaryPersona, secondaryPersona, goal, outputs, constraints } = req.body;

  if (!feature || !brief || !primaryPersona) {
    return res.status(400).json({ error: 'Missing required fields: feature, brief, and primaryPersona are required.' });
  }

  const outputList = Array.isArray(outputs) ? outputs : [
    'Messaging Foundation',
    'Persona Talk Tracks',
    'Sales Enablement Snippets',
    'FAQ / Objection Handling',
    'Launch-Readiness Gaps'
  ];

  const systemPrompt = `You are an expert Product Marketing Manager with deep experience in nonprofit SaaS. 
You create structured, audience-specific messaging packs from product briefs.

RULES:
- Only make claims directly supported by the provided feature brief
- Clearly label what is confirmed vs. what is recommended interpretation  
- Flag any missing information the PMM needs to resolve
- Write for practitioners — clear, direct, no filler
- Format output in clean sections with headers`;

  const userPrompt = `Create a launch messaging pack for the following feature.

Feature: ${feature}
Launch stage: ${stage || 'General availability'}
Primary audience: ${primaryPersona}${secondaryPersona ? '\nSecondary audience: ' + secondaryPersona : ''}
Primary goal: ${goal || 'Create clear messaging for internal teams'}
${constraints ? 'Constraints: ' + constraints : ''}

Requested outputs:
${outputList.map(o => '- ' + o).join('\n')}

---FEATURE BRIEF---
${brief}
---END BRIEF---

Please structure your response with these exact section headers (only include sections that were requested):

## Messaging Foundation
[One-line positioning statement, value proposition (2-3 sentences), and 3 message pillars as bullet points. List key differentiators.]

## Persona Talk Tracks
[For each persona: opening narrative (2-3 sentences), top 3 benefits for this audience, and 3-5 discovery questions a sales rep could use.]

## Sales Enablement Snippets
[What this feature is (1 sentence), when to position it (3 situations), what NOT to promise (2-3 items), and a brief competitive context note if supported by the brief.]

## FAQ / Objection Handling
[5 likely objections or questions with clear, brief responses. Include at least one AI trust/data privacy concern.]

## Launch-Readiness Gaps
[Use three categories: CONFIRMED (what is clearly supported), OPEN (what needs clarification before launch), and FLAG (what must not be claimed). Be specific and actionable.]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 2500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic API error:', err);
      return res.status(500).json({ error: 'Failed to generate messaging pack. Please try again.' });
    }

    const data = await response.json();
    const text = data.content[0].text;

    return res.status(200).json({ result: text });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
