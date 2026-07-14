import type { Project } from '@hillolbarman/ui'

interface ProjectCardProps {
  project: Project
  variant?: 'featured' | 'list'
}

export default function ProjectCard({ project, variant = 'featured' }: ProjectCardProps) {
  if (variant === 'list') {
    return (
      <article className="grid h-full grid-cols-1 gap-3 rounded-2xl bg-surface p-4 outline -outline-offset-1 outline-white/10 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-3">
          <h2 className="type-card-title text-left">{project.title}</h2>
          <p className="type-body mt-2 text-left">{project.content}</p>
          <p className="type-body mt-2 text-left">
            <span className="font-bold">Stack: </span>
            <span className="italic">{project.projectTechstack}</span>
          </p>

          <div className="mt-4 border-t border-white/10" />
          <a
            href={project.gitLink}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
          >
            <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub icon" className="h-5 w-5" />
            View Repository
          </a>
          <div className="mt-2 border-t border-white/10" />
        </div>

        <div className="hidden lg:block" />

        <div className="flex items-center lg:col-span-1">
          <img
            src={project.imageSrc}
            alt={`${project.title} thumbnail`}
            className="h-36 w-full rounded-xl bg-black/20 p-10 object-contain"
          />
        </div>
      </article>
    )
  }

  return (
    <article className="flex h-full flex-col rounded-2xl bg-surface p-4 outline -outline-offset-1 outline-white/10">
      <h4 className="type-card-title text-center">{project.title}</h4>
      <p className="type-body mt-2 text-center">{project.content}</p>
      <img
        src={project.imageSrc}
        alt={`${project.title} thumbnail`}
        className="mt-4 h-36 w-full rounded-xl bg-black/20 p-10 object-contain"
      />
      <a
        href={project.gitLink}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
      >
        <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub icon" className="h-5 w-5" />
        View Repository
      </a>
    </article>
  )
}
