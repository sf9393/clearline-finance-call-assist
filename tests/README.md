# Test plan (implementation pending PRD approval)

The application will add executable Vitest and Testing Library tests in this directory.

## Required coverage

- Retrieval ranks Payment Extension, Financial Hardship, and Identity Verification guidance for “I can’t make my payment.”
- Retrieval ranks Unauthorized Payment & Fraud Intake and Identity Verification guidance for “This payment wasn’t authorized.”
- Retrieval ranks Supervisor Requests & Complaints and Identity Verification guidance for “I want a supervisor.”
- Each response includes citations, required steps, and an escalation warning when policy requires it.
- The UI keeps “Do not disclose account details until verified” visible in every scenario.
- No suggested language claims an approval, outcome, payoff amount, or real-account fact.

## Planned commands

```sh
make test
make check
```
