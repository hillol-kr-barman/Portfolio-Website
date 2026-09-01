import { useState } from 'react'
import type { AuthUser } from '@hillolbarman/ui'
import AuthShell, { Field, FormError, OrRule } from '../components/AuthShell'
import CodePanel, { Cm, Kw, Str } from '../components/CodePanel'
import { loginUser } from '../lib/playgroundStore'
import GitHubButton from '../components/GitHubButton'

interface LogInProps {
  onNavigate: (to: string) => void
  routeSearch?: string
  onAuthChange: (user: AuthUser | null) => void
}

export default function LogIn({ onNavigate, routeSearch = '', onAuthChange }: LogInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = new URLSearchParams(routeSearch).get('redirect') || '/playground'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const user = await loginUser({ email, password })
      onAuthChange(user)
      onNavigate(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign you in.')
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
      title="Log in"
      lead="Sign in to save snippets to your account and share them with a link."
      aside={
        <CodePanel filename="session.ts">
          <Cm>// what an account unlocks</Cm>{'\n'}
          <Kw>const</Kw>{' account = {\n'}
          {'  save:  '}<Str>'snippets stay on your account'</Str>{',\n'}
          {'  share: '}<Str>'one link, last saved version'</Str>{',\n'}
          {'  sync:  '}<Str>'open them from any device'</Str>{',\n'}
          {'}'}
        </CodePanel>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field id="login-email" label="Email">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field"
          />
        </Field>

        <Field
          id="login-password"
          label="Password"
          trailing={
            <a
              href="/forgot-password"
              onClick={(e) => go(e, '/forgot-password')}
              className="text-[12px] font-[450] text-muted transition-colors duration-150 ease-out hover:text-bright"
            >
              Forgot?
            </a>
          }
        >
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3.5 font-mono text-[11.5px] text-label transition-colors duration-150 ease-out hover:text-bright"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>

        {error ? <FormError message={error} /> : null}

        <button type="submit" disabled={isSubmitting} className="btn-primary mt-1.5 w-full py-3 rounded-[9px]">
          {isSubmitting ? 'Signing in…' : 'Log in'}
        </button>

        <OrRule />
        <GitHubButton label="Continue with GitHub" redirectTo={redirectTo} onError={setError} />

        <p className="mt-3 text-[13.5px] text-muted">
          No account yet?{' '}
          <a
            href="/signup"
            onClick={(e) => go(e, '/signup')}
            className="font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-strong"
          >
            Create one
          </a>
        </p>
      </form>
    </AuthShell>
  )
}
