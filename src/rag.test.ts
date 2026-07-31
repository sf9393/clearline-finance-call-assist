import { describe, expect, it } from 'vitest'
import { responseFor, retrieve } from './rag'

describe('synthetic policy retrieval', () => {
  it('retrieves payment and verification guidance for payment difficulty', () => {
    const sources = retrieve('I cannot make my payment this month')
    expect(sources.map((source) => source.policyId)).toContain('PAY-EXT')
    expect(sources.map((source) => source.policyId)).toContain('ID-DISC')
  })
  it('retrieves fraud guidance for an unauthorized payment', () => {
    const result = responseFor('This payment was not authorized')
    expect(result.sources[0].policyId).toBe('FRAUD-UP')
    expect(result.warning).toMatch(/Fraud & Disputes/)
  })
  it('retrieves supervisor guidance for a supervisor request', () => {
    const result = responseFor('I want a supervisor')
    expect(result.sources.map((source) => source.policyId)).toContain('SUP-CMP')
    expect(result.response).toMatch(/supervisor/i)
  })
})
