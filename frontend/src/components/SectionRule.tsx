import type { ReactNode } from 'react'

interface SectionRuleProps {
  /** Numeral half of the eyebrow, e.g. "01". */
  index: string
  /** Words half of the eyebrow. Multi-word labels break after the first word. */
  label: string
  children: ReactNode
  /** Section blocks carry a bottom hairline; the last one on a page does not. */
  last?: boolean
  className?: string
}

/**
 * The signature of this design: a 200px mono-eyebrow column beside the content,
 * blocks separated by hairline rules. The eyebrow reads `01 — Primary` /
 * `Technologies` on two lines and gets 6px of top padding to optically align
 * with the body text beside it.
 *
 * Below `lg` the grid collapses to one column with the eyebrow stacked above.
 */
export default function SectionRule({
  index,
  label,
  children,
  last = false,
  className = '',
}: SectionRuleProps) {
  const [head, ...rest] = label.split(' ')
  const tail = rest.join(' ')

  return (
    <section
      className={`grid gap-6 px-5 py-10 sm:px-10 lg:grid-cols-[200px_1fr] lg:gap-10 lg:py-12 ${
        last ? '' : 'border-b border-hair'
      } ${className}`}
    >
      <h2 className="eyebrow m-0 lg:pt-1.5">
        {index} — {head}
        {tail ? (
          <>
            <br className="hidden lg:block" />
            <span className="lg:sr-only"> </span>
            {tail}
          </>
        ) : null}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}
