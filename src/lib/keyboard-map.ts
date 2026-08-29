import { FIRST_MIDI, LAST_MIDI } from "./note-utils"

interface KeyBinding {
  key: string
  /** Semitones above the current base note (which is always a C). */
  semitoneOffset: number
}

// Two rows of a QWERTY keyboard, each covering roughly one octave — the
// layout used by most browser piano apps, so it's familiar out of the box.
export const KEYBOARD_BINDINGS: KeyBinding[] = [
  { key: "z", semitoneOffset: 0 }, // C
  { key: "s", semitoneOffset: 1 }, // C#
  { key: "x", semitoneOffset: 2 }, // D
  { key: "d", semitoneOffset: 3 }, // D#
  { key: "c", semitoneOffset: 4 }, // E
  { key: "v", semitoneOffset: 5 }, // F
  { key: "g", semitoneOffset: 6 }, // F#
  { key: "b", semitoneOffset: 7 }, // G
  { key: "h", semitoneOffset: 8 }, // G#
  { key: "n", semitoneOffset: 9 }, // A
  { key: "j", semitoneOffset: 10 }, // A#
  { key: "m", semitoneOffset: 11 }, // B
  { key: "q", semitoneOffset: 12 }, // C (next octave)
  { key: "2", semitoneOffset: 13 },
  { key: "w", semitoneOffset: 14 },
  { key: "3", semitoneOffset: 15 },
  { key: "e", semitoneOffset: 16 },
  { key: "r", semitoneOffset: 17 },
  { key: "5", semitoneOffset: 18 },
  { key: "t", semitoneOffset: 19 },
  { key: "6", semitoneOffset: 20 },
  { key: "y", semitoneOffset: 21 },
  { key: "7", semitoneOffset: 22 },
  { key: "u", semitoneOffset: 23 },
  { key: "i", semitoneOffset: 24 }, // C (two octaves up)
]

export const DEFAULT_BASE_MIDI = 60 // 'z' plays middle C (C4)
export const MIN_BASE_MIDI = FIRST_MIDI
export const MAX_BASE_MIDI = LAST_MIDI - 24 // keeps the 'i' extension key on the keyboard
