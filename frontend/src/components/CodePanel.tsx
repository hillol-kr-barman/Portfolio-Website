import type { ReactNode } from 'react'

interface CodePanelProps {
  filename: string
  children: ReactNode
  className?: string
}

/**
 * A floating code panel — the one element in the system that carries a shadow.
 * Used for the home hero's `stack.ts` and the log-in page's `session.ts`.
 */
export default function CodePanel({ filename, children, className = '' }: CodePanelProps) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] border border-white/[0.08] bg-panel shadow-panel ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-hair px-3.5 py-[11px]">
        <span className="size-[9px] rounded-full bg-white/[0.14]" />
        <span className="size-[9px] rounded-full bg-white/[0.14]" />
        <span className="size-[9px] rounded-full bg-white/[0.14]" />
        <span className="ml-2 font-mono text-[11.5px] text-code-comment">{filename}</span>
      </div>
      <pre className="m-0 overflow-x-auto p-[22px] font-mono text-[13px] leading-[1.95] text-dim">
        {children}
      </pre>
    </div>
  )
}

/** A string literal inside a code panel — one of the accent's licensed uses. */
export const Str = ({ children }: { children: ReactNode }) => (
  <span className="text-accent">{children}</span>
)

/** A keyword inside a code panel. */
export const Kw = ({ children }: { children: ReactNode }) => (
  <span className="text-code-kw">{children}</span>
)

/** A comment inside a code panel. */
export const Cm = ({ children }: { children: ReactNode }) => (
  <span className="text-code-comment">{children}</span>
)
