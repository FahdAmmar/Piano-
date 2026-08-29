import { Moon, Sun } from "lucide-react"
import type { PlaybackMode, Theme } from "../../types"

interface TopBarProps {
  theme: Theme
  onToggleTheme: () => void
  mode: PlaybackMode
  onModeChange: (mode: PlaybackMode) => void
}

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"

export function TopBar({ theme, onToggleTheme, mode, onModeChange }: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
      <h1 className="font-display text-lg text-ink sm:text-xl">Nocturne</h1>

      <div className="flex items-center gap-3">
        <div className="flex rounded-full border border-line bg-surface p-1 text-sm" role="tablist" aria-label="Playback mode">
          <ModeButton label="Free Play" active={mode === "free"} onClick={() => onModeChange("free")} />
          <ModeButton label="Learn a Song" active={mode === "song"} onClick={() => onModeChange("song")} />
        </div>

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

function ModeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full px-3 py-1 transition-colors ${FOCUS_RING} ${
        active ? "bg-ember text-[#231506]" : "text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  )
}
