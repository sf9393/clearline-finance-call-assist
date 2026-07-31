import { useMemo, useState } from 'react'
import { demos } from './policies'
import { responseFor } from './rag'

type AiAdvice = { response: string; requiredSteps: string[]; escalation: string; confidence: 'High' | 'Medium' | 'Review needed'; sourceIds: string[] }
const apiUrl = import.meta.env.VITE_CALL_ASSIST_API_URL?.replace(/\/$/, '')

export default function App() {
  const [query, setQuery] = useState(demos[0].query)
  const [aiAdvice, setAiAdvice] = useState<AiAdvice | null>(null)
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'error'>('idle')
  const localResult = useMemo(() => responseFor(query), [query])
  const result = aiAdvice ? { ...localResult, response: aiAdvice.response, steps: aiAdvice.requiredSteps, warning: aiAdvice.escalation, confidence: aiAdvice.confidence, sources: localResult.sources.filter((source) => aiAdvice.sourceIds.includes(source.policyId)) } : localResult
  async function generateAdvice() {
    if (!apiUrl) { setAiState('error'); return }
    setAiState('loading'); setAiAdvice(null)
    try {
      const response = await fetch(`${apiUrl}/assist`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query }) })
      const body = await response.json() as AiAdvice & { error?: string }
      if (!response.ok || body.error) throw new Error(body.error)
      setAiAdvice(body); setAiState('idle')
    } catch { setAiState('error') }
  }
  return <main className="app-shell">
    <header className="topbar">
      <div className="brand-mark">CL</div><div><p className="eyebrow">CLEARLINE FINANCE · SYNTHETIC DEMO</p><h1>Call Assist</h1></div>
      <span className="demo-badge">Policy-aware RAG copilot</span>
    </header>
    <section className="notice"><span>✦</span> All policies, customer examples, and recommendations in this interface are fictional and for portfolio demonstration only.</section>
    <div className="workspace">
      <aside className="panel intake">
        <p className="section-label">Customer issue</p>
        <h2>What did the customer say?</h2>
        <label htmlFor="query">Agent question or call summary</label>
        <textarea id="query" value={query} onChange={(event) => { setQuery(event.target.value); setAiAdvice(null); setAiState('idle') }} />
        <button className="ai-button" onClick={generateAdvice} disabled={aiState === 'loading'}>{aiState === 'loading' ? 'Generating advice…' : 'Generate with OpenAI'}</button>
        {aiState === 'error' && <p className="ai-error">{apiUrl ? 'AI guidance is unavailable. Showing local policy guidance.' : 'AI endpoint is not configured. Showing local policy guidance.'}</p>}
        <div className="demo-list"><p className="section-label">Try a demo</p>{demos.map((demo) => <button className={query === demo.query ? 'active' : ''} key={demo.label} onClick={() => { setQuery(demo.query); setAiAdvice(null); setAiState('idle') }}>{demo.label}<span>›</span></button>)}</div>
        <p className="local-note">Local-only retrieval · No customer data stored</p>
      </aside>
      <section className="panel response-panel">
        <div className="response-head"><div><p className="section-label">Suggested response</p><h2>Read this to the customer</h2></div><span className="read-badge">Approved language</span></div>
        <blockquote>{result.response}</blockquote>
        <div className="call-steps"><p className="section-label">Required call steps</p><ol>{result.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
        <div className="agent-note"><span>i</span><p>Use this as guidance. Confirm each step in the approved workflow; do not make eligibility, fraud, or account-outcome promises.</p></div>
      </section>
      <aside className="panel evidence">
        <div className="confidence"><p className="section-label">Retrieval confidence</p><strong className={result.confidence.toLowerCase().replaceAll(' ', '-')}>{result.confidence}</strong><span>Grounded in synthetic policy chunks</span></div>
        <div className="warning"><p className="section-label">Escalation warning</p><p>{result.warning}</p></div>
        <div className="sources"><p className="section-label">Internal sources</p>{result.sources.length ? result.sources.map((source) => <article key={source.id}><div><b>{source.policyId}</b><span>{source.section}</span></div><p>{source.title}</p><small>{source.version} · synthetic</small></article>) : <p className="empty">No policy matched. Use the verification process and consult a supervisor.</p>}</div>
      </aside>
    </div>
    <footer className="guardrail"><span className="lock">▣</span><div><b>Do not disclose account details until verified.</b><span> Account balances, payment status, transaction details, payoff figures, and options require successful identity verification.</span></div><span className="policy-ref">ID-DISC · v4.2</span></footer>
  </main>
}
