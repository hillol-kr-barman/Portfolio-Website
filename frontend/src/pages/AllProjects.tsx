import type { AuthUser } from '@hillolbarman/ui'
import PageShell from '../components/PageShell'
import SectionRule from '../components/SectionRule'
import { projects } from './pageData/homePageData'

interface AllProjectsProps {
  onNavigate: (to: string) => void
  currentUser?: AuthUser | null
  onLogout?: () => void
  currentPath?: string
}

export default function AllProjects({
  onNavigate,
  currentUser,
  onLogout,
  currentPath = '/projects',
}: AllProjectsProps) {
  return (
    <PageShell
      onNavigate={onNavigate}
      currentPath={currentPath}
      currentUser={currentUser}
      onLogout={onLogout}
    >
      <div className="border-b border-hair px-5 pb-12 pt-14 sm:px-10 lg:pt-[72px]">
        <p className="eyebrow">Index</p>
        <h1 className="mt-4.5 text-[clamp(2.25rem,6vw,56px)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
          All Projects
        </h1>
        <p className="mt-4.5 max-w-[56ch] text-[clamp(16px,2vw,17.5px)] leading-[1.7] text-body text-pretty">
          These are the projects I am currently developing and improving.
        </p>
      </div>

      <SectionRule index="01" label="Active Work" last className="pt-11">
        <div className="flex flex-col">
          {projects.map((project, i) => (
            <a
              key={project.id}
              href={project.gitLink}
              target="_blank"
              rel="noreferrer"
              className={`row-hover grid items-start gap-4 border-t border-hair py-6 sm:grid-cols-[auto_1fr_auto] sm:gap-6 ${
                i === projects.length - 1 ? 'border-b' : ''
              }`}
            >
              <span className="hidden pt-[5px] font-mono text-[12px] text-ghost sm:block">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="m-0 text-[clamp(20px,3vw,24px)] font-semibold tracking-[-0.03em] text-strong">
                    {project.title}
                  </h2>
                  {project.status === 'Live' ? (
                    <span className="inline-flex items-center gap-[7px] rounded-full border border-accent/25 px-2.5 py-[3px] font-mono text-[11px] text-accent">
                      <span className="size-[5px] rounded-full bg-accent" />
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full border border-edge px-2.5 py-[3px] font-mono text-[11px] text-body">
                      Beta
                    </span>
                  )}
                </div>

                <p className="mt-3 max-w-[74ch] text-[15px] leading-[1.7] text-dim text-pretty">
                  {project.content}
                </p>

                <div className="mt-4 flex flex-wrap gap-[7px]">
                  {project.techTags.map((tag) => (
                    <span key={tag} className="chip">{tag}</span>
                  ))}
                </div>
              </div>

              <span className="whitespace-nowrap pt-1 text-[13px] font-semibold text-btn2">
                Repository <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </SectionRule>
    </PageShell>
  )
}
