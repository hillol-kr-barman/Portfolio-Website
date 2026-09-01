import { useState } from 'react'
import type { AuthUser } from '@hillolbarman/ui'
import PageShell from '../components/PageShell'
import SectionRule from '../components/SectionRule'
import CodePanel, { Cm, Kw, Str } from '../components/CodePanel'
import { projects, featuredProjectIds, stackPanel, techStackLogos } from './pageData/homePageData'

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
    <PageShell
      onNavigate={onNavigate}
      currentPath={currentPath}
      currentUser={currentUser}
      onLogout={onLogout}
    >
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="grid items-center gap-12 px-5 pb-16 pt-14 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24 lg:pt-[88px]">
        <div>
          <div className="inline-flex items-center gap-[9px] rounded-full border border-input py-[5px] pl-2.5 pr-[13px] font-mono text-[12px] text-[#98a3ac]">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(52,211,153,.16)]" />
            Available for opportunities
          </div>

          <h1 className="mt-6 text-[clamp(2.5rem,7vw,68px)] font-semibold leading-[1.04] tracking-[-0.045em] text-ink">
            Think. Plan.<br />Build. Ship.
          </h1>

          <p className="mt-6 max-w-[52ch] text-[clamp(16px,2.2vw,18px)] leading-[1.7] text-body text-pretty">
            I design and develop responsive web products with a focus on maintainable code, clear user
            journeys, and dependable full-stack implementation.
          </p>

          <div className="mt-[34px] flex flex-wrap gap-3">
            <a href="/projects" onClick={(e) => handleNavigate(e, '/projects')} className="btn-primary">
              View Projects <span aria-hidden="true">→</span>
            </a>
            <a href="/HillolBarman_Resume.pdf" download className="btn-secondary">
              Download CV
            </a>
          </div>

          <p className="eyebrow mt-10">Backend Focused Full Stack Software Engineer</p>
        </div>

        <CodePanel filename="stack.ts">
          <Cm>// what I reach for</Cm>{'\n'}
          <Kw>export const</Kw>{' stack = {\n'}
          {stackPanel.map(({ key, values }) => (
            <span key={key}>
              {`  ${(key + ':').padEnd(10)}[`}
              {values.map((value, i) => (
                <span key={value}>
                  <Str>{`'${value}'`}</Str>
                  {i < values.length - 1 ? ', ' : ''}
                </span>
              ))}
              {'],\n'}
            </span>
          ))}
          {'}'}
        </CodePanel>
      </div>

      {/* ── 01 — Primary Technologies ─────────────────────────────────────── */}
      <SectionRule index="01" label="Primary Technologies" className="border-t border-hair">
        <p className="m-0 max-w-[74ch] text-[17px] leading-[1.7] text-body text-pretty">
          These are the technologies I use to build performant interfaces, reliable APIs, and
          maintainable product foundations. I choose tools based on product requirements,
          scalability, and long-term maintainability.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {techStackLogos.map((logo) => (
            <div
              key={logo.name}
              title={logo.name}
              className="row-hover flex size-[52px] items-center justify-center rounded-xl border border-hair"
            >
              <img
                src={logo.src}
                alt={logo.name}
                width={24}
                height={24}
                loading="lazy"
                className="size-6 object-contain opacity-60"
              />
            </div>
          ))}
        </div>
      </SectionRule>

      {/* ── 02 — Featured Projects ────────────────────────────────────────── */}
      <SectionRule index="02" label="Featured Projects">
        <div className="flex flex-col">
          {featuredProjects.map((project) => (
            <a
              key={project.id}
              href={project.gitLink}
              target="_blank"
              rel="noreferrer"
              className="row-hover grid gap-4 border-b border-hair py-6 sm:grid-cols-[1fr_auto] sm:gap-8"
            >
              <div>
                <h3 className="m-0 text-[22px] font-semibold tracking-[-0.025em] text-strong">
                  {project.title}
                </h3>
                <p className="mt-2.5 max-w-[70ch] text-[15px] leading-[1.7] text-dim text-pretty">
                  {project.content}
                </p>
                <p className="mt-3 font-mono text-[12px] leading-[1.6] text-code-comment">
                  {project.projectTechstack}
                </p>
              </div>
              <span className="whitespace-nowrap text-[13px] font-semibold text-btn2">
                Repository <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </SectionRule>

      {/* ── 03 — Newsletter ───────────────────────────────────────────────── */}
      <SectionRule index="03" label="Newsletter">
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,340px)] lg:gap-14">
          <div>
            <h3 className="m-0 text-[22px] font-semibold tracking-[-0.025em] text-strong">
              Receive Professional Updates
            </h3>
            <p className="mt-2.5 max-w-[60ch] text-[15px] leading-[1.7] text-dim text-pretty">
              I share occasional updates about projects, technical work, and professional
              availability.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full">
            <label htmlFor="newsletter-email" className="eyebrow block">
              Email address
            </label>
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
              className="field mt-2.5"
            />
            <button type="submit" disabled={isNewsletterSubmitting} className="btn-primary mt-2.5 w-full">
              {isNewsletterSubmitting ? 'Subscribing…' : 'Subscribe'}
            </button>
            <p className="mt-3 min-h-8 font-mono text-[11.5px] leading-[1.6] text-faint">
              {newsletterMessage || 'Enter your email to receive occasional updates.'}
            </p>
          </form>
        </div>
      </SectionRule>

      {/* ── 04 — Availability ─────────────────────────────────────────────── */}
      <SectionRule index="04" label="Availability" last>
        <h3 className="m-0 max-w-[24ch] text-[22px] font-semibold tracking-[-0.025em] text-strong">
          Interested in discussing an opportunity?
        </h3>
        <p className="mt-2.5 max-w-[70ch] text-[15px] leading-[1.7] text-dim text-pretty">
          I am available to discuss software engineering roles, freelance projects, and
          collaborative product work.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/about" onClick={(e) => handleNavigate(e, '/about')} className="btn-primary">
            Contact Me
          </a>
          <a href="/coffee" onClick={(e) => handleNavigate(e, '/coffee')} className="btn-secondary">
            Support My Work
          </a>
        </div>
      </SectionRule>
    </PageShell>
  )
}
