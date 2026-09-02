import { useMemo, useState } from 'react'
import type { AuthUser } from '@hillolbarman/ui'
import PageShell from '../components/PageShell'
import SectionRule from '../components/SectionRule'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

interface SupportTier {
  id: string
  amount: string
  label: string
  cta: string
  description: string
  /** The recommended tier carries the accent label, border, wash and primary button. */
  recommended?: boolean
}

const supportTiers: SupportTier[] = [
  {
    id: 'espresso',
    amount: '$5',
    label: 'Basic Support',
    cta: 'Support with $5',
    description: 'A small contribution toward maintaining this portfolio and its related project work.',
  },
  {
    id: 'double',
    amount: '$10',
    label: 'Standard Support',
    cta: 'Support with $10',
    description: 'Additional support for continued development, hosting, and professional project improvements.',
    recommended: true,
  },
  {
    id: 'snacks',
    amount: '$20',
    label: 'Extended Support',
    cta: 'Support with $20',
    description: 'A generous contribution toward ongoing technical experiments and portfolio enhancements.',
  },
]

interface BuyMeCoffeeProps {
  onNavigate: (to: string) => void
  currentUser?: AuthUser | null
  onLogout?: () => void
  currentPath?: string
}

interface CheckoutInput {
  tier?: string | null
  customAmount?: string | null
}

export default function BuyMeCoffee({ onNavigate, currentUser, onLogout, currentPath = '/coffee' }: BuyMeCoffeeProps) {
  const [isSubmittingTier, setIsSubmittingTier] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [customAmount, setCustomAmount] = useState('')

  const checkoutStatus = useMemo(() => new URLSearchParams(window.location.search).get('status'), [])
  const shouldShowDefaultMessage = checkoutStatus === null && !checkoutError

  async function startCheckout({ tier = null, customAmount: rawCustomAmount = null }: CheckoutInput) {
    setCheckoutError('')

    const submissionId = tier ?? 'custom'
    setIsSubmittingTier(submissionId)

    let requestBody: Record<string, unknown> = {}

    if (rawCustomAmount !== null) {
      const parsedAmount = Number.parseFloat(rawCustomAmount)

      if (!Number.isFinite(parsedAmount)) {
        setCheckoutError('Enter a valid amount, for example 26 or 26.50.')
        setIsSubmittingTier(null)
        return
      }

      if (parsedAmount <= 25) {
        setCheckoutError('Custom support amounts must be at least $26.00.')
        setIsSubmittingTier(null)
        return
      }

      requestBody = { custom_amount: parsedAmount }
    } else {
      requestBody = { tier }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      let payload: { url?: string; detail?: string } | null = null

      try {
        payload = await response.json() as { url?: string; detail?: string }
      } catch {
        payload = null
      }

      if (!response.ok) {
        throw new Error(payload?.detail || 'Could not start checkout.')
      }

      if (!payload?.url) {
        throw new Error('Stripe did not return a checkout URL.')
      }

      window.location.href = payload.url
    } catch (error) {
      const message =
        error instanceof TypeError
          ? `Could not reach the payment API at ${API_BASE_URL}. Make sure the FastAPI server is running.`
          : error instanceof Error
            ? error.message
            : 'Could not start checkout.'

      setCheckoutError(message)
    } finally {
      setIsSubmittingTier(null)
    }
  }

  return (
    <PageShell
      onNavigate={onNavigate}
      currentPath={currentPath}
      currentUser={currentUser}
      onLogout={onLogout}
    >
      <div className="border-b border-hair px-5 pb-12 pt-14 sm:px-10 lg:pt-[72px]">
        <p className="eyebrow">Support My Work</p>
        <h1 className="mt-4.5 max-w-[20ch] text-[clamp(2rem,5.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink">
          Support continued portfolio development.
        </h1>

        {shouldShowDefaultMessage ? (
          <p className="mt-4.5 max-w-[60ch] text-[clamp(15.5px,2vw,17px)] leading-[1.7] text-body text-pretty">
            Select a support tier to continue to secure Stripe Checkout.
          </p>
        ) : null}

        {checkoutStatus === 'success' ? (
          <p className="mt-6 max-w-[60ch] rounded-[10px] border border-accent/25 bg-accent/[0.05] px-4 py-3 text-[14.5px] leading-[1.7] text-strong">
            Payment completed. Thank you for supporting the work.
          </p>
        ) : null}

        {checkoutStatus === 'cancelled' ? (
          <p className="mt-6 max-w-[60ch] rounded-[10px] border border-input px-4 py-3 text-[14.5px] leading-[1.7] text-body">
            Checkout was cancelled. You can try again at any time.
          </p>
        ) : null}

        {checkoutError ? (
          <p
            role="alert"
            className="mt-6 max-w-[60ch] rounded-[10px] border border-danger/40 bg-danger/[0.08] px-4 py-3 text-[14.5px] leading-[1.7] text-[#e2a5a1]"
          >
            {checkoutError}
          </p>
        ) : null}
      </div>

      <SectionRule index="01" label="Tiers" last className="pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {supportTiers.map((tier) => (
            <article
              key={tier.id}
              className={`flex flex-col gap-2.5 rounded-[14px] border p-6 ${
                tier.recommended
                  ? 'border-accent/35 bg-accent/[0.04]'
                  : 'row-hover border-white/[0.08]'
              }`}
            >
              <p className={`eyebrow ${tier.recommended ? 'text-accent' : ''}`}>{tier.label}</p>
              <p className="m-0 text-[34px] font-semibold tracking-[-0.035em] text-ink">
                {tier.amount}
              </p>
              <p className="m-0 flex-1 text-[14.5px] leading-[1.7] text-dim text-pretty">
                {tier.description}
              </p>
              <button
                type="button"
                onClick={() => startCheckout({ tier: tier.id })}
                disabled={isSubmittingTier !== null}
                className={`${tier.recommended ? 'btn-primary' : 'btn-secondary'} mt-2 w-full py-2.5 text-[13.5px]`}
              >
                {isSubmittingTier === tier.id ? 'Redirecting…' : tier.cta}
              </button>
            </article>
          ))}
        </div>

        <div className="row-hover mt-4 grid items-end gap-6 rounded-[14px] border border-white/[0.08] p-6 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="eyebrow">Custom Support</p>
            <label htmlFor="custom_amount" className="sr-only">
              Custom support amount in AUD
            </label>
            <p className="mt-2.5 max-w-[60ch] text-[14.5px] leading-[1.7] text-dim">
              Enter a custom amount to support ongoing portfolio development and technical work.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <input
              id="custom_amount"
              name="custom_amount"
              type="number"
              min="1"
              step="0.01"
              inputMode="decimal"
              placeholder="30.00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="field field-mono rounded-[10px]"
            />
            <button
              type="button"
              onClick={() => startCheckout({ customAmount })}
              disabled={isSubmittingTier !== null}
              className="btn-secondary w-full py-2.5 text-[13.5px]"
            >
              {isSubmittingTier === 'custom' ? 'Redirecting…' : 'Support with a custom amount'}
            </button>
          </div>
        </div>
      </SectionRule>
    </PageShell>
  )
}
