import type { ReactNode } from 'react'
import type { AuthUser } from '@hillolbarman/ui'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

interface PageShellProps {
  children: ReactNode
  onNavigate: (to: string) => void
  currentPath?: string
  currentUser?: AuthUser | null
  onLogout?: () => void
  /** The playground is dense enough already and opts out of the canvas grid. */
  grid?: boolean
  footer?: boolean
}

export default function PageShell({
  children,
  onNavigate,
  currentPath,
  currentUser,
  onLogout,
  grid = true,
  footer = true,
}: PageShellProps) {
  return (
    <div className={`min-h-screen ${grid ? 'canvas-grid' : 'bg-canvas'}`}>
      <AppHeader
        onNavigate={onNavigate}
        currentPath={currentPath}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <main>{children}</main>
      {footer ? <AppFooter onNavigate={onNavigate} /> : null}
    </div>
  )
}
