export type Hand = "left" | "right"

/** A single note in a song, positioned in musical time (beats). */
export interface NoteEvent {
  midi: number
  beat: number
  duration: number
  hand: Hand
}

/** A NoteEvent with its beat position resolved to seconds for a given tempo. */
export interface TimedNoteEvent extends NoteEvent {
  startSec: number
  durationSec: number
}

export type Difficulty = "beginner" | "intermediate" | "advanced" | "two-hands" | "imported"

export interface Song {
  id: string
  title: string
  composer: string
  bpm: number
  difficulty: Difficulty
  events: NoteEvent[]
}

export type PlaybackMode = "free" | "song"
export type SongPlayStyle = "wait" | "auto"
export type Theme = "dark" | "light"
