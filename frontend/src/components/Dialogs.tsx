import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  filename: string
  shareUrl: string
  onStopSharing?: () => void
}

/**
 * The share dialog. 520px on the raised surface; the URL sits in a bordered
 * mono field with "Copy link" primary and "Stop sharing" secondary beneath it.
 */
export function ShareDialog({ open, onClose, filename, shareUrl, onStopSharing }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[300]">
      <div className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <DialogPanel className="w-full max-w-[520px] rounded-[14px] border border-hair bg-raised p-6">
          <p className="eyebrow">Share document</p>
          <DialogTitle className="mt-2.5 text-[20px] font-semibold tracking-[-0.025em] text-strong">
            {filename}
          </DialogTitle>
          <p className="mt-2.5 text-[14px] leading-[1.7] text-dim">
            Anyone with this link can view the snippet. They cannot edit it or see your other
            documents.
          </p>

          <div className="mt-4 overflow-hidden rounded-[9px] border border-input px-3.5 py-3">
            <p className="truncate font-mono text-[12px] text-dim">{shareUrl}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={handleCopy} className="btn-primary flex-1">
              {copied ? 'Copied' : 'Copy link'}
            </button>
            {onStopSharing ? (
              <button
                type="button"
                onClick={() => { onStopSharing(); onClose() }}
                className="btn-secondary"
              >
                Stop sharing
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel: string
  /** Destructive confirms use the palette's dusty red rather than red-500. */
  destructive?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[300]">
      <div className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <DialogPanel className="w-full max-w-[440px] rounded-[14px] border border-hair bg-raised p-6">
          <DialogTitle className="m-0 text-[18px] font-semibold tracking-[-0.02em] text-strong">
            {title}
          </DialogTitle>
          <p className="mt-2.5 text-[14px] leading-[1.7] text-dim">{description}</p>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary btn-sm">
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`${destructive ? 'btn-danger' : 'btn-primary'} btn-sm`}
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
