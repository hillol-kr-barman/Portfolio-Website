import { lazy, Suspense, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { AuthUser } from '@hillolbarman/ui'
import { logoutUser, getCurrentUser } from './lib/playgroundStore'
import HomePage from './pages/HomePage'

const AllProjects = lazy(() => import('./pages/AllProjects'))
const AboutMe = lazy(() => import('./pages/AboutMe'))
const Playground = lazy(() => import('./pages/Playground'))
const BuyMeCoffee = lazy(() => import('./pages/BuyMeCoffee'))
const UnderConstruction = lazy(() => import('./pages/UnderConstruction'))
const NotFound = lazy(() => import('./pages/NotFound'))
const LogIn = lazy(() => import('./pages/LogIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const PasswordRecovery = lazy(() => import('./pages/PasswordRecovery'))

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

const PASSWORD_RECOVERY_FLAG = 'resume-password-recovery'

function mapSessionUser(user: User | null): AuthUser | null {
  if (!user) return null

  const fullName =
    (user.user_metadata?.['name'] as string | undefined) ||
    (user.user_metadata?.['full_name'] as string | undefined) ||
    user.email?.split('@')[0] ||
    'Mate'

  return { id: user.id, name: fullName, email: user.email ?? '' }
}

interface RouteState {
  path: string
  search: string
}

export default function App() {
  const isSiteUnderConstruction = false
  const [route, setRoute] = useState<RouteState>(() => ({
    path: normalizePath(window.location.pathname),
    search: window.location.search,
  }))
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isPasswordRecoveryActive, setIsPasswordRecoveryActive] = useState(
    () => window.sessionStorage.getItem(PASSWORD_RECOVERY_FLAG) === 'true',
  )

  useEffect(() => {
    let isMounted = true
    let unsubscribe = () => {}

    const bootstrapAuth = async () => {
      try {
        const [, { supabase }] = await Promise.all([
          import('./lib/playgroundStore'),
          import('./lib/supabaseClient'),
        ])

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (!isMounted) return

          setCurrentUser(mapSessionUser(session?.user ?? null))
          const isRecovery = event === 'PASSWORD_RECOVERY'

          if (isRecovery) {
            window.sessionStorage.setItem(PASSWORD_RECOVERY_FLAG, 'true')
          }

          if (event === 'SIGNED_OUT') {
            window.sessionStorage.removeItem(PASSWORD_RECOVERY_FLAG)
          }

          setIsPasswordRecoveryActive(
            isRecovery || window.sessionStorage.getItem(PASSWORD_RECOVERY_FLAG) === 'true',
          )
        })

        unsubscribe = () => subscription.unsubscribe()

        const user = await getCurrentUser()
        if (isMounted) setCurrentUser(user)
      } catch {
        if (isMounted) setCurrentUser(null)
      }
    }

    const idleHandle = window.setTimeout(() => { bootstrapAuth() }, 1)

    return () => {
      isMounted = false
      window.clearTimeout(idleHandle)
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setRoute({
        path: normalizePath(window.location.pathname),
        search: window.location.search,
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return

    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(() => {
    if (!isSiteUnderConstruction || route.path === '/') return

    window.history.replaceState({}, '', '/')
    setRoute({ path: '/', search: '' })
  }, [isSiteUnderConstruction, route.path])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [route.path, route.search])

  const navigate = (to: string) => {
    const nextUrl = new URL(to, window.location.origin)
    const nextPath = normalizePath(nextUrl.pathname)
    const nextSearch = nextUrl.search

    if (nextPath === route.path && nextSearch === route.search) return

    window.history.pushState({}, '', `${nextPath}${nextSearch}`)
    setRoute({ path: nextPath, search: nextSearch })
  }

  const handleAuthChange = (user: AuthUser | null) => {
    setCurrentUser(user)
  }

  const handleLogout = async () => {
    await logoutUser()
    setCurrentUser(null)
    navigate('/')
  }

  const renderLazyPage = (node: React.ReactNode) => (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>{node}</Suspense>
  )

  if (isSiteUnderConstruction) {
    return renderLazyPage(<UnderConstruction />)
  }

  // ── Auth routes ───────────────────────────────────────────────────────────
  if (route.path === '/login') {
    return renderLazyPage(
      <LogIn onNavigate={navigate} routeSearch={route.search} onAuthChange={handleAuthChange} />,
    )
  }

  // `/register` is the historic path; the redesign names the screen `/signup`.
  if (route.path === '/signup' || route.path === '/register') {
    return renderLazyPage(
      <SignUp onNavigate={navigate} routeSearch={route.search} onAuthChange={handleAuthChange} />,
    )
  }

  if (route.path === '/forgot-password' || route.path === '/reset-password') {
    return renderLazyPage(
      <PasswordRecovery
        mode={route.path === '/reset-password' || isPasswordRecoveryActive ? 'reset' : 'forgot'}
        onNavigate={navigate}
        onAuthChange={handleAuthChange}
        onPasswordRecoveryConsumed={() => {
          window.sessionStorage.removeItem(PASSWORD_RECOVERY_FLAG)
          setIsPasswordRecoveryActive(false)
        }}
      />,
    )
  }

  // ── Content routes ────────────────────────────────────────────────────────
  if (route.path === '/projects') {
    return renderLazyPage(
      <AllProjects onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />,
    )
  }

  if (route.path === '/playground') {
    return renderLazyPage(
      <Playground onNavigate={navigate} routeSearch={route.search} currentUser={currentUser} onLogout={handleLogout} />,
    )
  }

  if (route.path === '/about') {
    return renderLazyPage(
      <AboutMe onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />,
    )
  }

  if (route.path === '/coffee') {
    return renderLazyPage(
      <BuyMeCoffee onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />,
    )
  }

  if (route.path === '/') {
    return <HomePage onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />
  }

  return renderLazyPage(
    <NotFound onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} currentPath={route.path} />,
  )
}
