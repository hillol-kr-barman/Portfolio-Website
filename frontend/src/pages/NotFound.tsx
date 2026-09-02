import type { AuthUser } from '@hillolbarman/ui'
import PageShell from '../components/PageShell'

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
    <PageShell
      onNavigate={onNavigate}
      currentPath={currentPath}
      currentUser={currentUser}
      onLogout={onLogout}
    >
      <div className="px-5 pb-[104px] pt-20 sm:px-10 lg:pt-24">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,40px)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink">
          Page not found
        </h1>
        <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-body text-pretty">
          The page you are looking for does not exist or may have moved. Use one of the links below
          to continue browsing.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/" onClick={(e) => handleNavigate(e, '/')} className="btn-primary">
            Back home
          </a>
          <a href="/projects" onClick={(e) => handleNavigate(e, '/projects')} className="btn-secondary">
            Browse projects
          </a>
        </div>
      </div>
    </PageShell>
  )
}
