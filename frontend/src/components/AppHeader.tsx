import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import type { AuthUser } from '@hillolbarman/ui'
import Wordmark from './Wordmark'
import { navigation } from '../pages/pageData/homePageData'

interface AppHeaderProps {
  currentPath?: string
  currentUser?: AuthUser | null
  onNavigate: (to: string) => void
  onLogout?: () => void
  /**
   * 'site'      — 64px, 40px gutter, canvas pages.
   * 'app'       — 56px, 24px gutter, the playground frame; shows the signed-in
   *               identity (email + initials avatar) on the right.
   * 'read-only' — site frame with a mono marker instead of nav actions.
   */
  variant?: 'site' | 'app' | 'read-only'
  /** Mono marker rendered on the right of the 'read-only' variant. */
  marker?: string
}

function initialsOf(user: AuthUser) {
  const source = user.name?.trim() || user.email
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  return (parts.slice(0, 2).map((p) => p[0]).join('') || 'HB').toUpperCase()
}

export default function AppHeader({
  currentPath = '/',
  currentUser,
  onNavigate,
  onLogout,
  variant = 'site',
  marker,
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isApp = variant === 'app'

  const go = (e: React.MouseEvent, to: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    onNavigate(to)
  }

  const navLinks = (
    <>
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          onClick={(e) => go(e, item.href)}
          className={`font-[450] text-[13.5px] transition-colors duration-150 ease-out hover:text-bright ${
            currentPath === item.href ? 'text-bright' : 'text-muted'
          }`}
        >
          {item.name}
        </a>
      ))}
    </>
  )

  return (
    <header
      className={`flex items-center border-b border-hair ${
        isApp ? 'h-14 justify-between px-6' : 'h-16 px-5 sm:px-10'
      } ${variant === 'read-only' ? 'justify-between' : ''}`}
    >
      <Wordmark onNavigate={onNavigate} compact={isApp} />

      {/* The app and shared-snippet frames centre the nav between the wordmark
          and the right-hand slot; content pages push it to the right gutter. */}
      <nav
        className={`hidden items-center lg:flex ${isApp ? 'gap-6' : 'gap-[26px]'} ${
          variant === 'site' ? 'ml-auto' : ''
        }`}
      >
        {navLinks}
      </nav>

      <div className={`flex items-center gap-3 ${variant === 'site' ? 'ml-auto lg:ml-0' : ''}`}>
        {variant === 'read-only' && marker ? (
          <span className="font-mono text-[11.5px] text-meta">{marker}</span>
        ) : null}

        {isApp && currentUser ? (
          <div className="hidden items-center gap-3 sm:flex">
            <span className="font-mono text-[12px] text-muted">{currentUser.email}</span>
            <button
              type="button"
              onClick={onLogout}
              title="Sign out"
              className="flex size-[26px] items-center justify-center rounded-full border border-accent/30 bg-accent/[0.14] font-mono text-[11px] font-semibold text-accent transition-colors duration-150 ease-out hover:border-accent/60"
            >
              {initialsOf(currentUser)}
            </button>
          </div>
        ) : null}

        {isApp && !currentUser ? (
          <a
            href="/login?redirect=/playground"
            onClick={(e) => go(e, '/login?redirect=/playground')}
            className="hidden font-[450] text-[13px] text-muted transition-colors duration-150 ease-out hover:text-bright sm:block"
          >
            Log in
          </a>
        ) : null}

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2 p-2 text-muted transition-colors hover:text-bright lg:hidden"
        >
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="size-5" aria-hidden="true" />
        </button>
      </div>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-[200] bg-black/50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-[200] w-full max-w-sm overflow-y-auto border-l border-hair bg-raised p-6">
          <div className="mb-10 flex items-center justify-between">
            <Wordmark onNavigate={(to) => { setMobileMenuOpen(false); onNavigate(to) }} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2 p-2 text-muted transition-colors hover:text-bright"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className={`border-t border-hair py-3.5 text-[15px] font-[450] transition-colors ${
                  currentPath === item.href ? 'text-bright' : 'text-muted'
                }`}
              >
                {item.name}
              </a>
            ))}
            <a
              href="/coffee"
              onClick={(e) => go(e, '/coffee')}
              className={`border-y border-hair py-3.5 text-[15px] font-[450] transition-colors ${
                currentPath === '/coffee' ? 'text-bright' : 'text-muted'
              }`}
            >
              Support
            </a>
          </div>

          <div className="mt-8">
            {currentUser ? (
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate font-mono text-[12px] text-muted">
                  {currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onLogout?.() }}
                  className="btn-secondary btn-sm"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={(e) => go(e, '/login')}
                className="btn-secondary btn-sm w-full"
              >
                Log in
              </a>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
