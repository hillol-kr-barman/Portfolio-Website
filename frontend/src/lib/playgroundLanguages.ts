export const languageOptions = [
  { value: 'javascript', label: 'JavaScript', badge: 'JS' },
  { value: 'typescript', label: 'TypeScript', badge: 'TS' },
  { value: 'python', label: 'Python', badge: 'PY' },
  { value: 'html', label: 'HTML', badge: 'HTML' },
  { value: 'css', label: 'CSS', badge: 'CSS' },
  { value: 'json', label: 'JSON', badge: 'JSON' },
] as const

export const LANGUAGE_LABELS: Record<string, string> = Object.fromEntries(
  languageOptions.map((o) => [o.value, o.label]),
)

export const LANGUAGE_BADGES: Record<string, string> = Object.fromEntries(
  languageOptions.map((o) => [o.value, o.badge]),
)

const starterSnippets: Record<string, string> = {
  javascript: `function greet(name) {
  return \`Hello, \${name}.\`
}

console.log(greet('developer'))
`,
  typescript: `export function greet(name: string): string {
  return \`Hello, \${name}.\`
}

const people = ['developer', 'designer']

for (const person of people) {
  console.log(greet(person))
}
`,
  python: `def greet(name):
    return f"Hello, {name}."


print(greet("developer"))
`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
  </head>
  <body>
    <h1>Hello, developer.</h1>
  </body>
</html>
`,
  css: `body {
  margin: 0;
  font-family: Geist, sans-serif;
  background: #03070c;
  color: #eff2f4;
}

h1 {
  color: #34d399;
}
`,
  json: `{
  "message": "Hello, developer.",
  "language": "json"
}
`,
}

export function getStarterSnippet(language: string): string {
  return starterSnippets[language] ?? starterSnippets['javascript']!
}

/** "Edited 2m ago" — the rail's relative timestamps. */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''

  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000))
  if (seconds < 60) return 'just now'

  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`

  const weeks = Math.round(days / 7)
  if (weeks < 5) return `${weeks}w ago`

  return new Date(iso).toLocaleDateString()
}
