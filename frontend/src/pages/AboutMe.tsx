import type { AuthUser } from '@hillolbarman/ui'
import about400Webp from '../assets/about-400.webp'
import about800Webp from '../assets/about-800.webp'
import about1200Webp from '../assets/about-1200.webp'
import PageShell from '../components/PageShell'
import SectionRule from '../components/SectionRule'

/** Brand dots. REST APIs moved off #9eff1f with the accent; the rest are unchanged. */
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
  { name: 'REST APIs', dot: '#34d399' },
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

/** `current: true` takes the accent date; every other row stays neutral. */
const timeline = [
  { period: '2006', event: 'Regional Math Olympiad Champion' },
  { period: 'Jun 2016 – Jul 2020', event: 'BSc in Computer Science and Engineering at IEM, Kolkata' },
  { period: 'Dec 2020 – Feb 2023', event: 'Freelance UI Designer and Developer at Drivers4Me' },
  { period: 'Jul 2023 – Jun 2025', event: 'MSc in Computer Science (Software Engineering), UOW — Distinction' },
  { period: 'Mar 2025 – Present', event: 'Console Operator at NPG Urbanista Convenience Store, Albion Park NSW', current: true },
]

const contactLinks = [
  { label: 'Email', href: 'mailto:hillolbarman@yahoo.com' },
  { label: 'GitHub', href: 'https://github.com/hillol-kr-barman', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hillolbarman/', external: true },
  { label: 'Resume PDF', href: '/HillolBarman_Resume.pdf', download: true },
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
                className="row-hover rounded-[7px] border border-input px-3 py-1.5 font-mono text-[12px] text-[#9aa5ad]"
              >
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
              key={skill.name}
              className="row-hover flex items-center gap-[9px] rounded-lg border border-hair px-3 py-[9px]"
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: skill.dot }}
              />
              <span className="truncate font-mono text-[12.5px] text-[#96a1aa]">{skill.name}</span>
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
          <a href="mailto:hillolbarman@yahoo.com" className="btn-primary">Send email</a>
          <a href="/HillolBarman_Resume.pdf" download className="btn-secondary">Download CV</a>
          <a
            href="https://github.com/hillol-kr-barman"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/hillolbarman/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            LinkedIn
          </a>
        </div>
      </SectionRule>
    </PageShell>
  )
}
