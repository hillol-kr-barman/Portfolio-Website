import type { AuthUser } from '@hillolbarman/ui'
import about400Webp from '../assets/about-400.webp'
import about800Webp from '../assets/about-800.webp'
import about1200Webp from '../assets/about-1200.webp'
import PageShell from '../components/PageShell'
import SectionRule from '../components/SectionRule'

const skills = [
  'TypeScript', 'JavaScript', 'Python', 'SQL',
  'React 19', 'Next.js', 'Tailwind CSS', 'FastAPI',
  'Flask', 'Node.js', 'REST APIs', 'PostgreSQL',
  'MySQL', 'Supabase', 'Docker', 'AWS',
  'Git / GitHub', 'pytest', 'Figma', 'Stripe',
  'Monaco Editor',
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

/** `current: true` takes the accent date; every other row stays neutral. */
const timeline = [
  { period: '2006', event: 'Regional Math Olympiad Champion' },
  { period: 'Jun 2016 – Jul 2020', event: 'BSc in Computer Science and Engineering at IEM, Kolkata' },
  { period: 'Dec 2020 – Feb 2023', event: 'Freelance UI Designer and Developer at Drivers4Me' },
  { period: 'Jul 2023 – Jun 2025', event: 'MSc in Computer Science (Software Engineering), UOW — Distinction' },
  { period: 'Mar 2025 – Present', event: 'Console Operator at NPG Urbanista Convenience Store, Albion Park NSW', current: true },
]

/**
 * A 15px stroke/fill icon sits to the left of every contact action so the
 * button reads as a verb, not just a label.
 */
const iconProps = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  className: 'shrink-0',
} as const

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const MailIcon = () => (
  <svg {...iconProps} {...strokeProps}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const DownloadIcon = () => (
  <svg {...iconProps} {...strokeProps}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const GitHubIcon = () => (
  <svg {...iconProps} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg {...iconProps} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.85-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.354V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.371 4.267 5.455v6.286h-.007ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.558V9h3.556v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
)

const FileIcon = () => (
  <svg {...iconProps} {...strokeProps}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const contactLinks = [
  { label: 'Email', href: 'mailto:hillolbarman@yahoo.com', Icon: MailIcon },
  { label: 'GitHub', href: 'https://github.com/hillol-kr-barman', external: true, Icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hillolbarman/', external: true, Icon: LinkedInIcon },
  { label: 'Resume PDF', href: '/HillolBarman_Resume.pdf', download: true, Icon: FileIcon },
]

interface AboutMeProps {
  onNavigate: (to: string) => void
  currentUser?: AuthUser | null
  onLogout?: () => void
  currentPath?: string
}

const Em = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold text-[#dde3e8]">{children}</span>
)

export default function AboutMe({ onNavigate, currentUser, onLogout, currentPath = '/about' }: AboutMeProps) {
  return (
    <PageShell
      onNavigate={onNavigate}
      currentPath={currentPath}
      currentUser={currentUser}
      onLogout={onLogout}
    >
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="grid items-center gap-8 border-b border-hair px-5 pb-12 pt-14 sm:px-10 lg:grid-cols-[1fr_132px] lg:gap-12 lg:pt-[72px]">
        <div>
          <p className="eyebrow">About the developer</p>
          <h1 className="mt-4.5 text-[clamp(2.25rem,6vw,56px)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
            Hillol Barman
          </h1>
          <p className="mt-4.5 max-w-[58ch] text-[clamp(16px,2vw,17.5px)] leading-[1.7] text-body text-pretty">
            Building reliable software with clean architecture, thoughtful interfaces, and a steady
            focus on quality.
          </p>
          <p className="mt-3.5 font-mono text-[13px] text-meta">
            @hillol-kr-barman · Software Engineer
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                {...(link.download ? { download: true } : {})}
                className="row-hover flex items-center gap-2 rounded-[7px] border border-input px-3 py-1.5 font-mono text-[12px] text-[#9aa5ad]"
              >
                <link.Icon />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="size-[132px] shrink-0 overflow-hidden rounded-full border border-input">
          <img
            src={about800Webp}
            srcSet={`${about400Webp} 400w, ${about800Webp} 800w, ${about1200Webp} 1200w`}
            sizes="132px"
            width="132"
            height="132"
            alt="Portrait of Hillol Barman"
            loading="eager"
            decoding="async"
            className="size-full object-cover"
          />
        </div>
      </div>

      {/* ── 01 — Bio ──────────────────────────────────────────────────────── */}
      <SectionRule index="01" label="Bio">
        <p className="m-0 max-w-[76ch] text-[16.5px] leading-[1.85] text-body text-pretty">
          I'm <Em>Hillol Barman</Em>, a software engineer with a Master of Computer Science in
          Software Engineering from the <Em>University of Wollongong</Em> and hands-on experience
          building web applications across frontend, backend, and product design. My work focuses on{' '}
          <Em>responsive interfaces</Em>, <Em>reusable components</Em>, and <Em>clean API design</Em>{' '}
          — turning product requirements into software that is clear for users and practical for
          teams to extend. I'm currently seeking opportunities where I can contribute strong
          engineering fundamentals and a steady focus on quality delivery.
        </p>
      </SectionRule>

      {/* ── 02 — Technologies ─────────────────────────────────────────────── */}
      <SectionRule index="02" label="Technologies">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill}
              className="row-hover rounded-lg border border-hair px-3 py-[9px]"
            >
              <span className="block truncate font-mono text-[12.5px] text-[#96a1aa]">{skill}</span>
            </div>
          ))}
        </div>
      </SectionRule>

      {/* ── 03 — Work ─────────────────────────────────────────────────────── */}
      <SectionRule index="03" label="Work">
        <div className="flex flex-col gap-8">
          {employment.map((job) => (
            <article key={job.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h3 className="m-0 text-[19px] font-semibold tracking-[-0.02em] text-strong">
                  {job.role}
                </h3>
                <span className="whitespace-nowrap font-mono text-[12.5px] text-meta">
                  {job.duration}
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[13px] text-body">
                {job.company} · {job.location}
              </p>
              <ul className="mt-3.5 list-disc pl-[18px] text-[15px] leading-[1.75] text-dim">
                {job.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SectionRule>

      {/* ── 04 — Education ────────────────────────────────────────────────── */}
      <SectionRule index="04" label="Education">
        <div className="grid gap-4 sm:grid-cols-2">
          {education.map((item) => (
            <article
              key={item.institution}
              className="row-hover rounded-[14px] border border-hair p-[22px]"
            >
              <h3 className="m-0 text-[16px] font-semibold leading-[1.45] text-strong">
                {item.degree}
              </h3>
              <p className="mt-2.5 font-mono text-[12.5px] text-body">{item.institution}</p>
              <p className="mt-1.5 font-mono text-[12px] text-meta">{item.duration}</p>
              <p className="mt-3 text-[14.5px] leading-[1.7] text-dim">{item.notes}</p>
            </article>
          ))}
        </div>
      </SectionRule>

      {/* ── 05 — Achievements ─────────────────────────────────────────────── */}
      <SectionRule index="05" label="Achievements">
        <ul className="m-0 max-w-[76ch] list-disc pl-[18px] text-[15px] leading-[1.85] text-dim">
          {achievements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionRule>

      {/* ── 06 — Timeline ─────────────────────────────────────────────────── */}
      <SectionRule index="06" label="Timeline">
        <div className="flex flex-col">
          {timeline.map((item, i) => (
            <div
              key={item.period}
              className={`grid gap-2 border-t border-hair py-3.5 sm:grid-cols-[200px_1fr] sm:gap-6 ${
                i === timeline.length - 1 ? 'border-b' : ''
              }`}
            >
              <span className={`font-mono text-[12.5px] ${item.current ? 'text-accent' : 'text-meta'}`}>
                {item.period}
              </span>
              <span className="text-[15px] leading-[1.6] text-dim">{item.event}</span>
            </div>
          ))}
        </div>
      </SectionRule>

      {/* ── 07 — Contact ──────────────────────────────────────────────────── */}
      <SectionRule index="07" label="Contact" last className="pb-16">
        <p className="m-0 max-w-[70ch] text-[16px] leading-[1.8] text-body text-pretty">
          Open to new opportunities, collaborations, and interesting projects. Reach out via email
          or connect on LinkedIn — I typically respond within a day or two.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="mailto:hillolbarman@yahoo.com" className="btn-primary">
            <MailIcon />
            Send email
          </a>
          <a href="/HillolBarman_Resume.pdf" download className="btn-secondary">
            <DownloadIcon />
            Download CV
          </a>
          <a
            href="https://github.com/hillol-kr-barman"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/hillolbarman/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </div>
      </SectionRule>
    </PageShell>
  )
}
