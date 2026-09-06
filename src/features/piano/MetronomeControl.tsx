import { Metronome as MetronomeIcon } from "lucide-react"

interface MetronomeControlProps {
  enabled: boolean
  bpm: number
  beatPulse: number
  onToggle: () => void
  onBpmChange: (bpm: number) => void
}

const MIN_BPM = 40
const MAX_BPM = 240
const STEP = 5

export function MetronomeControl({ enabled, bpm, beatPulse, onToggle, onBpmChange }: MetronomeControlProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-surface py-1 pl-1 pr-2 text-xs shadow-lg">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label="Toggle metronome"
        className={`flex items-center gap-1.5 rounded-full px-1.5 py-0.5 transition-colors ${
          enabled ? "text-violet" : "text-ink-muted hover:text-ink"
        }`}
      >
        <MetronomeIcon size={14} />
        {enabled && (
          <span
            key={beatPulse}
            className="h-1.5 w-1.5 animate-ping rounded-full bg-violet"
            style={{ animationIterationCount: 1 }}
          />
        )}
      </button>
      {enabled && (
        <div className="flex items-center gap-1 text-ink-muted">
          <button type="button" onClick={() => onBpmChange(Math.max(MIN_BPM, bpm - STEP))} aria-label="Slower" className="px-1 hover:text-ink">
            −
          </button>
          <span className="font-mono tabular-nums text-ink">{bpm}</span>
          <button type="button" onClick={() => onBpmChange(Math.min(MAX_BPM, bpm + STEP))} aria-label="Faster" className="px-1 hover:text-ink">
            +
          </button>
        </div>
      )}
    </div>
  )
}
