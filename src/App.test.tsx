import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('Call Assist screen', () => {
  it('keeps the disclosure guardrail visible and changes demos', () => {
    render(<App />)
    expect(screen.getByText(/Do not disclose account details until verified/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /unauthorized payment/i }))
    expect(screen.getByText('FRAUD-UP')).toBeInTheDocument()
    expect(screen.getByText(/Fraud & Disputes/i)).toBeInTheDocument()
  })
})
