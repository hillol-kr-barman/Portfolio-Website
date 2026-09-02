/**
 * The site mark, driven from currentColor so it picks up the accent token
 * rather than shipping recoloured copies of the SVG.
 */
export default function LogoMark({ className = 'h-6 w-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="140 95 400 420"
      role="img"
      aria-label="Hillol Barman"
      className={className}
      fill="currentColor"
    >
      <path d="m 288,105 -138,173 98,85 78,-95 h 84 L 227.86837,502.39488 392,503 529,331 434,242 348,241 444,106 Z" />
    </svg>
  )
}
