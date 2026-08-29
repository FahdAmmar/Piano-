import type { NoteEvent, Song } from "../types"

const SEMITONES_FROM_C: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

function midiOf(name: string, octave: number): number {
  return SEMITONES_FROM_C[name] + (octave + 1) * 12
}

/** [note name, octave, duration in beats] */
type Step = [string, number, number]

// prettier-ignore
const MELODY: Step[] = [
  ["C", 4, 1], ["C", 4, 1], ["G", 4, 1], ["G", 4, 1], ["A", 4, 1], ["A", 4, 1], ["G", 4, 2],
  ["F", 4, 1], ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["D", 4, 1], ["D", 4, 1], ["C", 4, 2],
  ["G", 4, 1], ["G", 4, 1], ["F", 4, 1], ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["D", 4, 2],
  ["G", 4, 1], ["G", 4, 1], ["F", 4, 1], ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["D", 4, 2],
  ["C", 4, 1], ["C", 4, 1], ["G", 4, 1], ["G", 4, 1], ["A", 4, 1], ["A", 4, 1], ["G", 4, 2],
  ["F", 4, 1], ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["D", 4, 1], ["D", 4, 1], ["C", 4, 2],
]

function buildEvents(steps: Step[]): NoteEvent[] {
  let beat = 0
  return steps.map(([name, octave, duration]) => {
    // Trim each note slightly short of its full slot so consecutive same-length
    // notes render as visually distinct falling blocks rather than one solid bar.
    const event: NoteEvent = { midi: midiOf(name, octave), beat, duration: duration * 0.85, hand: "right" }
    beat += duration
    return event
  })
}

export const demoSong: Song = {
  id: "twinkle-twinkle",
  title: "Twinkle Twinkle Little Star",
  composer: "Traditional",
  bpm: 100,
  difficulty: "beginner",
  events: buildEvents(MELODY),
}
