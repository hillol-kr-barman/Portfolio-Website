import LogoMark from './LogoMark'

interface WordmarkProps {
  onNavigate: (to: string) => void
}

export default function Wordmark({ onNavigate }: WordmarkProps) {
  return (
    <a
      href="/"
      onClick={(e) => { e.preventDefault(); onNavigate('/') }}
      className="flex items-center gap-2.5"
    >
      <LogoMark className="h-6 w-auto text-accent" />
      <span className="font-mono text-[14px] font-semibold tracking-[-0.01em] text-bright">
        hillol<span className="text-accent">.</span>dev
      </span>
    </a>
  )
}
