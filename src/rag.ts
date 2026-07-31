import { policyChunks, type PolicyChunk } from './policies'

const tokenize = (text: string) => text.toLowerCase().replaceAll(/[^a-z0-9']/g, ' ').split(/\s+/).filter(Boolean)

export function retrieve(query: string, limit = 3): Array<PolicyChunk & { score: number }> {
  const words = tokenize(query)
  return policyChunks
    .map((item) => {
      const keywordHits = item.keywords.reduce((total, keyword) => total + (words.includes(keyword) ? 4 : 0), 0)
      const textHits = tokenize(`${item.title} ${item.text}`).filter((word) => words.includes(word)).length
      // Identity verification is a mandatory companion policy for every account-related call.
      const verificationBoost = item.policyId === 'ID-DISC' ? (keywordHits > 0 ? 2 : 1) : 0
      return { ...item, score: keywordHits + textHits + verificationBoost }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function responseFor(query: string) {
  const sources = retrieve(query)
  const primary = sources[0]
  const steps = Array.from(new Set(sources.flatMap((source) => source.steps))).slice(0, 4)
  const warning = sources.find((source) => source.escalation)?.escalation ?? 'No special escalation identified. Follow standard routing after verification.'
  const confidence = primary && primary.score >= 8 ? 'High' : primary ? 'Medium' : 'Review needed'
  return {
    sources,
    steps,
    warning,
    confidence,
    response: primary?.approvedLanguage ?? 'I can share general process information. Before I discuss any account details, I’ll need to verify your identity.'
  }
}
