import type { AuthUser } from '@hillolbarman/ui'
import about400Webp from '../assets/about-400.webp'
import about800Webp from '../assets/about-800.webp'
import about1200Webp from '../assets/about-1200.webp'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

const skills = [
  { name: 'TypeScript', dot: '#3178c6' },
  { name: 'JavaScript', dot: '#f7df1e' },
  { name: 'Python', dot: '#3776ab' },
  { name: 'SQL', dot: '#a0a0a0' },
  { name: 'React 19', dot: '#61dafb' },
  { name: 'Next.js', dot: '#ffffff' },
  { name: 'Tailwind CSS', dot: '#06b6d4' },
  { name: 'FastAPI', dot: '#009688' },
  { name: 'Flask', dot: '#9aa3b0' },
  { name: 'Node.js', dot: '#68a063' },
  { name: 'REST APIs', dot: '#9eff1f' },
  { name: 'PostgreSQL', dot: '#336791' },
  { name: 'MySQL', dot: '#4479a1' },
  { name: 'Supabase', dot: '#3ecf8e' },
  { name: 'Docker', dot: '#2496ed' },
  { name: 'AWS', dot: '#ff9900' },
  { name: 'Git / GitHub', dot: '#e8274b' },
  { name: 'pytest', dot: '#009fe3' },
  { name: 'Figma', dot: '#f24e1e' },
  { name: 'Stripe', dot: '#635bff' },
  { name: 'Monaco Editor', dot: '#0078d4' },
]

const employment = [
  {
    company: 'NPG Urbanista Convenience Store',
    role: 'Console Operator',
    location: 'Albion Park, NSW',
    duration: 'Mar 2025 – Present',
    highlights: [
      'Managed fuel console operations, customer transactions, and end-of-day reconciliation.',
      'Provided customer service and resolved on-site issues in a fast-paced retail environment.',
      'Maintained compliance with fuel safety and store operational procedures.',
    ],
  },
  {
    company: 'Drivers4Me',
    role: 'Freelance UI Designer and Developer',
    location: 'Kolkata, India',
    duration: 'Dec 2020 – Feb 2023',
    highlights: [
      'Developed and maintained RESTful APIs using Flask to support frontend application features.',
      'Built reusable UI components and full pages using React and Next.js for web and mobile-responsive platforms.',
      'Collaborated directly with stakeholders to gather requirements and translate them into working software deliverables.',
      'Designed wireframes, mockups, and graphical assets using Figma and Adobe Illustrator for Android, iOS, and web.',
      'Contributed across the full software development lifecycle — from planning and design through to implementation and delivery.',
    ],
  },
]

const education = [
  {
    institution: 'University of Wollongong, NSW',
    degree: 'MSc in Computer Science (Software Engineering)',
    duration: 'Jul 2023 – Jun 2025',
    notes: 'Graduated with Distinction — 5 High Distinctions and 6 Distinctions. Lead developer in capstone project.',
  },
  {
    institution: 'Institute of Engineering and Management (IEM), Kolkata',
    degree: 'BSc in Computer Science and Engineering',
    duration: 'Jun 2016 – Jul 2020',
    notes: 'GPA: 3.50 / 4.0',
  },
]

const achievements = [
  'Microsoft Technology Associate in Java',
  'Graduated with Distinction from the Master of Computer Science program at the University of Wollongong',
  'Served as Technical Head for technology events during Bachelor studies',
  'Regional Math Olympiad Champion',
]

const timeline = [
  { period: '2006', event: 'Regional Math Olympiad Champion' },
  { period: 'Jun 2016 – Jul 2020', event: 'BSc in Computer Science and Engineering at IEM, Kolkata' },
  { period: 'Dec 2020 – Feb 2023', event: 'Freelance UI Designer and Developer at Drivers4Me' },
  { period: 'Jul 2023 – Jun 2025', event: 'MSc in Computer Science (Software Engineering), UOW — Distinction' },
  { period: 'Mar 2025 – Present', event: 'Console Operator at NPG Urbanista Convenience Store, Albion Park NSW' },
]

interface AboutMeProps {
  onNavigate: (to: string) => void
  currentUser?: AuthUser | null
  onLogout?: () => void
  currentPath?: string
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-subtle">
    {children}
  </p>
)

const Divider = () => (
  <hr className="my-10 h-px border-0 bg-border" />
)

