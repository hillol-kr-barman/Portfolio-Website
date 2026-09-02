import type { NavItem, SocialItem, Project } from '@hillolbarman/ui'
import { GitHubIcon, LinkedInIcon } from '../../components/Icons'

/**
 * The redesign lists technologies as individual chips on /projects and as a
 * single comma-joined mono line on the home page, and puts a status pill beside
 * each project title. `projectTechstack` stays for compatibility with the
 * @hillolbarman/ui Project type; `techTags` is the split form.
 */
export interface PortfolioProject extends Project {
  status: 'Live' | 'Beta'
  techTags: string[]
}

export const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Playground', href: '/playground' },
  { name: 'About Me', href: '/about' },
]

export const techStackLogos = [
  { name: 'TypeScript', src: 'https://cdn.simpleicons.org/typescript/ffffff' },
  { name: 'Python', src: 'https://cdn.simpleicons.org/python/ffffff' },
  { name: 'Tailwind CSS', src: 'https://cdn.simpleicons.org/tailwindcss/ffffff' },
  { name: 'React', src: 'https://cdn.simpleicons.org/react/ffffff' },
  { name: 'Vite', src: 'https://cdn.simpleicons.org/vite/ffffff' },
  { name: 'FastAPI', src: 'https://cdn.simpleicons.org/fastapi/ffffff' },
  { name: 'Supabase', src: 'https://cdn.simpleicons.org/supabase/ffffff' },
]

export const projects: PortfolioProject[] = [
  {
    id: 1,
    title: 'Git Visualiser',
    content:
      'A standalone web app for exploring GitHub repository activity through a readable workflow graph. The app supports GitHub sign-in, repository selection, recent commit details, branch labels, manual refresh, opt-in auto-refresh, and read-only GitHub API access through a backend service.',
    projectTechstack: 'React, Vite, TypeScript, React Flow, FastAPI, Supabase, GitHub REST API',
    techTags: ['React', 'Vite', 'TypeScript', 'React Flow', 'FastAPI', 'Supabase', 'GitHub REST API'],
    status: 'Live',
    imageSrc: 'https://cdn.simpleicons.org/github/ffffff',
    gitLink: 'https://github.com/hillol-kr-barman/Github-Visualiser',
  },
  {
    id: 2,
    title: 'Grounded (Beta)',
    content:
      'An AI-powered knowledge base application that lets users create custom knowledge bases, upload documents (PDF and DOCX), and interact with their content through a conversational chat interface backed by large language models.',
    projectTechstack: 'React, Vite, TypeScript, FastAPI, Supabase, OpenAI, Claude (Anthropic)',
    techTags: ['React', 'Vite', 'TypeScript', 'FastAPI', 'Supabase', 'OpenAI', 'Claude (Anthropic)'],
    status: 'Beta',
    imageSrc: 'https://cdn.simpleicons.org/anthropic/ffffff',
    gitLink: 'https://github.com/hillol-kr-barman/Grounded',
  },
]

export const featuredProjectIds = [1, 2]

/** Drives the `stack.ts` code panel in the home hero. */
export const stackPanel: { key: string; values: string[] }[] = [
  { key: 'api', values: ['FastAPI', 'Python'] },
  { key: 'data', values: ['Supabase', 'Postgres'] },
  { key: 'client', values: ['React', 'TypeScript', 'Vite'] },
  { key: 'styling', values: ['Tailwind'] },
  { key: 'payments', values: ['Stripe'] },
]

export const socials: SocialItem[] = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/hillolbarman/',
    icon: LinkedInIcon,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/hillol-kr-barman',
    icon: GitHubIcon,
  },
]
