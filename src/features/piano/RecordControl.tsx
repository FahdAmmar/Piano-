import { Circle, Download, Square, X } from "lucide-react"
import type { RecorderStatus } from "./hooks/useRecorder"

interface RecordControlProps {
  status: RecorderStatus
  noteCount: number
  onStart: () => void
  onStop: () => void
  onDownload: () => void
  onDiscard: () => void
}

const BADGE = "flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs shadow-lg transition-colors"
const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"

export function RecordControl({ status, noteCount, onStart, onStop, onDownload, onDiscard }: RecordControlProps) {
  if (status === "idle") {
    return (
      <button type="button" onClick={onStart} className={`${BADGE} ${FOCUS_RING} text-ink-muted hover:text-ink`}>
        <Circle size={12} className="fill-[var(--color-danger)] text-[var(--color-danger)]" />
        Record
      </button>
    )
  }

  if (status === "recording") {
    return (
      <button type="button" onClick={onStop} className={`${BADGE} ${FOCUS_RING} text-ink`}>
        <Square size={11} className="fill-[var(--color-danger)] text-[var(--color-danger)]" />
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-danger)] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-danger)]" />
        </span>
        Recording…
      </button>
    )
  }

  // done — offer the file, or let the person discard and record again
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onDownload} className={`${BADGE} ${FOCUS_RING} text-ink`}>
        <Download size={13} className="text-ember" />
        Download MIDI ({noteCount} notes)
      </button>
      <button
        type="button"
        onClick={onDiscard}
        aria-label="Discard recording"
        className={`rounded-full border border-line bg-surface p-1.5 text-ink-muted shadow-lg transition-colors hover:text-ink ${FOCUS_RING}`}
      >
        <X size={13} />
      </button>
    </div>
  )
}
