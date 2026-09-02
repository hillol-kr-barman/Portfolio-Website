import { useState } from 'react'
import AppHeader from './AppHeader'
import type { PlaygroundDocument } from '../lib/playgroundStore'
import { LANGUAGE_LABELS } from '../lib/playgroundLanguages'

interface SharedSnippetViewProps {
  document: PlaygroundDocument
  onNavigate: (to: string) => void
}

/**
 * The read-only recipient view for `/playground?share=<token>`. No rail, no
 * inspector, no editing — just the snippet and a route into an account.
 */
export default function SharedSnippetView({ document, onNavigate }: SharedSnippetViewProps) {
  const [copied, setCopied] = useState(false)
  const lines = document.content.replace(/\n$/, '').split('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(document.content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AppHeader
        onNavigate={onNavigate}
        currentPath="/playground"
        variant="read-only"
        marker="Shared snippet"
      />

      <main className="px-5 pb-12 pt-10 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 text-[20px] font-semibold tracking-[-0.025em] text-[#f2f5f6]">
              {document.title}
            </h1>
            <p className="mt-1.5 font-mono text-[11.5px] text-label">
              {LANGUAGE_LABELS[document.language] ?? document.language} · shared by Hillol Barman · read only
            </p>
          </div>
          <button type="button" onClick={handleCopy} className="btn-secondary btn-sm">
            {copied ? 'Copied' : 'Copy code'}
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-panel">
          <div className="grid grid-cols-[38px_1fr] overflow-x-auto">
            <div className="border-r border-hair-soft py-4 pr-[11px] text-right font-mono text-[12.5px] leading-[1.95] text-gutter">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="m-0 overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.95] text-dim">
              {lines.join('\n')}
            </pre>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-4">
          <span className="text-[13px] leading-[1.6] text-muted">Want your own workspace?</span>
          <button
            type="button"
            onClick={() => onNavigate('/signup')}
            className="btn-primary btn-sm"
          >
            Create an account
          </button>
        </div>
      </main>
    </div>
  )
}
