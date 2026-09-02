import type { SVGProps } from 'react'

/**
 * Shared line icons. Stroke icons inherit currentColor at 2px; brand glyphs are
 * filled. Every icon takes a className so callers set the size — `size-4` for
 * buttons, `size-[15px]` for chips.
 */
type IconProps = SVGProps<SVGSVGElement>

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const base = (className: string, rest: IconProps) => ({
  viewBox: '0 0 24 24',
  'aria-hidden': true as const,
  ...rest,
  className: `shrink-0 ${className}`,
})

export const MailIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} {...stroke}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

export const DownloadIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} {...stroke}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export const FileIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} {...stroke}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

/** Arrow into a tray — the save action. */
export const SaveIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} {...stroke}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M12 15V3" />
    <path d="m8 7 4-4 4 4" />
  </svg>
)

/** Three linked nodes — the share action. */
export const ShareIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} {...stroke}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </svg>
)

export const CheckIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} {...stroke}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const ArrowRightIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} {...stroke}>
    <line x1="4" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
)

/** Coffee cup — the support action, matching the /coffee route. */
export const CoffeeIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} {...stroke}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
    <line x1="6" y1="2" x2="6" y2="5" />
    <line x1="10" y1="2" x2="10" y2="5" />
    <line x1="14" y1="2" x2="14" y2="5" />
  </svg>
)

export const GitHubIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
)

export const LinkedInIcon = ({ className = 'size-4', ...rest }: IconProps) => (
  <svg {...base(className, rest)} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.85-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.354V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.371 4.267 5.455v6.286h-.007ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.558V9h3.556v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
)