export default function AboutMe({ onNavigate, currentUser, onLogout, currentPath = '/about' }: AboutMeProps) {
  return (
    <div>
      <AppHeader onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} currentPath={currentPath} />

      <main className="mx-auto w-full max-w-[800px] px-4 pb-24 pt-24 sm:px-8 sm:pt-28">

        {/* Page header */}
        <div className="mb-10">
          <p className="mb-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-accent">
            About the developer
          </p>
          <h1 className="mb-3 text-[clamp(1.9rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Hillol Barman
          </h1>
          <p className="text-[1rem] text-muted">
            Building reliable software with clean architecture, thoughtful interfaces, and a steady focus on quality.
          </p>
        </div>

        {/* Profile */}
        <section className="mb-10 grid grid-cols-1 items-start gap-6 sm:grid-cols-[120px_1fr] sm:gap-8">
          <div className="relative flex size-[120px] items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: '1.5px dashed color-mix(in srgb, var(--color-accent) 30%, transparent)', animation: 'spin 20s linear infinite' }}
            />
            <div className="size-[102px] overflow-hidden rounded-full border-2 border-border bg-surface shrink-0">
              <img
                src={about800Webp}
                srcSet={`${about400Webp} 400w, ${about800Webp} 800w, ${about1200Webp} 1200w`}
                sizes="102px"
                width="102"
                height="102"
                alt="Portrait of Hillol"
                loading="eager"
                decoding="async"
                className="size-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-1 text-[1.4rem] font-bold tracking-[-0.02em]">Hillol Barman</h2>
            <p className="mb-4 font-mono text-[0.88rem] text-accent">
              @hillol-kr-barman · Software Engineer
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="mailto:hillolbarman@yahoo.com"
                className="flex items-center gap-1.5 rounded-[5px] border border-border bg-surface px-2.5 py-1 text-[0.78rem] text-subtle transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email
              </a>
              <a
                href="https://github.com/hillol-kr-barman"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-[5px] border border-border bg-surface px-2.5 py-1 text-[0.78rem] text-subtle transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/hillolbarman/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-[5px] border border-border bg-surface px-2.5 py-1 text-[0.78rem] text-subtle transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.85-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.354V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.371 4.267 5.455v6.286h-.007ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.558V9h3.556v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg>
                LinkedIn
              </a>
              <a
                href="/HillolBarman_Resume.pdf"
                download
                className="flex items-center gap-1.5 rounded-[5px] border border-border bg-surface px-2.5 py-1 text-[0.78rem] text-subtle transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                Resume PDF
              </a>
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="mb-10">
          <SectionLabel>Bio</SectionLabel>
          <p className="m-0 text-[0.95rem] leading-[1.8] text-muted">
            I'm <strong className="font-semibold text-text">Hillol Barman</strong>, a software engineer
            with a Master of Computer Science in Software Engineering from the{' '}
            <strong className="font-semibold text-text">University of Wollongong</strong> and hands-on
            experience building web applications across frontend, backend, and product design.
            My work focuses on <strong className="font-semibold text-text">responsive interfaces</strong>,{' '}
            <strong className="font-semibold text-text">reusable components</strong>, and{' '}
            <strong className="font-semibold text-text">clean API design</strong> — turning product
            requirements into software that is clear for users and practical for teams to extend.
            I'm currently seeking opportunities where I can contribute strong engineering fundamentals
            and a steady focus on quality delivery.
          </p>
        </section>

        <Divider />

        {/* Technologies */}
        <section className="mb-10">
          <SectionLabel>Technologies</SectionLabel>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="group flex cursor-default items-center gap-1.5 rounded-[5px] border border-border bg-surface px-3 py-2 transition-colors hover:border-white/15 hover:text-text"
              >
                <span className="size-[6px] shrink-0 rounded-full" style={{ backgroundColor: skill.dot }} />
                <span className="font-mono text-[0.75rem] text-muted transition-colors group-hover:text-text">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Work */}
        <section className="mb-10">
          <SectionLabel>Work</SectionLabel>
          <div className="space-y-6">
            {employment.map((job) => (
              <article key={job.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-[0.95rem] font-semibold text-text">{job.role}</h2>
                  <span className="font-mono text-[0.75rem] text-subtle">{job.duration}</span>
                </div>
                <p className="mt-0.5 font-mono text-[0.8rem] text-accent">
                  {job.company} · {job.location}
                </p>
                <ul className="mt-3 space-y-1.5 pl-5 text-[0.88rem] leading-[1.7] text-muted" style={{ listStyleType: 'disc' }}>
                  {job.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        {/* Education */}
        <section className="mb-10">
          <SectionLabel>Education</SectionLabel>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {education.map((item) => (
              <article
                key={item.institution}
                className="rounded-lg border border-border bg-surface p-4 hover:border-white/15 transition-colors"
              >
                <h2 className="text-[0.88rem] font-semibold leading-[1.4] text-text">{item.degree}</h2>
                <p className="mt-1 font-mono text-[0.78rem] text-accent">{item.institution}</p>
                <p className="mt-2 font-mono text-[0.75rem] text-subtle">{item.duration}</p>
                <p className="mt-1.5 text-[0.82rem] text-muted">{item.notes}</p>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        {/* Achievements */}
        <section className="mb-10">
          <SectionLabel>Achievements</SectionLabel>
          <ul className="space-y-2 pl-5 text-[0.88rem] leading-[1.7] text-muted" style={{ listStyleType: 'disc' }}>
            {achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* Timeline */}
        <section className="mb-10">
          <SectionLabel>Timeline</SectionLabel>
          <div className="space-y-3">
            {timeline.map((item) => (
              <div
                key={item.period}
                className="grid gap-1.5 border-l-2 pl-4 md:grid-cols-[15rem_minmax(0,1fr)]"
                style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 50%, transparent)' }}
              >
                <span className="font-mono text-[0.8rem] font-semibold text-accent">{item.period}</span>
                <span className="text-[0.88rem] leading-[1.6] text-muted">{item.event}</span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Contact */}
        <section>
          <SectionLabel>Contact</SectionLabel>
          <p className="mb-6 text-[0.88rem] leading-[1.7] text-muted">
            Open to new opportunities, collaborations, and interesting projects. Reach out via email
            or connect on LinkedIn — I typically respond within a day or two.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="mailto:hillolbarman@yahoo.com"
              className="flex items-center gap-2 rounded-[5px] bg-accent px-[18px] py-[10px] text-[0.85rem] font-semibold text-black transition-all hover:-translate-y-px hover:opacity-90"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Send email
            </a>
            <a
              href="/HillolBarman_Resume.pdf"
              download
              className="flex items-center gap-2 rounded-[5px] border border-border bg-transparent px-[18px] py-[10px] text-[0.85rem] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download CV
            </a>
            <a
              href="https://github.com/hillol-kr-barman"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-[5px] border border-border bg-transparent px-[18px] py-[10px] text-[0.85rem] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/hillolbarman/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-[5px] border border-border bg-transparent px-[18px] py-[10px] text-[0.85rem] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.85-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.354V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.371 4.267 5.455v6.286h-.007ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.558V9h3.556v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg>
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <AppFooter />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
