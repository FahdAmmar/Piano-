import { memo, useMemo } from "react"
import { KEY_LAYOUT } from "../../lib/note-utils"
import { PianoKey } from "./PianoKey"

interface PianoKeyboardProps {
  pressedMidi: ReadonlySet<number>
  activeMidis?: ReadonlySet<number>
  onNoteOn: (midi: number) => void
  onNoteOff: (midi: number) => void
}

export const PianoKeyboard = memo(function PianoKeyboard({
  pressedMidi,
  activeMidis,
  onNoteOn,
  onNoteOff,
}: PianoKeyboardProps) {
  const whiteKeys = useMemo(() => KEY_LAYOUT.filter((k) => !k.isBlack), [])
  const blackKeys = useMemo(() => KEY_LAYOUT.filter((k) => k.isBlack), [])

  return (
    <div className="relative flex h-full w-full select-none">
      {whiteKeys.map((key) => (
        <div key={key.midi} className="h-full flex-1">
          <PianoKey
            midi={key.midi}
            isBlack={false}
            pressed={pressedMidi.has(key.midi)}
            active={activeMidis?.has(key.midi) ?? false}
            onNoteOn={onNoteOn}
            onNoteOff={onNoteOff}
          />
        </div>
      ))}
      {blackKeys.map((key) => (
        <div
          key={key.midi}
          className="absolute top-0 h-[62%]"
          style={{ left: `${key.leftFraction * 100}%`, width: `${key.widthFraction * 100}%` }}
        >
          <PianoKey
            midi={key.midi}
            isBlack
            pressed={pressedMidi.has(key.midi)}
            active={activeMidis?.has(key.midi) ?? false}
            onNoteOn={onNoteOn}
            onNoteOff={onNoteOff}
          />
        </div>
      ))}
    </div>
  )
})
