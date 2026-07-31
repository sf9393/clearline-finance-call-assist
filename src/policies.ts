export type PolicyId = 'PAY-EXT' | 'FIN-HRD' | 'FRAUD-UP' | 'PAYOFF' | 'SUP-CMP' | 'ID-DISC'

export type PolicyChunk = {
  id: string
  policyId: PolicyId
  title: string
  version: string
  section: string
  keywords: string[]
  text: string
  maySay: string[]
  mayNotSay: string[]
  steps: string[]
  escalation?: string
  approvedLanguage?: string
}

const meta = {
  'PAY-EXT': ['Payment Extension & Due-Date Support', 'v1.4 · 2026-04-15'],
  'FIN-HRD': ['Financial Hardship Assistance', 'v2.1 · 2026-05-01'],
  'FRAUD-UP': ['Unauthorized Payment & Fraud Intake', 'v3.0 · 2026-06-10'],
  'PAYOFF': ['Payoff Quote Requests', 'v1.2 · 2026-03-20'],
  'SUP-CMP': ['Supervisor Requests & Complaints', 'v2.0 · 2026-04-08'],
  'ID-DISC': ['Identity Verification & Disclosure Controls', 'v4.2 · 2026-06-25'],
} as const

function chunk(policyId: PolicyId, section: string, keywords: string[], text: string, steps: string[], approvedLanguage?: string, escalation?: string): PolicyChunk {
  const [title, version] = meta[policyId]
  return { id: `${policyId}-${section.replaceAll(/\s+/g, '-').toLowerCase()}`, policyId, title, version, section, keywords, text, maySay: [], mayNotSay: [], steps, approvedLanguage, escalation }
}

export const policyChunks: PolicyChunk[] = [
  chunk('PAY-EXT', 'Eligibility review', ['payment', 'cannot', "can't", 'make', 'month', 'extension', 'due', 'late'], 'Agents may explain that extension options are reviewed, subject to account eligibility. Agents may not approve an extension, promise a new due date, or promise that fees will be waived.', ['Complete identity verification before account discussion.', 'Acknowledge the payment concern without promising an outcome.', 'Review eligible extension options using the approved workflow.'], '“I’m sorry you’re dealing with that. After I verify your information, I can review the payment-support options available for your account.”', 'Escalate to Financial Hardship Assistance when the customer describes an ongoing inability to pay or significant financial disruption.'),
  chunk('FIN-HRD', 'Hardship intake', ['hardship', 'income', 'lost', 'job', 'expenses', 'afford', 'ongoing', 'financial'], 'Agents may collect a high-level description of hardship and offer a review. Agents may not give financial advice, decide eligibility, or guarantee a payment arrangement.', ['Complete identity verification before account discussion.', 'Ask whether the difficulty is short-term or ongoing.', 'Document only the minimum hardship summary needed for the approved intake.', 'Route the case to the hardship review queue.'], '“I’m sorry this is difficult. I can document a brief summary and have the appropriate team review the support options that may be available.”', 'Required escalation: send to the hardship review queue; do not negotiate a nonstandard arrangement.'),
  chunk('FRAUD-UP', 'Unauthorized payment intake', ['unauthorized', 'authorised', 'authorized', 'fraud', 'not mine', 'didn’t', 'didnt', 'payment'], 'Treat a reported unauthorized payment as a fraud/dispute intake. Agents may acknowledge the report and explain the next step. Agents may not determine fraud, assign liability, reverse a payment, or promise an investigation outcome.', ['Complete identity verification before discussing transaction details.', 'Capture the report using the unauthorized-payment intake workflow.', 'Advise the customer that a specialist review will assess the report.', 'Provide only approved case-reference information after it exists.'], '“I’m sorry this payment is concerning. Once I verify your information, I’ll document the report and connect it to the review process.”', 'Urgent escalation: route to the Fraud & Disputes queue during the call.'),
  chunk('PAYOFF', 'Quote request', ['payoff', 'quote', 'pay', 'off', 'balance', 'full'], 'Agents may explain that an official payoff quote is time-sensitive and must be generated through the approved quote tool. Agents may not estimate a payoff balance or quote an amount from memory.', ['Complete identity verification before account discussion.', 'Use the approved payoff-quote tool.', 'Read the quote validity date and required disclosures exactly as displayed.'], '“After I verify your information, I can request an official payoff quote and review its validity date with you.”'),
  chunk('SUP-CMP', 'Supervisor request', ['supervisor', 'manager', 'complaint', 'escalate', 'unhappy', 'dissatisfied'], 'Agents may acknowledge the request, attempt one concise resolution when appropriate, and follow the supervisor-request workflow. Agents may not refuse a supervisor request, promise an immediate callback, or characterize the complaint as invalid.', ['Complete identity verification before account-specific discussion.', 'Acknowledge the concern without debating it.', 'Document the stated reason for the supervisor request.', 'Follow the approved supervisor-request routing path.'], '“I hear that you’d like a supervisor. I’ll document your concern and follow the supervisor-request process so the right next step is taken.”', 'Required escalation: submit the supervisor request according to queue availability and callback rules.'),
  chunk('ID-DISC', 'Verification gate', ['verify', 'verification', 'identity', 'account', 'details', 'disclose', 'before'], 'Before discussing account details, balances, transactions, payment status, payoff amounts, or available options, agents must complete the approved identity-verification process. Agents may give general, non-account-specific process information before verification.', ['Use the approved verification sequence.', 'Do not reveal or confirm account-specific information until verification succeeds.', 'If verification cannot be completed, offer only general process information and follow the verification-failure workflow.'], '“Before I access or discuss account details, I’ll need to verify your identity. I can share general information about the process while we complete that step.”', 'Stop account-specific discussion and follow verification-failure workflow if verification is unsuccessful.')
]

export const demos = [
  { label: 'Payment difficulty', query: 'I can’t make my payment.' },
  { label: 'Unauthorized payment', query: 'This payment wasn’t authorized.' },
  { label: 'Supervisor request', query: 'I want a supervisor.' },
]
