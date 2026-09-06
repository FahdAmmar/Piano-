import { useCallback, useEffect, useState } from "react"

/**
 * Whether the focused element would otherwise consume the spacebar itself
 * (activating a button, toggling a checkbox, opening a select). A range
 * slider like the volume control has no native space behavior, so it's
 * deliberately not included — otherwise sustain would silently stop working
 * for the rest of the session after the first time someone drags it.
 */
function focusOwnsSpacebar(el: Element | null): boolean {
  if (!el || el.getAttribute("data-piano-key") === "true") return false
  if (el.tagName === "BUTTON" || el.tagName === "SELECT" || el.tagName === "TEXTAREA") return true
  if (el.tagName === "INPUT") return (el as HTMLInputElement).type !== "range"
  return false
}

/**
 * The sustain pedal can be held two ways: the spacebar (held down, not
 * toggled, matching a real pedal) or a physical MIDI sustain pedal (reported
 * via setMidiSustain, wired to the MIDI input hook's Control Change 64).
 * Either one holding it down counts as sustain being active.
 */
export function useSustainPedal() {
  const [spacebarHeld, setSpacebarHeld] = useState(false)
  const [midiHeld, setMidiHeld] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space" || e.repeat) return
      if (focusOwnsSpacebar(document.activeElement)) return
      e.preventDefault() // don't let the page scroll
      setSpacebarHeld(true)
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.code !== "Space") return
      setSpacebarHeld(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const setMidiSustain = useCallback((isDown: boolean) => setMidiHeld(isDown), [])

  return { isHeld: spacebarHeld || midiHeld, setMidiSustain }
}
