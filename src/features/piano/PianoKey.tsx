import { memo, useCallback } from "react"
import { midiToLabel } from "../../lib/note-utils"

interface PianoKeyProps {
  midi: number
  isBlack: boolean
  pressed: boolean
  active: boolean
  onNoteOn: (midi: number) => void
  onNoteOff: (midi: number) => void
}

export const PianoKey = memo(function PianoKey({ midi, isBlack, pressed, active, onNoteOn, onNoteOff }: PianoKeyProps) {
  // Pointer events cover mouse, touch and pen with one handler set.
  const handleDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      onNoteOn(midi)
    },
    [midi, onNoteOn],
  )
  const handleUp = useCallback(() => onNoteOff(midi), [midi, onNoteOff])

  const baseClasses =
    "h-full w-full touch-none transition-colors duration-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
  const colorClasses = isBlack
    ? `border border-black/50 ${pressed ? "bg-violet" : active ? "bg-violet-soft" : "bg-[#15131f]"}`
    : `border border-line ${pressed ? "bg-ember" : active ? "bg-ember-soft" : "bg-key-white"}`

  return (
    <button
      type="button"
      aria-label={midiToLabel(midi)}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      onPointerCancel={handleUp}
      className={`${baseClasses} ${colorClasses}`}
    />
  )
})
