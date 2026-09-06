import { memo, useCallback } from "react"
import { midiToKeyDisplayName, midiToLabel } from "../../lib/note-utils"

interface PianoKeyProps {
  midi: number
  isBlack: boolean
  pressed: boolean
  active: boolean
  showLabel: boolean
  onNoteOn: (midi: number) => void
  onNoteOff: (midi: number) => void
}

export const PianoKey = memo(function PianoKey({ midi, isBlack, pressed, active, showLabel, onNoteOn, onNoteOff }: PianoKeyProps) {
  // Pointer events cover mouse, touch and pen with one handler set.
  const handleDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      onNoteOn(midi)
    },
    [midi, onNoteOn],
  )
  const handleUp = useCallback(() => onNoteOff(midi), [midi, onNoteOff])

  // Glissando: sliding a held pointer across keys (mouse dragged or a
  // finger swiped) plays each one in turn, like running a finger down real
  // piano keys. e.buttons reflects *this* pointer's own held state, so this
  // naturally supports multiple simultaneous glissandi (e.g. two fingers)
  // without any shared state between keys.
  const handleEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons !== 1) return
      onNoteOn(midi)
    },
    [midi, onNoteOn],
  )

  const baseClasses =
    "relative h-full w-full touch-none transition-colors duration-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
  const colorClasses = isBlack
    ? `border border-black/50 ${pressed ? "bg-violet" : active ? "bg-violet-soft" : "bg-[#15131f]"}`
    : `border border-line ${pressed ? "bg-ember" : active ? "bg-ember-soft" : "bg-key-white"}`
  // Key fills are always light (white keys) or always dark (black keys)
  // regardless of the app's own dark/light theme, so the label color is
  // fixed too rather than following the theme tokens.
  const labelClasses = isBlack ? "text-white/45" : "text-black/35"

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={midiToLabel(midi)}
      data-piano-key="true"
      onPointerDown={handleDown}
      onPointerEnter={handleEnter}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      onPointerCancel={handleUp}
      className={`${baseClasses} ${colorClasses}`}
    >
      {showLabel && (
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-1.5 select-none text-center font-mono text-[9px] leading-none sm:text-[10px] ${labelClasses}`}
        >
          {midiToKeyDisplayName(midi)}
        </span>
      )}
    </button>
  )
})
