export interface Env {
  OPENAI_API_KEY: string
  OPENAI_MODEL?: string
  ALLOWED_ORIGIN: string
}

const policyContext = `
All following guidance is synthetic policy content for a portfolio demonstration.
[PAY-EXT] Payment extensions: verify identity first; agents may review eligible options but must not approve an extension, promise a due date, or promise waived fees. Escalate ongoing hardship to FIN-HRD.
[FIN-HRD] Financial hardship: verify first; document minimal high-level hardship summary; route to hardship review; do not give financial advice, decide eligibility, or promise an arrangement.
[FRAUD-UP] Unauthorized payment: verify first; record the report; route urgently to Fraud & Disputes; never determine fraud, liability, reversal, or investigation outcome.
[PAYOFF] Payoff quote: verify first; use official quote tool; do not estimate any payoff amount.
[SUP-CMP] Supervisor request: acknowledge and document request; use supervisor route; do not refuse or promise immediate callback.
[ID-DISC] Identity/disclosure: do not disclose or confirm account-specific balances, payment status, transaction details, payoff figures, or options until verification succeeds.
`

const json = (body: unknown, status = 200, origin = '') => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=UTF-8', ...cors(origin) }
})

const cors = (origin: string) => ({
  'access-control-allow-origin': origin,
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
  vary: 'Origin'
})

function permittedOrigin(request: Request, env: Env) {
  return request.headers.get('Origin') === env.ALLOWED_ORIGIN ? env.ALLOWED_ORIGIN : ''
}

function outputText(payload: { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }) {
  if (payload.output_text) return payload.output_text
  return payload.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? '').join('') ?? ''
}

export default {
  async fetch(request, env): Promise<Response> {
    const origin = permittedOrigin(request, env)
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) })
    if (!origin) return json({ error: 'Origin not permitted.' }, 403)
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/assist') return json({ error: 'Not found.' }, 404, origin)

    let query = ''
    try { query = String((await request.json() as { query?: string }).query ?? '').trim() } catch { return json({ error: 'A JSON request body is required.' }, 400, origin) }
    if (!query || query.length > 3000) return json({ error: 'Enter a question up to 3,000 characters.' }, 400, origin)

    const instructions = `You are Clearline Finance Call Assist, a synthetic policy copilot. Return only JSON matching this exact shape: {"response":"string","requiredSteps":["string"],"escalation":"string","confidence":"High|Medium|Review needed","sourceIds":["POLICY-ID"]}. Use only the policy context below. Never provide account-specific facts, approvals, financial advice, payment amounts, fraud determinations, liability decisions, or promises. Start response with verification when account-specific discussion could occur. If no policy clearly applies, set confidence to Review needed and direct the agent to verify identity and consult a supervisor. Keep response concise.\n${policyContext}`
    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model: env.OPENAI_MODEL || 'o3-mini', instructions, input: query, max_output_tokens: 700 })
    })
    if (!aiResponse.ok) return json({ error: 'The AI service could not generate guidance. Use the local policy result and try again.' }, 502, origin)
    const completion = await aiResponse.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }
    try {
      const advice = JSON.parse(outputText(completion)) as Record<string, unknown>
      return json({
        response: String(advice.response ?? ''),
        requiredSteps: Array.isArray(advice.requiredSteps) ? advice.requiredSteps.map(String).slice(0, 4) : [],
        escalation: String(advice.escalation ?? 'Review the approved escalation path.'),
        confidence: ['High', 'Medium', 'Review needed'].includes(String(advice.confidence)) ? advice.confidence : 'Review needed',
        sourceIds: Array.isArray(advice.sourceIds) ? advice.sourceIds.map(String).filter((id) => /^(PAY-EXT|FIN-HRD|FRAUD-UP|PAYOFF|SUP-CMP|ID-DISC)$/.test(id)).slice(0, 3) : []
      }, 200, origin)
    } catch { return json({ error: 'The AI service returned an unusable response. Use the local policy result and try again.' }, 502, origin) }
  }
} satisfies ExportedHandler<Env>
