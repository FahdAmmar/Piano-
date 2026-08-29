import { useState } from "react"
import { useTheme } from "./hooks/useTheme"
import { PianoStage } from "./features/piano/PianoStage"
import { TopBar } from "./features/piano/TopBar"
import type { PlaybackMode } from "./types"

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [mode, setMode] = useState<PlaybackMode>("free")

  return (
    <div className="flex h-dvh flex-col bg-base text-ink">
      <TopBar theme={theme} onToggleTheme={toggleTheme} mode={mode} onModeChange={setMode} />
      <PianoStage mode={mode} />
    </div>
  )
}
