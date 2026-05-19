import type { AuthUser } from '@hillolbarman/ui'
import BackgroundBeams from '../components/BackgroundBeams'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

interface NotFoundProps {
  onNavigate: (to: string) => void
  currentUser?: AuthUser | null
  onLogout?: () => void
  currentPath?: string
}

export default function NotFound({ onNavigate, currentUser, onLogout, currentPath = '' }: NotFoundProps) {
  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <div>
      <AppHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      <main className="relative isolate overflow-hidden">
        <BackgroundBeams className="-z-10" />
        <section className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl items-center px-5 py-24 lg:px-6">
          <div className="w-full rounded-3xl border border-white/10 bg-surface/80 p-6 text-center backdrop-blur sm:p-8">
            <p className="type-eyebrow">Error 404</p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Page not found</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm/7 text-muted">
              The page you are looking for does not exist or may have moved. Use one of the links below to continue browsing.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/"
                onClick={(e) => handleNavigate(e, '/')}
                className="inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back home
              </a>
              <a
                href="/projects"
                onClick={(e) => handleNavigate(e, '/projects')}
                className="inline-flex rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-accent/50 hover:text-accent"
              >
                Browse projects
              </a>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  )
}
