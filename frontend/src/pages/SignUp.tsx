import { useState } from 'react'
import type { AuthUser } from '@hillolbarman/ui'
import AuthShell, { Field, FormError, OrRule } from '../components/AuthShell'
import GitHubButton from '../components/GitHubButton'
import { registerUser } from '../lib/playgroundStore'

interface SignUpProps {
  onNavigate: (to: string) => void
  routeSearch?: string
  onAuthChange: (user: AuthUser | null) => void
}

const perks = [
  {
    title: 'Saved snippets',
    body: 'Documents stay attached to your account and open from any device.',
  },
  {
    title: 'Share links',
    body: 'Turn any snippet into a read-only link that reopens the last saved version.',
  },
  {
    title: 'Six languages',
    body: 'JavaScript, TypeScript, Python, HTML, CSS and JSON, each with a starter snippet.',
  },
]

/** Three bars: length, a number, a symbol. */
function passwordStrength(password: string) {
  return [
    password.length >= 8,
    /\d/.test(password),
    /[^\w\s]/.test(password),
  ].filter(Boolean).length
}

export default function SignUp({ onNavigate, routeSearch = '', onAuthChange }: SignUpProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = new URLSearchParams(routeSearch).get('redirect') || '/playground'
  const strength = passwordStrength(password)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const user = await registerUser({ name, email, password })
      onAuthChange(user)
      onNavigate(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.')
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
      title="Create an account"
      lead="Free, and only used for the playground. No newsletter, no tracking."
      aside={
        <>
          <p className="eyebrow">What you get</p>
          <div className="mt-4.5 flex flex-col">
            {perks.map((perk, i) => (
              <div
                key={perk.title}
                className={`grid grid-cols-[auto_1fr] gap-4 border-t border-hair py-[18px] ${
                  i === perks.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="font-mono text-[12px] text-ghost">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="m-0 text-[15px] font-semibold text-strong">{perk.title}</p>
                  <p className="mt-1.5 text-[14px] leading-[1.7] text-dim">{perk.body}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="font-mono text-[11.5px] text-meta">
          <span aria-hidden="true" className="text-accent">*</span> All fields are required.
        </p>

        <Field id="signup-name" label="Name" required>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="field"
          />
        </Field>

        <Field id="signup-email" label="Email" required>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field"
          />
        </Field>

        <Field id="signup-password" label="Password" required>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="field"
          />
          <div className="mt-[9px] flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-0.5 flex-1 rounded-sm transition-colors duration-150 ease-out ${
                  i < strength ? 'bg-accent' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[11.5px] text-meta">
            8+ characters · one number · one symbol
          </p>
        </Field>

        {error ? <FormError message={error} /> : null}

        <button type="submit" disabled={isSubmitting} className="btn-primary mt-1.5 w-full rounded-[9px] py-3">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>

        <OrRule />
        <GitHubButton label="Continue with GitHub" redirectTo={redirectTo} onError={setError} />

        <p className="mt-2 text-[13.5px] text-muted">
          Already have an account?{' '}
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
