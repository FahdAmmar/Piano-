import { X } from "lucide-react"
import { useEffect, useRef } from "react"
import { KEYBOARD_BINDINGS } from "../../lib/keyboard-map"

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

interface KeyboardHelpOverlayProps {
  open: boolean
  onClose: () => void
}

export function KeyboardHelpOverlay({ open, onClose }: KeyboardHelpOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // The native <dialog> focus trap doesn't reliably hold focus when there's
  // only a single focusable descendant (observed: Tab bounces to <body>
  // instead of staying on it in Chromium) — so Tab/Shift+Tab are trapped
  // explicitly among whatever's actually focusable inside at the time.
  function trapFocus(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Tab") return
    const focusable = e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const firstOctave = KEYBOARD_BINDINGS.filter((b) => b.semitoneOffset < 12)
  const secondOctave = KEYBOARD_BINDINGS.filter((b) => b.semitoneOffset >= 12)

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      onKeyDown={trapFocus}
      className="fixed inset-0 m-auto max-w-md rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-black/60"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 className="font-display text-lg">Keyboard Shortcuts</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1 text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5 px-5 py-4">
        <KeyRow title="First octave" bindings={firstOctave} />
        <KeyRow title="Second octave" bindings={secondOctave} />

        <div className="space-y-1.5 border-t border-line pt-4 text-sm text-ink-muted">
          <p>
            <kbd className="rounded border border-line bg-surface-raised px-1.5 py-0.5 font-mono text-xs text-ink">[</kbd>{" "}
            /{" "}
            <kbd className="rounded border border-line bg-surface-raised px-1.5 py-0.5 font-mono text-xs text-ink">]</kbd>{" "}
            shift the whole mapping down or up an octave
          </p>
          <p>
            <kbd className="rounded border border-line bg-surface-raised px-1.5 py-0.5 font-mono text-xs text-ink">
              Space
            </kbd>{" "}
            (hold) acts as a sustain pedal
          </p>
        </div>
      </div>
    </dialog>
  )
}

function KeyRow({ title, bindings }: { title: string; bindings: typeof KEYBOARD_BINDINGS }) {
  return (
    <div>
      <h3 className="mb-2 text-xs uppercase tracking-wide text-ink-muted">{title}</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {bindings.map((binding) => (
          <div
            key={binding.key}
            className="flex flex-col items-center gap-1 rounded-lg border border-line bg-surface-raised py-1.5"
          >
            <span className="font-mono text-sm">{binding.key.toUpperCase()}</span>
            <span className="text-xs text-ink-muted">{NOTE_NAMES[binding.semitoneOffset % 12]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
