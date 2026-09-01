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
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-[18px] w-auto text-label" />
          <span className="font-mono text-[11.5px] text-label">
            © {year} Hillol Barman
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className="text-[13px] font-[450] text-muted transition-colors duration-150 ease-out hover:text-bright"
            >
              {item.name}
            </a>
          ))}
          <a
            href="/coffee"
            onClick={(e) => go(e, '/coffee')}
            className="text-[13px] font-[450] text-muted transition-colors duration-150 ease-out hover:text-bright"
          >
            Support
          </a>
        </nav>

        <div className="flex items-center gap-5">
          {socials.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors duration-150 ease-out hover:text-bright"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-[17px]" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
