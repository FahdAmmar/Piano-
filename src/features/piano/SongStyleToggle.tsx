import type { SongPlayStyle } from "../../types"

interface SongStyleToggleProps {
  style: SongPlayStyle
  onChange: (style: SongPlayStyle) => void
}

const OPTIONS: { value: SongPlayStyle; label: string }[] = [
  { value: "wait", label: "Wait" },
  { value: "auto", label: "Auto" },
]

export function SongStyleToggle({ style, onChange }: SongStyleToggleProps) {
  return (
    <div className="flex rounded-full border border-line bg-surface p-1 text-xs" role="tablist" aria-label="Practice style">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={style === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-2.5 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
            style === option.value ? "bg-violet text-[#1c1730]" : "text-ink-muted hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
