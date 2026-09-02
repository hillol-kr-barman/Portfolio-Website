import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { AuthUser } from '@hillolbarman/ui'
import type { Monaco } from '@monaco-editor/react'
import AppHeader from '../components/AppHeader'
import SharedSnippetView from '../components/SharedSnippetView'
import { ConfirmDialog, ShareDialog, UnsavedChangesDialog } from '../components/Dialogs'
import { PLAYGROUND_THEME, defineEditorTheme } from '../components/EditorTheme'
import {
  LANGUAGE_BADGES,
  LANGUAGE_LABELS,
  getStarterSnippet,
  languageOptions,
  relativeTime,
} from '../lib/playgroundLanguages'
import {
  deleteAllDocumentsForUser,
  deleteDocument,
  getDocumentByShareToken,
  listDocumentsForUser,
  saveDocument,
  type PlaygroundDocument,
} from '../lib/playgroundStore'

const Editor = lazy(() => import('@monaco-editor/react'))

interface PlaygroundProps {
  onNavigate: (to: string) => void
  routeSearch?: string
  currentUser?: AuthUser | null
  onLogout?: () => void
}

interface ActivityEntry {
  at: string
  message: string
}

const NEW_DOCUMENT_TITLE = 'Untitled snippet'

/** Stand-in id for the unsaved snippet, which has no database row yet. */
const DRAFT_TAB_ID = '__draft__'

interface EditorTab {
  id: string
  title: string
  isDraft: boolean
}

/** An action deferred until the user resolves unsaved changes. */
interface PendingAction {
  actionLabel: string
  run: () => void
}

function shareUrlFor(token: string) {
  return `${window.location.origin}/playground?share=${token}`
}

