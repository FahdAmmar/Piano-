import type { Hand, NoteEvent } from "../types"

const SEMITONES_FROM_C: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

function midiOf(name: string, octave: number): number {
  const isSharp = name.endsWith("#")
  const semitone = SEMITONES_FROM_C[isSharp ? name.slice(0, -1) : name]
  return semitone + (isSharp ? 1 : 0) + (octave + 1) * 12
}

/** [note name, octave, duration in beats]. Use "R" as the name for a silent rest. */
export type Step = [string, number, number]

const REST = "R"

/** Turns a compact note list into timed NoteEvents, starting at beat 0. */
export function buildEvents(steps: Step[], hand: Hand = "right"): NoteEvent[] {
  let beat = 0
  const events: NoteEvent[] = []
  for (const [name, octave, duration] of steps) {
    if (name !== REST) {
      // Trim each note slightly short of its full slot so consecutive same-length
      // notes render as visually distinct falling blocks rather than one solid bar.
      events.push({ midi: midiOf(name, octave), beat, duration: duration * 0.85, hand })
    }
    beat += duration
  }
  return events
}
