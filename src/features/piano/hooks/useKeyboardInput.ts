import { useEffect, useMemo } from "react"
import { KEYBOARD_BINDINGS } from "../../../lib/keyboard-map"

interface UseKeyboardInputParams {
  baseMidi: number
  onNoteOn: (midi: number) => void
  onNoteOff: (midi: number) => void
  onShiftOctave: (direction: 1 | -1) => void
}

export function useKeyboardInput({ baseMidi, onNoteOn, onNoteOff, onShiftOctave }: UseKeyboardInputParams) {
  const keyToMidi = useMemo(() => {
    const map = new Map<string, number>()
    for (const binding of KEYBOARD_BINDINGS) map.set(binding.key, baseMidi + binding.semitoneOffset)
    return map
  }, [baseMidi])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      if (key === "[") return onShiftOctave(-1)
      if (key === "]") return onShiftOctave(1)
      const midi = keyToMidi.get(key)
      if (midi === undefined) return
      onNoteOn(midi)
    }
    function handleKeyUp(e: KeyboardEvent) {
      const midi = keyToMidi.get(e.key.toLowerCase())
      if (midi === undefined) return
      onNoteOff(midi)
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [keyToMidi, onNoteOn, onNoteOff, onShiftOctave])
}
