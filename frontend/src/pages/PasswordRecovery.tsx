import { useState } from 'react'
import type { AuthUser } from '@hillolbarman/ui'
import AuthShell, { Field, FormError, FormNote } from '../components/AuthShell'
import CodePanel, { Cm, Kw, Str } from '../components/CodePanel'
import { requestPasswordReset, updatePassword } from '../lib/playgroundStore'

interface PasswordRecoveryProps {
  /** 'forgot' sends the reset email; 'reset' sets a new password. */
  mode: 'forgot' | 'reset'
  onNavigate: (to: string) => void
  onAuthChange: (user: AuthUser | null) => void
  onPasswordRecoveryConsumed?: () => void
}

/**
 * The forgot-password and reset-password screens. Neither was drawn in the
 * prototype, so both reuse the auth frame, tokens and form primitives from the
 * two screens that were.
 */
export default function PasswordRecovery({
  mode,
  onNavigate,
  onAuthChange,
  onPasswordRecoveryConsumed,
}: PasswordRecoveryProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isForgot = mode === 'forgot'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNote('')
    setIsSubmitting(true)

    try {
      if (isForgot) {
        await requestPasswordReset(email)
        setNote('Check your inbox for a link to set a new password.')
      } else {
        const user = await updatePassword(password)
        onAuthChange(user)
        onPasswordRecoveryConsumed?.()
        onNavigate('/playground')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const go = (event: React.MouseEvent, to: string) => {
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <AuthShell
      onNavigate={onNavigate}
      eyebrow="Account"
      title={isForgot ? 'Reset your password' : 'Set a new password'}
      lead={
        isForgot
          ? 'Enter the email on your account and we will send you a link to set a new password.'
          : 'Choose a new password for your account. You will be signed in once it is saved.'
      }
      aside={
        <CodePanel filename="recovery.ts">
          <Cm>// how this works</Cm>{'\n'}
          <Kw>const</Kw>{' recovery = {\n'}
          {'  link:  '}<Str>'single use, expires shortly'</Str>{',\n'}
          {'  scope: '}<Str>'password only'</Str>{',\n'}
          {'  after: '}<Str>'signed in on this device'</Str>{',\n'}
          {'}'}
        </CodePanel>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isForgot ? (
          <Field id="recovery-email" label="Email">
            <input
              id="recovery-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field"
            />
          </Field>
        ) : (
          <Field id="recovery-password" label="New password">
            <input
              id="recovery-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="field"
            />
            <p className="mt-2 font-mono text-[11.5px] text-meta">
              8+ characters · one number · one symbol
            </p>
          </Field>
        )}

        {error ? <FormError message={error} /> : null}
        {note ? <FormNote message={note} /> : null}

        <button type="submit" disabled={isSubmitting} className="btn-primary mt-1.5 w-full rounded-[9px] py-3">
          {isSubmitting
            ? 'Working…'
            : isForgot
              ? 'Send reset link'
              : 'Save new password'}
        </button>

        <p className="mt-2 text-[13.5px] text-muted">
          Remembered it?{' '}
          <a
            href="/login"
            onClick={(e) => go(e, '/login')}
            className="font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-strong"
          >
            Log in
          </a>
        </p>
      </form>
    </AuthShell>
  )
}
