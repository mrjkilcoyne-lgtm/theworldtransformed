import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

export const prerender = false;

interface Answers {
  initial: string;
  impact: string;
  tried: string;
  constraints: string;
  ideal: string;
  serious: string;
}

interface RequestBody {
  answers: Answers;
  tier: 'free' | 'standard' | 'council';
  serious: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { answers, tier, serious } = await request.json() as RequestBody;

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const client = new Anthropic({
      apiKey: apiKey,
    });

    const systemPrompt = `You are The Brunel Engine, a structured problem analysis tool. Your job is to take a user's interview responses and generate a private, actionable report.

Context:
- The user has answered 6 questions about their problem
- They have selected the ${tier} tier (${tier === 'free' ? 'single model analysis' : tier === 'standard' ? 'enhanced analysis' : 'multi-model council synthesis'})
- Seriousness level: ${serious ? 'Ready to act' : 'Still exploring'}

Generate a report with these sections:
1. Summary (2-3 sentences capturing the core problem)
2. Analysis (core issue, constraints, readiness)
3. Three pathways: Quick Win (low effort), Structural Fix (high effort), Adaptation (reframe)
${tier === 'council' ? '4. Council Perspectives (Analyst, Pragmatist, Contrarian, Synthesis)' : ''}
5. Next Actions (3 specific, actionable items)

Output as JSON with this structure:
{
  "summary": "...",
  "analysis": {
    "coreIssue": "...",
    "constraints": "...",
    "timeframe": "..."
  },
  "pathways": [
    {
      "name": "Quick Win",
      "description": "...",
      "effort": "Low",
      "impact": "Medium",
      "firstStep": "..."
    },
    {
      "name": "Structural Fix",
      "description": "...",
      "effort": "High",
      "impact": "High",
      "firstStep": "..."
    },
    {
      "name": "Adaptation",
      "description": "...",
      "effort": "Medium",
      "impact": "Variable",
      "firstStep": "..."
    }
  ],
  ${tier === 'council' ? '"council": { "analyst": "...", "pragmatist": "...", "contrarian": "...", "synthesis": "..." },' : ''}
  "nextActions": ["...", "...", "..."],
  "seriousnessNote": "${serious ? 'You indicated you\'re serious about this. The report is calibrated accordingly.' : 'You\'re still exploring. That\'s fine. Revisit when you\'re ready to act.'}"
}

Be specific, actionable, and avoid platitudes. Focus on what they can actually do.`;

    const userPrompt = `Interview responses:

1. What's the problem?
${answers.initial}

2. How is it affecting you?
${answers.impact}

3. What have you tried?
${answers.tried}

4. What constraints exist?
${answers.constraints}

5. What does solved look like?
${answers.ideal}

6. Are you serious about this?
${answers.serious}

Generate the report.`;

    const message = await client.messages.create({
      model: tier === 'council' ? 'claude-opus-4-5-20251101' : 'claude-sonnet-4-5-20250929',
      max_tokens: tier === 'council' ? 4096 : tier === 'standard' ? 2048 : 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (it might be wrapped in markdown code blocks)
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const report = JSON.parse(jsonText);

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate report',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