export default function Playground({ onNavigate, routeSearch = '', currentUser, onLogout }: PlaygroundProps) {
  const [documents, setDocuments] = useState<PlaygroundDocument[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [openTabIds, setOpenTabIds] = useState<string[]>([])
  const [title, setTitle] = useState(NEW_DOCUMENT_TITLE)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(getStarterSnippet('javascript'))
  const [isDirty, setIsDirty] = useState(false)
  const [search, setSearch] = useState('')
  const [cursor, setCursor] = useState({ line: 1, column: 1 })
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [error, setError] = useState('')

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [pendingDelete, setPendingDelete] = useState<PlaygroundDocument | null>(null)
  const [deleteMode, setDeleteMode] = useState<'single' | 'all' | null>(null)

  const [railOpen, setRailOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [isSavingBeforeAction, setIsSavingBeforeAction] = useState(false)
  const tabStripRef = useRef<HTMLDivElement | null>(null)
  const [sharedDocument, setSharedDocument] = useState<PlaygroundDocument | null>(null)
  const [isResolvingShare, setIsResolvingShare] = useState(false)

  const shareToken = useMemo(() => new URLSearchParams(routeSearch).get('share'), [routeSearch])
  const activeDocument = documents.find((doc) => doc.id === activeDocumentId) ?? null

  const logActivity = useCallback((message: string) => {
    const at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    setActivity((entries) => [{ at, message }, ...entries].slice(0, 8))
  }, [])

  const refreshDocuments = useCallback(async () => {
    if (!currentUser) {
      setDocuments([])
      return []
    }
    const next = await listDocumentsForUser(currentUser.id)
    setDocuments(next)
    return next
  }, [currentUser])

  // ── Document list ─────────────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true

    refreshDocuments()
      .catch((err) => { if (isActive && err instanceof Error) setError(err.message) })

    return () => { isActive = false }
  }, [refreshDocuments])

  // ── Shared-link resolution ────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true

    if (!shareToken) {
      setSharedDocument(null)
      return
    }

    setIsResolvingShare(true)
    getDocumentByShareToken(shareToken)
      .then((doc) => {
        if (!isActive) return
        setSharedDocument(doc)
      })
      .catch((err) => { if (isActive && err instanceof Error) setError(err.message) })
      .finally(() => { if (isActive) setIsResolvingShare(false) })

    return () => { isActive = false }
  }, [shareToken])

  const openDocument = useCallback((doc: PlaygroundDocument) => {
    // Clicking the document that is already open must not touch the editor:
    // reloading the stored copy would throw away unsaved edits, and it logged
    // a duplicate activity entry on every click.
    if (doc.id === activeDocumentId) return

    setActiveDocumentId(doc.id)
    setOpenTabIds((ids) => (ids.includes(doc.id) ? ids : [...ids, doc.id]))
    setTitle(doc.title)
    setLanguage(doc.language)
    setCode(doc.content)
    setIsDirty(false)
    setShareUrl(doc.isShared && doc.shareToken ? shareUrlFor(doc.shareToken) : '')
    logActivity(`Opened ${doc.title}`)
  }, [activeDocumentId, logActivity])

  const handleNewDocument = useCallback(() => {
    setActiveDocumentId(null)
    setTitle(NEW_DOCUMENT_TITLE)
    setLanguage('javascript')
    setCode(getStarterSnippet('javascript'))
    setShareUrl('')
    // A fresh draft is the untouched starter snippet — nothing to protect yet.
    // The first keystroke marks it dirty.
    setIsDirty(false)
    logActivity('New snippet created')
  }, [logActivity])

  const handleLanguageChange = (nextLanguage: string) => {
    const shouldReplaceWithStarter = !activeDocumentId || code === getStarterSnippet(language)
    setLanguage(nextLanguage)
    if (shouldReplaceWithStarter) setCode(getStarterSnippet(nextLanguage))
    setIsDirty(true)
  }

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!currentUser) {
      onNavigate('/login?redirect=/playground')
      return false
    }

    setError('')

    try {
      const saved = await saveDocument({
        id: activeDocumentId,
        title,
        content: code,
        language,
        ownerId: currentUser.id,
        isShared: activeDocument?.isShared ?? false,
      })

      setActiveDocumentId(saved.id)
      setOpenTabIds((ids) => (ids.includes(saved.id) ? ids : [...ids, saved.id]))
      setIsDirty(false)
      await refreshDocuments()
      logActivity('Saved to your account')
      return true
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      return false
    }
  }, [activeDocument, activeDocumentId, code, currentUser, language, logActivity, onNavigate, refreshDocuments, title])

  const handleShare = useCallback(async () => {
    if (!currentUser) {
      onNavigate('/login?redirect=/playground')
      return
    }

    setError('')

    try {
      const saved = await saveDocument({
        id: activeDocumentId,
        title,
        content: code,
        language,
        ownerId: currentUser.id,
        isShared: true,
      })

      setActiveDocumentId(saved.id)
      setIsDirty(false)
      await refreshDocuments()
      setShareUrl(shareUrlFor(saved.shareToken ?? ''))
      setShareDialogOpen(true)
      logActivity('Share link created')
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    }
  }, [activeDocumentId, code, currentUser, language, logActivity, onNavigate, refreshDocuments, title])

  const handleStopSharing = useCallback(async () => {
    if (!currentUser || !activeDocumentId) return

    try {
      await saveDocument({
        id: activeDocumentId,
        title,
        content: code,
        language,
        ownerId: currentUser.id,
        isShared: false,
      })
      setShareUrl('')
      await refreshDocuments()
      logActivity('Sharing turned off')
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    }
  }, [activeDocumentId, code, currentUser, language, logActivity, refreshDocuments, title])

  /**
   * The editor holds a single buffer, so every action that loads something
   * else over it — new snippet, opening another document, closing the active
   * tab — has to clear unsaved work first.
   */
  const guardUnsaved = useCallback(
    (actionLabel: string, run: () => void) => {
      if (!isDirty) {
        run()
        return
      }
      setPendingAction({ actionLabel, run })
    },
    [isDirty],
  )

  const resolvePendingWithSave = async () => {
    if (!pendingAction) return
    setIsSavingBeforeAction(true)
    const saved = await handleSave()
    setIsSavingBeforeAction(false)
    // A failed save keeps the dialog open so the work is never dropped on the
    // strength of a request that did not land.
    if (!saved) return
    pendingAction.run()
    setPendingAction(null)
  }

  const resolvePendingWithDiscard = () => {
    if (!pendingAction) return
    pendingAction.run()
    setPendingAction(null)
  }

  // ── ⌘S save, ⌘N new ───────────────────────────────────────────────────────
  const handlersRef = useRef({ handleSave, handleNewDocument, guardUnsaved })
  handlersRef.current = { handleSave, handleNewDocument, guardUnsaved }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return

      if (event.key.toLowerCase() === 's') {
        event.preventDefault()
        handlersRef.current.handleSave()
      }

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        const { guardUnsaved: guard, handleNewDocument: create } = handlersRef.current
        guard('creating a new snippet', create)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeTab = (id: string) => {
    // The draft is not in `documents`, so closing it means falling back to the
    // last open document rather than removing a tab id.
    if (id === DRAFT_TAB_ID) {
      const last = documents.find((doc) => doc.id === openTabIds[openTabIds.length - 1])
      if (last) openDocument(last)
      else handleNewDocument()
      return
    }

    const remaining = openTabIds.filter((tabId) => tabId !== id)
    setOpenTabIds(remaining)

    if (activeDocumentId !== id) return

    const next = documents.find((doc) => doc.id === remaining[remaining.length - 1])
    if (next) openDocument(next)
    else handleNewDocument()
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return

    try {
      if (deleteMode === 'all') {
        await deleteAllDocumentsForUser(currentUser?.id ?? '')
        setDocuments([])
        setOpenTabIds([])
        handleNewDocument()
        logActivity('All documents deleted')
      } else {
        await deleteDocument(pendingDelete.id)
        const remaining = await refreshDocuments()
        setOpenTabIds((ids) => ids.filter((id) => id !== pendingDelete.id))

        if (activeDocumentId === pendingDelete.id) {
          const next = remaining[0]
          if (next) openDocument(next)
          else handleNewDocument()
        }
        logActivity(`Deleted ${pendingDelete.title}`)
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    } finally {
      setPendingDelete(null)
      setDeleteMode(null)
    }
  }

  const visibleDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.trim().toLowerCase()),
  )

  const openTabs: EditorTab[] = [
    ...openTabIds
      .map((id) => documents.find((doc) => doc.id === id))
      .filter((doc): doc is PlaygroundDocument => doc !== undefined)
      .map((doc) => ({ id: doc.id, title: doc.title, isDraft: false })),
    // An unsaved snippet has no id yet, so it gets its own tab alongside the
    // saved ones and stays there until it is saved or closed.
    ...(activeDocumentId === null ? [{ id: DRAFT_TAB_ID, title, isDraft: true }] : []),
  ]

  // ── Shared-link recipient view ────────────────────────────────────────────
  if (shareToken) {
    if (isResolvingShare) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-canvas">
          <p className="font-mono text-[12px] text-label">Loading shared snippet…</p>
        </div>
      )
    }

    if (sharedDocument && sharedDocument.ownerId !== currentUser?.id) {
      return <SharedSnippetView document={sharedDocument} onNavigate={onNavigate} />
    }

    if (!sharedDocument) {
      return (
        <div className="min-h-screen bg-canvas">
          <AppHeader onNavigate={onNavigate} currentPath="/playground" variant="read-only" marker="Shared snippet" />
          <main className="px-5 py-20 sm:px-10">
            <p className="eyebrow">Shared snippet</p>
            <h1 className="mt-4 text-[clamp(2rem,5vw,40px)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink">
              Link no longer works
            </h1>
            <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-body text-pretty">
              This snippet is not shared any more, or the link was mistyped.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate('/playground')} className="btn-primary">
                Open the playground
              </button>
            </div>
          </main>
        </div>
      )
    }
  }

  const activeTabId = activeDocumentId ?? DRAFT_TAB_ID

  useEffect(() => {
    const strip = tabStripRef.current
    if (!strip) return

    const tab = strip.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(activeTabId)}"]`)
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeTabId, openTabIds.length])

  const renderRail = () => (
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
          <div className="border-b border-hair p-4">
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.09] px-[11px] py-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-label">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents"
                aria-label="Search documents"
                className="w-full bg-transparent font-mono text-[12.5px] text-bright outline-none placeholder:text-label"
              />
            </div>
          </div>

          <div className="flex items-baseline justify-between px-4 pb-2 pt-3.5">
            <span className="eyebrow-tight">Documents</span>
            <span className="font-mono text-[11px] text-ghost">{visibleDocuments.length}</span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 pb-3">
            {visibleDocuments.length === 0 ? (
              <p className="px-2.5 py-3 text-[12.5px] leading-[1.6] text-label">
                {currentUser
                  ? search
                    ? 'No documents match that search.'
                    : 'No saved documents yet. Save the current snippet to create your first one.'
                  : 'Log in to keep snippets on your account.'}
              </p>
            ) : (
              visibleDocuments.map((doc) => {
                const isActive = doc.id === activeDocumentId
                return (
                  <div
                    key={doc.id}
                    className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-[9px] transition-colors duration-150 ease-out ${
                      isActive
                        ? 'border border-accent/[0.22] bg-accent/[0.07]'
                        : 'border border-transparent hover:border-white/[0.09]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        guardUnsaved(`opening ${doc.title}`, () => {
                          openDocument(doc)
                          setRailOpen(false)
                        })
                      }
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                    >
                      <span
                        className={`shrink-0 rounded font-mono text-[10px] ${
                          isActive
                            ? 'border border-accent/30 px-[5px] py-0.5 text-accent'
                            : 'border border-edge px-[5px] py-0.5 text-muted'
                        }`}
                      >
                        {LANGUAGE_BADGES[doc.language] ?? doc.language.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[13px] ${
                            isActive ? 'font-semibold text-strong' : 'font-[450] text-[#b8c2c9]'
                          }`}
                        >
                          {doc.title}
                        </span>
                        <span className={`mt-0.5 block font-mono text-[10.5px] ${isActive ? 'text-label' : 'text-faint'}`}>
                          Edited {relativeTime(doc.updatedAt)}
                        </span>
                      </span>
                    </button>

                    {doc.isShared ? (
                      <span title="Shared" className="shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#34d399' : '#4c5761'} strokeWidth="2" strokeLinecap="round">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
                        </svg>
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setDeleteMode('single'); setPendingDelete(doc) }}
                      title={`Delete ${doc.title}`}
                      className="shrink-0 text-faint opacity-0 transition-opacity duration-150 ease-out hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                )
              })
            )}
          </div>

          <div className="mt-auto border-t border-hair p-4">
            {currentUser && documents.length > 0 ? (
              <button
                type="button"
                onClick={() => { setDeleteMode('all'); setPendingDelete({ id: 'all', title: 'all saved documents' } as PlaygroundDocument) }}
                className="btn-danger btn-sm mb-3.5 w-full"
              >
                Delete all
              </button>
            ) : null}

            <p className="eyebrow-tight">Shortcuts</p>
            <div className="mt-2.5 flex flex-col gap-[7px]">
              {[['Save', '⌘ S'], ['Run', '⌘ ↵'], ['New', '⌘ N']].map(([action, keys]) => (
                <div key={action} className="flex items-center justify-between">
                  <span className="font-mono text-[11.5px] text-meta">{action}</span>
                  <span className="rounded-[5px] border border-input px-1.5 py-0.5 font-mono text-[10.5px] text-dim">
                    {keys}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
  )

  const savedIndicator = isDirty ? 'Unsaved changes' : 'All changes saved'

  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:h-screen">
      <AppHeader
        onNavigate={onNavigate}
        currentPath="/playground"
        currentUser={currentUser}
        onLogout={onLogout}
        variant="app"
      />

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hair px-6 py-3.5">
        <div className="flex items-baseline gap-3.5">
          <button
            type="button"
            onClick={() => setRailOpen(true)}
            className="btn-secondary btn-sm self-center lg:hidden"
          >
            Documents
          </button>
          <h1 className="m-0 text-[15px] font-semibold tracking-[-0.02em] text-strong">
            Code Playground
          </h1>
          <p className="hidden font-mono text-[11.5px] text-label sm:block">
            Create, save, and share code snippets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1.5 hidden items-center gap-[7px] font-mono text-[12px] text-meta sm:flex">
            <span className={`size-[5px] rounded-full ${isDirty ? 'bg-faint' : 'bg-accent'}`} />
            {savedIndicator}
          </span>
          <button type="button" onClick={handleShare} className="btn-secondary btn-sm">Share</button>
          <button
            type="button"
            onClick={() => guardUnsaved('creating a new snippet', handleNewDocument)}
            className="btn-secondary btn-sm"
          >
            + New
          </button>
          <button type="button" onClick={handleSave} className="btn-primary btn-sm">Save</button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="border-b border-danger/30 bg-danger/[0.08] px-6 py-2.5 text-[13px] text-[#e2a5a1]">
          {error}
        </p>
      ) : null}

      {/* ── App frame ────────────────────────────────────────────────────────
          xl: rail | editor | inspector.
          lg: rail | (editor above inspector).
          below lg: editor above inspector, with the rail behind a toggle.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="hidden w-[264px] shrink-0 overflow-hidden border-r border-hair lg:flex">
          {renderRail()}
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col xl:flex-row">
        {/* Center — tab strip + editor */}
        <section className="flex min-h-[60vh] min-w-0 flex-col overflow-hidden lg:min-h-0 lg:flex-1">
          <div className="flex min-w-0 items-stretch overflow-hidden border-b border-hair bg-white/[0.012]">
            <div ref={tabStripRef} className="tab-strip flex min-w-0 flex-1 overflow-x-auto">
              {openTabs.map((tab) => {
                const isActive = tab.id === activeTabId
                return (
                  <div
                    key={tab.id}
                    data-tab-id={tab.id}
                    title={tab.title || NEW_DOCUMENT_TITLE}
                    className={`relative flex max-w-[200px] shrink-0 items-center gap-2.5 border-r border-hair px-4 py-[11px] ${
                      isActive ? 'bg-panel' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (tab.isDraft) return
                        const doc = documents.find((item) => item.id === tab.id)
                        if (doc) guardUnsaved(`opening ${doc.title}`, () => openDocument(doc))
                      }}
                      className="flex min-w-0 items-center gap-2.5"
                    >
                      <span
                        className={`truncate font-mono text-[12.5px] ${
                          isActive ? 'text-[#e3e9ed]' : 'text-meta'
                        }`}
                      >
                        {tab.title || NEW_DOCUMENT_TITLE}
                      </span>
                      {tab.isDraft ? (
                        <span className="shrink-0 font-mono text-[10px] text-label">draft</span>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (tab.id !== activeTabId) {
                          closeTab(tab.id)
                          return
                        }
                        guardUnsaved(`closing ${tab.title}`, () => closeTab(tab.id))
                      }}
                      aria-label={`Close ${tab.title}`}
                      className={`shrink-0 text-[13px] leading-none ${
                        isActive ? 'text-faint' : 'text-[#3a444d]'
                      } transition-colors duration-150 ease-out hover:text-bright`}
                    >
                      ×
                    </button>

                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>

            {/* Opaque and bordered so tabs scroll away cleanly behind it
                rather than appearing to run underneath. */}
            <div className="hidden shrink-0 items-center gap-2.5 whitespace-nowrap border-l border-hair bg-canvas px-4 md:flex">
              <span className="font-mono text-[11.5px] text-label">
                {LANGUAGE_LABELS[language] ?? language}
              </span>
              <span className="text-[#3a444d]">·</span>
              <span className="font-mono text-[11.5px] text-label">UTF-8</span>
              <span className="text-[#3a444d]">·</span>
              <span className="font-mono text-[11.5px] text-label">
                Ln {cursor.line}, Col {cursor.column}
              </span>
            </div>
          </div>

          {/* Monaco needs a definite height at mount; `flex-1` alone resolves too
              late for it and the editor comes up 0px tall. Absolute fill inside
              a positioned host gives it one immediately. */}
          <div className="relative min-h-0 flex-1 bg-panel">
            <div className="absolute inset-0">
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center font-mono text-[12px] text-label">
                    Loading editor…
                  </div>
                }
              >
                <Editor
                  height="100%"
                  theme={PLAYGROUND_THEME}
                  language={language}
                  value={code}
                  beforeMount={(monaco: Monaco) => defineEditorTheme(monaco)}
                  onMount={(editor) => {
                    editor.onDidChangeCursorPosition((e) =>
                      setCursor({ line: e.position.lineNumber, column: e.position.column }),
                    )

                    // `automaticLayout` does not always catch the first frame
                    // inside a flex column, and the editor comes up 5px tall.
                    // Measure once the host has been laid out.
                    requestAnimationFrame(() => editor.layout())

                    const host = editor.getContainerDomNode().parentElement
                    if (!host) return

                    const observer = new ResizeObserver(() => editor.layout())
                    observer.observe(host)
                    editor.onDidDispose(() => observer.disconnect())
                  }}
                  onChange={(value) => { setCode(value ?? ''); setIsDirty(true) }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineHeight: 26,
                    fontFamily: '"Geist Mono", ui-monospace, monospace',
                    automaticLayout: true,
                    padding: { top: 18, bottom: 18 },
                    scrollBeyondLastLine: false,
                    renderLineHighlight: 'none',
                    lineNumbersMinChars: 3,
                    overviewRulerLanes: 0,
                  }}
                />
              </Suspense>
            </div>
          </div>
        </section>
        {/* Right inspector */}
        <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto border-t border-hair px-[18px] pb-6 pt-[18px] xl:w-[300px] xl:shrink-0 xl:border-t-0 xl:border-l">
          <div>
            <p className="eyebrow-tight">Document</p>
            <div className="mt-2.5 flex flex-col gap-2">
              <label htmlFor="doc-title" className="sr-only">Document title</label>
              <input
                id="doc-title"
                value={title}
                maxLength={60}
                onChange={(e) => { setTitle(e.target.value); setIsDirty(true) }}
                className="field rounded-lg px-3 py-[9px] text-[13px]"
              />
              <label htmlFor="doc-language" className="sr-only">Language</label>
              <select
                id="doc-language"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="field cursor-pointer appearance-none rounded-lg bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%235b6570%22><path d=%22M5.2 7.5 10 12.3l4.8-4.8z%22/></svg>')] bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat px-3 py-[9px] pr-9 text-[13px]"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-raised text-bright">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="eyebrow-tight">Sharing</p>
            <div
              className={`mt-2.5 rounded-[10px] p-3.5 ${
                shareUrl ? 'border border-accent/25 bg-accent/[0.05]' : 'border border-hair'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-semibold text-strong">
                  Link sharing {shareUrl ? 'on' : 'off'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(shareUrl)}
                  aria-label="Link sharing"
                  onClick={() => (shareUrl ? handleStopSharing() : handleShare())}
                  className={`flex h-[18px] w-8 items-center rounded-full p-0.5 transition-colors duration-150 ease-out ${
                    shareUrl ? 'justify-end bg-accent' : 'justify-start bg-white/[0.14]'
                  }`}
                >
                  <span className={`size-3.5 rounded-full ${shareUrl ? 'bg-[#04170f]' : 'bg-[#5b6570]'}`} />
                </button>
              </div>

              <p className="mt-2 text-[12.5px] leading-[1.6] text-dim">
                {shareUrl
                  ? 'Anyone with the link can view the last saved version.'
                  : 'Turn sharing on to create a read-only link for this snippet.'}
              </p>

              {shareUrl ? (
                <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-input px-2.5 py-2">
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-dim">{shareUrl}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="shrink-0 font-mono text-[11px] font-medium text-accent"
                  >
                    Copy
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <p className="eyebrow-tight">Activity</p>
            <div className="mt-2.5 flex flex-col gap-[9px]">
              {activity.length === 0 ? (
                <p className="text-[12.5px] leading-[1.5] text-faint">No activity yet.</p>
              ) : (
                activity.map((entry, i) => (
                  <div key={`${entry.at}-${i}`} className="flex gap-2.5">
                    <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-faint">
                      {entry.at}
                    </span>
                    <span className="text-[12.5px] leading-[1.5] text-dim">{entry.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-auto border-t border-hair pt-3.5">
            <p className="m-0 text-[12.5px] leading-[1.7] text-meta">
              Saved snippets stay attached to your account. Shared links reopen the last saved
              version.
            </p>
          </div>
        </aside>
        </div>
      </div>

      {/* The rail as a drawer below `lg`. */}
      <Dialog open={railOpen} onClose={setRailOpen} className="lg:hidden">
        <div className="fixed inset-0 z-[250] bg-black/50" />
        <DialogPanel className="fixed inset-y-0 left-0 z-[250] flex w-[280px] flex-col border-r border-hair bg-canvas">
          <div className="flex items-center justify-between border-b border-hair px-4 py-3">
            <span className="eyebrow-tight">Documents</span>
            <button type="button" onClick={() => setRailOpen(false)} className="-m-2 p-2 text-muted hover:text-bright">
              <span className="sr-only">Close</span>
              <XMarkIcon className="size-5" aria-hidden="true" />
            </button>
          </div>
          {renderRail()}
        </DialogPanel>
      </Dialog>


      <UnsavedChangesDialog
        open={Boolean(pendingAction)}
        documentName={title || NEW_DOCUMENT_TITLE}
        actionLabel={pendingAction?.actionLabel ?? ''}
        canSave={Boolean(currentUser)}
        isSaving={isSavingBeforeAction}
        onSave={resolvePendingWithSave}
        onDiscard={resolvePendingWithDiscard}
        onCancel={() => setPendingAction(null)}
      />

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        filename={title}
        shareUrl={shareUrl}
        onStopSharing={handleStopSharing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => { setPendingDelete(null); setDeleteMode(null) }}
        onConfirm={confirmDelete}
        title={deleteMode === 'all' ? 'Delete all documents?' : 'Delete document?'}
        description={
          deleteMode === 'all'
            ? 'All saved documents will be removed from your account. This cannot be undone.'
            : pendingDelete
              ? `"${pendingDelete.title}" will be removed from your saved documents. This cannot be undone.`
              : ''
        }
        confirmLabel={deleteMode === 'all' ? 'Delete all' : 'Delete'}
        destructive
      />
    </div>
  )
}
