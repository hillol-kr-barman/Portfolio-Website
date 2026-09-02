import { useState } from 'react'
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
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
   * 'site'      — 64px, 40px gutter, canvas pages. Sticks to the top on scroll.
   * 'app'       — 56px, 24px gutter, the playground frame, which is already a
   *               fixed viewport frame and so does not stick.
   * 'read-only' — site frame with a mono marker in place of the account slot.
   */
  variant?: 'site' | 'app' | 'read-only'
  /** Mono marker rendered on the right of the 'read-only' variant. */
  marker?: string
}

/** The account chip shows a first name; the full email lives in the menu. */
function firstNameOf(user: AuthUser) {
  const name = user.name?.trim()
  if (name) return name.split(/\s+/)[0]
  return user.email.split('@')[0] || 'Account'
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

  const loginPath = `/login${
    currentPath && currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''
  }`

  return (
    <header
      className={`z-50 flex h-16 items-center border-b border-hair px-5 sm:px-10 ${
        isApp ? '' : 'sticky top-0 bg-canvas/85 backdrop-blur-md'
      }`}
    >
      <Wordmark onNavigate={onNavigate} />

      {/* Nav is right-aligned on every variant, with the account slot after it,
          so the header reads the same on a content page and in the playground. */}
      <nav
        className="ml-auto hidden items-center gap-[26px] lg:flex"
      >
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
      </nav>

      <div className={`flex items-center gap-3 lg:ml-7 ${variant === 'read-only' ? 'ml-auto' : 'ml-auto lg:ml-7'}`}>
        {variant === 'read-only' && marker ? (
          <span className="font-mono text-[11.5px] text-meta">{marker}</span>
        ) : null}

        {variant !== 'read-only' && currentUser ? (
          <Menu as="div" className="relative hidden sm:block">
            <MenuButton className="flex items-center gap-2 rounded-full border border-input py-1 pl-1 pr-3.5 transition-colors duration-150 ease-out hover:border-white/20">
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.14] font-mono text-[11px] font-semibold text-accent">
                {initialsOf(currentUser)}
              </span>
              <span className="max-w-[10rem] truncate text-[13px] font-[450] text-bright">
                {firstNameOf(currentUser)}
              </span>
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom end"
              className="z-[100] mt-2 w-56 rounded-xl border border-hair bg-raised p-1.5 shadow-panel transition duration-150 ease-out data-closed:opacity-0"
            >
              <div className="border-b border-hair px-2.5 pb-2.5 pt-1.5">
                <p className="truncate text-[13px] font-semibold text-strong">{currentUser.name}</p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-label">{currentUser.email}</p>
              </div>

              <MenuItem>
                <a
                  href="/playground"
                  onClick={(e) => go(e, '/playground')}
                  className="mt-1.5 block rounded-lg px-2.5 py-2 text-[13px] text-muted transition-colors duration-150 ease-out data-focus:bg-white/5 data-focus:text-bright"
                >
                  Code Playground
                </a>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  onClick={onLogout}
                  className="block w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-muted transition-colors duration-150 ease-out data-focus:bg-danger/10 data-focus:text-danger"
                >
                  Sign out
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        ) : null}

        {variant !== 'read-only' && !currentUser ? (
          <div className="hidden items-center gap-2.5 sm:flex">
            <a
              href={loginPath}
              onClick={(e) => go(e, loginPath)}
              className="font-[450] text-[13.5px] text-muted transition-colors duration-150 ease-out hover:text-bright"
            >
              Log in
            </a>
            <a href="/signup" onClick={(e) => go(e, '/signup')} className="btn-primary btn-sm">
              Sign up
            </a>
          </div>
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
              <>
                <p className="truncate text-[14px] font-semibold text-strong">{currentUser.name}</p>
                <p className="mt-0.5 truncate font-mono text-[11.5px] text-label">{currentUser.email}</p>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onLogout?.() }}
                  className="btn-danger btn-sm mt-4 w-full"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2.5">
                <a href="/signup" onClick={(e) => go(e, '/signup')} className="btn-primary btn-sm w-full">
                  Sign up
                </a>
                <a href={loginPath} onClick={(e) => go(e, loginPath)} className="btn-secondary btn-sm w-full">
                  Log in
                </a>
              </div>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
