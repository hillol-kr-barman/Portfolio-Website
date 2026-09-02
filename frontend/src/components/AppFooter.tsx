import LogoMark from './LogoMark'
import { navigation, socials } from '../pages/pageData/homePageData'

interface AppFooterProps {
  onNavigate?: (to: string) => void
}

export default function AppFooter({ onNavigate }: AppFooterProps) {
  const year = new Date().getFullYear()

  const go = (e: React.MouseEvent, to: string) => {
    if (!onNavigate) return
    e.preventDefault()
    onNavigate(to)
  }

  return (
    <footer className="border-t border-hair px-5 py-8 sm:px-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-[18px] w-auto text-label" />
          <span className="font-mono text-[11.5px] text-label">
            © {year} Hillol Barman
          </span>
        </div>

        {/* Nav and socials read as one right-hand group, at the same size as
            the copyright line. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="font-mono text-[11.5px] text-label transition-colors duration-150 ease-out hover:text-bright"
              >
                {item.name}
              </a>
            ))}
            <a
              href="/coffee"
              onClick={(e) => go(e, '/coffee')}
              className="font-mono text-[11.5px] text-label transition-colors duration-150 ease-out hover:text-bright"
            >
              Support
            </a>
          </nav>

          <span className="hidden h-3.5 w-px bg-hair sm:block" aria-hidden="true" />

          <div className="flex items-center gap-4">
            {socials.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-label transition-colors duration-150 ease-out hover:text-bright"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
