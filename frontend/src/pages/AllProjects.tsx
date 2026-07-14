import type { AuthUser } from '@hillolbarman/ui'
import { ProjectCard } from '@hillolbarman/ui'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import { projects } from './pageData/homePageData'

interface AllProjectsProps {
  onNavigate: (to: string) => void
  currentUser?: AuthUser | null
  onLogout?: () => void
  currentPath?: string
}

export default function AllProjects({ onNavigate, currentUser, onLogout, currentPath = '/projects' }: AllProjectsProps) {
  return (
    <div>
      <AppHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 lg:px-6">
        <h1 className="type-page-title text-center">All Projects</h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm/7 text-muted">
          These are the projects I am currently developing and improving.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="list" />
          ))}
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
