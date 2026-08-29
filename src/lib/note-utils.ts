export interface PianoKeyLayout {
  midi: number
  isBlack: boolean
  /** Left edge as a fraction (0..1) of the full keyboard width. */
  leftFraction: number
  /** Width as a fraction (0..1) of the full keyboard width. */
  widthFraction: number
}

export const FIRST_MIDI = 21 // A0
export const LAST_MIDI = 108 // C8

const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11])
const BLACK_KEY_WIDTH_RATIO = 0.62
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

function buildKeyLayout(): PianoKeyLayout[] {
  const whiteMidis: number[] = []
  for (let midi = FIRST_MIDI; midi <= LAST_MIDI; midi++) {
    if (WHITE_PITCH_CLASSES.has(midi % 12)) whiteMidis.push(midi)
  }
  const whiteKeyWidth = 1 / whiteMidis.length
  const blackKeyWidth = whiteKeyWidth * BLACK_KEY_WIDTH_RATIO
  const whiteIndexByMidi = new Map(whiteMidis.map((midi, index) => [midi, index]))

  const layout: PianoKeyLayout[] = []
  for (let midi = FIRST_MIDI; midi <= LAST_MIDI; midi++) {
    const isBlack = !WHITE_PITCH_CLASSES.has(midi % 12)
    if (!isBlack) {
      const whiteIndex = whiteIndexByMidi.get(midi)!
      layout.push({ midi, isBlack: false, leftFraction: whiteIndex * whiteKeyWidth, widthFraction: whiteKeyWidth })
    } else {
      // Every black key sits right after the white key one semitone below it.
      const precedingWhiteIndex = whiteIndexByMidi.get(midi - 1)!
      const boundary = (precedingWhiteIndex + 1) * whiteKeyWidth
      layout.push({ midi, isBlack: true, leftFraction: boundary - blackKeyWidth / 2, widthFraction: blackKeyWidth })
    }
  }
  return layout
}

export const KEY_LAYOUT = buildKeyLayout()
export const KEY_LAYOUT_MAP = new Map(KEY_LAYOUT.map((k) => [k.midi, k]))

export function midiToLabel(midi: number): string {
  const name = NOTE_NAMES[midi % 12]
  const octave = Math.floor(midi / 12) - 1
  return `${name}${octave}`
}
