import { Repeat } from "lucide-react"
import { useState } from "react"

interface LoopControlProps {
  enabled: boolean
  start: number // 1-indexed for display
  end: number // 1-indexed for display
  maxSteps: number
  onToggle: () => void
  onRangeChange: (start: number, end: number) => void
}

export function LoopControl({ enabled, start, end, maxSteps, onToggle, onRangeChange }: LoopControlProps) {
  // Local text state while editing, so typing "10" isn't clamped after the
  // first keystroke — the numeric range only commits on blur / Enter.
  // Synced back to the prop value on external changes (e.g. switching
  // songs), compared during render rather than in an effect.
  const [startText, setStartText] = useState(String(start))
  const [prevStart, setPrevStart] = useState(start)
  if (prevStart !== start) {
    setPrevStart(start)
    setStartText(String(start))
  }

  const [endText, setEndText] = useState(String(end))
  const [prevEnd, setPrevEnd] = useState(end)
  if (prevEnd !== end) {
    setPrevEnd(end)
    setEndText(String(end))
  }

  function commitStart() {
    const clamped = Math.min(Math.max(1, Number(startText) || 1), end)
    onRangeChange(clamped, end)
    setStartText(String(clamped))
  }

  function commitEnd() {
    const clamped = Math.max(Math.min(maxSteps, Number(endText) || maxSteps), start)
    onRangeChange(start, clamped)
    setEndText(String(clamped))
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-surface py-1 pl-1 pr-2 text-xs">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label="Toggle loop"
        className={`flex items-center gap-1.5 rounded-full px-1.5 py-0.5 transition-colors ${
          enabled ? "text-violet" : "text-ink-muted hover:text-ink"
        }`}
      >
        <Repeat size={13} />
        Loop
      </button>
      {enabled && (
        <div className="flex items-center gap-1 text-ink-muted">
          <input
            type="number"
            value={startText}
            onChange={(e) => setStartText(e.target.value)}
            onBlur={commitStart}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            aria-label="Loop start step"
            className="w-8 rounded bg-transparent text-center text-ink [appearance:textfield]"
          />
          <span>–</span>
          <input
            type="number"
            value={endText}
            onChange={(e) => setEndText(e.target.value)}
            onBlur={commitEnd}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            aria-label="Loop end step"
            className="w-8 rounded bg-transparent text-center text-ink [appearance:textfield]"
          />
        </div>
      )}
    </div>
  )
}
