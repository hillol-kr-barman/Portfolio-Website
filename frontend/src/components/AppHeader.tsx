import { SiteHeader } from '@hillolbarman/ui'
import type { AuthUser } from '@hillolbarman/ui'
import logo from '../assets/logo_green.svg'
import { navigation } from '../pages/pageData/homePageData'

interface AppHeaderProps {
  currentPath?: string
  currentUser?: AuthUser | null
  onNavigate: (to: string) => void
  onLogout?: () => void
}

export default function AppHeader({ currentPath, currentUser, onNavigate, onLogout }: AppHeaderProps) {
  return (
    <SiteHeader
      logo={<img src={logo} alt="Hillol Barman" className="h-8 w-auto" />}
      siteName=""
      navItems={navigation}
      currentPath={currentPath}
      currentUser={currentUser}
      onNavigate={onNavigate}
      onLogout={onLogout}
      containerClassName="px-4 sm:px-6 lg:mx-16 lg:px-6"
    />
  )
}
