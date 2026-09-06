import { useState } from "react"
import { useTheme } from "./hooks/useTheme"
import { KeyboardHelpOverlay } from "./features/piano/KeyboardHelpOverlay"
import { PianoStage } from "./features/piano/PianoStage"
import { TopBar } from "./features/piano/TopBar"
import type { PlaybackMode } from "./types"

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [mode, setMode] = useState<PlaybackMode>("free")
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

  return (
    <div className="flex h-dvh flex-col bg-base text-ink">
      <TopBar
        theme={theme}
        onToggleTheme={toggleTheme}
        mode={mode}
        onModeChange={setMode}
        onShowKeyboardHelp={() => setShowKeyboardHelp(true)}
      />
      <PianoStage mode={mode} />
      <KeyboardHelpOverlay open={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />
    </div>
  )
}
