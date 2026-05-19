import { useState } from 'react'
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import type { AuthUser } from '@hillolbarman/ui'
import { ProjectCard } from '@hillolbarman/ui'
import BackgroundBeams from '../components/BackgroundBeams'
import coffeeCup from '../assets/coffeeCup.svg'
import { techStackLogos, projects, featuredProjectIds } from './pageData/homePageData'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

interface HomePageProps {
  onNavigate: (to: string) => void
  currentUser?: AuthUser | null
  onLogout?: () => void
  currentPath?: string
}

export default function HomePage({ onNavigate, currentUser, onLogout, currentPath = '/' }: HomePageProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false)
  const [typingDone, setTypingDone] = useState(false)

  const [text] = useTypewriter({
    words: ['Think.', 'Plan.', 'Build.', 'Ship.', 'Think. Plan. Build. Ship.'],
    loop: 1,
    typeSpeed: 90,
    deleteSpeed: 45,
    delaySpeed: 800,
    onLoopDone: () => setTypingDone(true),
  })

  const displayText = typingDone ? 'Think. Plan. Build. Ship.' : text

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    event.preventDefault()
    onNavigate(to)
  }

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = newsletterEmail.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!isValidEmail) {
      setNewsletterMessage('Please enter a valid email address.')
      return
    }

    setIsNewsletterSubmitting(true)
    setNewsletterMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail.toLowerCase() }),
      })

      let payload: { message?: string; detail?: string } | null = null

      try {
        payload = await response.json() as { message?: string; detail?: string }
      } catch {
        payload = null
      }

      if (!response.ok) {
        const detail = typeof payload?.detail === 'string' ? payload.detail : 'Could not join the newsletter right now.'
        throw new Error(detail)
      }

      setNewsletterMessage(payload?.message || `${trimmedEmail} has been added to the mailing list.`)
      setNewsletterEmail('')
    } catch (error) {
      setNewsletterMessage(
        error instanceof Error ? error.message : 'Could not join the newsletter right now.',
      )
    } finally {
      setIsNewsletterSubmitting(false)
    }
  }

  const featuredProjects = featuredProjectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  return (
    <div>
      <AppHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden -mt-18 pt-28">
        <BackgroundBeams className="-z-10" />
        <div className="mx-auto max-w-6xl px-5 pb-18 pt-10 sm:pb-22 lg:px-6 lg:pb-24 lg:pt-18">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="type-eyebrow">
              Backend Focused Full Stack Software Engineer
            </p>
            <h1 className="type-hero mt-5 max-w-3xl text-balance">
              {displayText}
              {!typingDone && <Cursor cursorBlinking />}
            </h1>
            <p className="type-body mt-6 max-w-2xl text-pretty">
              I design and develop responsive web products with a focus on maintainable code, clear user journeys, and dependable full-stack implementation.
            </p>
            <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-center">
              <a
                href="/projects"
                onClick={(e) => handleNavigate(e, '/projects')}
                className="inline-flex items-center justify-center gap-x-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View Project
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Technologies */}
      <div className="mx-auto mt-24 max-w-6xl sm:mt-28 sm:px-5 lg:px-6">
        <div className="relative isolate overflow-hidden bg-surface px-5 py-14 text-center after:pointer-events-none after:absolute after:inset-0 after:inset-ring after:inset-ring-white/10 sm:rounded-3xl sm:px-10 after:sm:rounded-3xl">
          <h4 className="type-section-title mx-auto max-w-2xl">Primary Technologies</h4>
          <p className="type-body mx-auto mt-4 max-w-3xl">
            These are the technologies I use to build performant interfaces, reliable APIs, and maintainable product foundations.
            I choose tools based on product requirements, scalability, and long-term maintainability.
          </p>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 opacity-60 sm:grid-cols-3 lg:max-w-none lg:grid-cols-7">
            {techStackLogos.map((logo) => (
              <img key={logo.name} alt={logo.name} src={logo.src} width={48} height={48} className="h-12 w-12 object-contain" />
            ))}
          </div>
          <div className="type-eyebrow mt-14 items-center justify-center">This site runs on</div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
            {['React', 'Fast API', 'Supabase', 'Tailwind', 'Stripe'].map((tech) => (
              <span key={tech} className="rounded-full border font-mono border-accent/10 bg-accent/5 px-4 py-2">{tech}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mx-auto mb-24 mt-32 max-w-6xl px-5 lg:px-6">
        <h2 className="type-section-title text-center">Featured Projects</h2>
        <div className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-4">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
          <div className="border-t border-white/10" />
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onNavigate('/projects') }}
            className="inline-flex shrink-0 items-center justify-center gap-x-2 rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View Project Details
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </button>
          <div className="border-t border-white/10" />
        </div>
      </div>

      {/* Newsletter */}
      <div className="mx-auto max-w-6xl px-5 py-6 lg:px-6">
        <section className="rounded-[28px] border border-white/10 bg-surface/80 px-5 py-6 sm:px-6 sm:py-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-center">
            <div className="flex justify-center lg:justify-start lg:border-r lg:border-white/10 lg:pr-8">
              <div className="max-w-2xl text-center lg:text-left">
                <p className="type-eyebrow">Newsletter</p>
                <h2 className="type-section-title mt-3">Receive Professional Updates</h2>
                <p className="type-body mt-3 max-w-xl">
                  I share occasional updates about projects, technical work, and professional availability.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <form onSubmit={handleNewsletterSubmit} className="w-full max-w-sm text-center">
                <label htmlFor="newsletter-email" className="type-label block">Email address</label>
                <input
                  id="newsletter-email"
                  name="newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  disabled={isNewsletterSubmitting}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value)
                    if (newsletterMessage) setNewsletterMessage('')
                  }}
                  placeholder="you@example.com"
                  className="mt-3 block w-full rounded-md border border-white/10 bg-background/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-accent/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isNewsletterSubmitting}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-accent bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {isNewsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
                <p className="type-label mt-3 min-h-9 text-gray-400">
                  {newsletterMessage || 'Enter your email to receive occasional updates.'}
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Professional Availability */}
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16 lg:px-6">
        <div className="rounded-3xl border border-dashed border-white/15 bg-background/30 px-5 py-6 sm:px-6 sm:py-6">
          <div className="grid items-center gap-5 lg:grid-cols-4">
            <div className="col-span-3 max-w-2xl">
              <p className="type-eyebrow">Professional Availability</p>
              <h2 className="type-section-title mt-3 max-w-xl text-balance">Interested in discussing an opportunity?</h2>
              <p className="type-body mt-3 max-w-xl">
                I am available to discuss software engineering roles, freelance projects, and collaborative product work.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href="/about"
                  onClick={(e) => handleNavigate(e, '/about')}
                  className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_0_22px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Contact Me
                </a>
                <a
                  href="/HillolBarman_Resume.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white"
                >
                  Download CV <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-surface sm:h-32 sm:w-32">
                <img src={coffeeCup} alt="Coffee cup illustration" className="block h-20 w-20 object-contain sm:h-24 sm:w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  )
}
