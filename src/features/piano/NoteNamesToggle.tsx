import { Tag } from "lucide-react"

interface NoteNamesToggleProps {
  enabled: boolean
  onToggle: () => void
}

export function NoteNamesToggle({ enabled, onToggle }: NoteNamesToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label="Toggle note names on keys"
      className={`flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
        enabled ? "text-violet" : "text-ink-muted hover:text-ink"
      }`}
    >
      <Tag size={14} />
    </button>
  )
}
