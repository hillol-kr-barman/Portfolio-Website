import LogoMark from './LogoMark'

interface WordmarkProps {
  onNavigate: (to: string) => void
  /** The playground app frame runs a slightly smaller mark. */
  compact?: boolean
}

export default function Wordmark({ onNavigate, compact = false }: WordmarkProps) {
  return (
    <a
      href="/"
      onClick={(e) => { e.preventDefault(); onNavigate('/') }}
      className="flex items-center gap-2.5"
    >
      <LogoMark className={`${compact ? 'h-[22px]' : 'h-6'} w-auto text-accent`} />
      <span
        className={`font-mono font-semibold tracking-[-0.01em] text-bright ${
          compact ? 'text-[13.5px]' : 'text-[14px]'
        }`}
      >
        hillol<span className="text-accent">.</span>dev
      </span>
    </a>
  )
}
