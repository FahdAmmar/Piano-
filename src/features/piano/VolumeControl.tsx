import { Volume2, VolumeX } from "lucide-react"

interface VolumeControlProps {
  volumePercent: number // 0-100, what the UI shows
  onChange: (volumePercent: number) => void
}

export function VolumeControl({ volumePercent, onChange }: VolumeControlProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 shadow-lg">
      {volumePercent === 0 ? (
        <VolumeX size={14} className="shrink-0 text-ink-muted" />
      ) : (
        <Volume2 size={14} className="shrink-0 text-ink-muted" />
      )}
      <input
        type="range"
        min={0}
        max={100}
        value={volumePercent}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Volume"
        className="h-1 w-16 cursor-pointer accent-ember sm:w-20"
      />
    </div>
  )
}
