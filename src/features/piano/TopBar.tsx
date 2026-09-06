import { Keyboard, Moon, Sun } from "lucide-react"
import type { PlaybackMode, Theme } from "../../types"

interface TopBarProps {
  theme: Theme
  onToggleTheme: () => void
  mode: PlaybackMode
  onModeChange: (mode: PlaybackMode) => void
  onShowKeyboardHelp: () => void
}

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"

export function TopBar({ theme, onToggleTheme, mode, onModeChange, onShowKeyboardHelp }: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 sm:gap-3 sm:px-6">
      <h1 className="font-display text-lg text-ink sm:text-xl">Nocturne</h1>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex rounded-full border border-line bg-surface p-1 text-sm" role="tablist" aria-label="Playback mode">
          <ModeButton shortLabel="Free" label="Free Play" active={mode === "free"} onClick={() => onModeChange("free")} />
          <ModeButton shortLabel="Song" label="Learn a Song" active={mode === "song"} onClick={() => onModeChange("song")} />
        </div>

        <button
          type="button"
          onClick={onShowKeyboardHelp}
          aria-label="Show computer keyboard shortcuts"
          className={`rounded-full border border-line bg-surface p-2 text-ink transition-colors hover:bg-surface-raised ${FOCUS_RING}`}
        >
          <Keyboard size={18} />
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className={`rounded-full border border-line bg-surface p-2 text-ink transition-colors hover:bg-surface-raised ${FOCUS_RING}`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}

function ModeButton({
  shortLabel,
  label,
  active,
  onClick,
}: {
  shortLabel: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-2.5 py-1 transition-colors sm:px-3 ${FOCUS_RING} ${
        active ? "bg-ember text-[#231506]" : "text-ink-muted hover:text-ink"
      }`}
    >
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
