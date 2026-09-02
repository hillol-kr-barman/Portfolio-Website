import type { ReactNode } from 'react'
import AppHeader from './AppHeader'

interface AuthShellProps {
  onNavigate: (to: string) => void
  eyebrow: string
  title: string
  lead: string
  /** The form column. Capped at 400px per the design. */
  children: ReactNode
  /** The right half of the split — a code panel or a numbered list. */
  aside?: ReactNode
}

/**
 * The `1fr 1fr` auth frame with a vertical rule down the middle. Below `lg` the
 * rule becomes a horizontal one and the aside stacks beneath the form.
 */
export default function AuthShell({
  onNavigate,
  eyebrow,
  title,
  lead,
  children,
  aside,
}: AuthShellProps) {
  return (
    <div className="canvas-grid min-h-screen">
      <AppHeader onNavigate={onNavigate} currentPath="" />

      <main className="grid items-stretch lg:grid-cols-2">
        <div className="border-b border-hair px-5 pb-16 pt-14 sm:px-14 lg:border-b-0 lg:border-r lg:pb-[88px] lg:pt-20">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,40px)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink">
            {title}
          </h1>
          <p className="mt-3.5 max-w-[44ch] text-[15.5px] leading-[1.7] text-body text-pretty">
            {lead}
          </p>
          <div className="mt-8 max-w-[400px]">{children}</div>
        </div>

        {aside ? (
          <div className="flex items-center px-5 py-14 sm:px-12 lg:py-20">
            <div className="w-full">{aside}</div>
          </div>
        ) : null}
      </main>
    </div>
  )
}

/** Shared label + field pairing for the auth forms. */
export function Field({
  id,
  label,
  trailing,
  required = false,
  children,
}: {
  id: string
  label: string
  trailing?: ReactNode
  /** Marks the label with an accent asterisk. The input keeps its own
      `required` attribute — this is the visual half of the same fact. */
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="font-mono text-[11.5px] font-medium uppercase tracking-[0.1em] text-label"
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-accent">
              *
            </span>
          ) : null}
        </label>
        {trailing}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

/** The `or` rule between the primary submit and the GitHub button. */
export function OrRule() {
  return (
    <div className="my-1 flex items-center gap-3.5">
      <span className="h-px flex-1 bg-white/[0.08]" />
      <span className="font-mono text-[11px] text-faint">or</span>
      <span className="h-px flex-1 bg-white/[0.08]" />
    </div>
  )
}

/** Error styling was not designed; this reuses the palette's dusty red. */
export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-[9px] border border-danger/40 bg-danger/[0.08] px-3.5 py-2.5 text-[13px] leading-[1.6] text-[#e2a5a1]"
    >
      {message}
    </p>
  )
}

/** Success / instruction note in the same slot as FormError. */
export function FormNote({ message }: { message: string }) {
  return (
    <p className="rounded-[9px] border border-accent/25 bg-accent/[0.05] px-3.5 py-2.5 text-[13px] leading-[1.6] text-strong">
      {message}
    </p>
  )
}
