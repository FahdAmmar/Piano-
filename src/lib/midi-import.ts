import { Midi } from "@tonejs/midi"
import { FIRST_MIDI, LAST_MIDI } from "./note-utils"
import type { Hand, NoteEvent, Song } from "../types"

const MAX_NOTES = 3000 // sane ceiling so a huge file can't hang the render loop
const MIDDLE_C = 60

export class MidiImportError extends Error {}

/**
 * Parses a .mid file into our Song format. @tonejs/midi already resolves
 * note timing to seconds (flattening any tempo changes in the file), so we
 * store the song at a nominal 60 BPM — at that tempo, 1 beat == 1 second,
 * letting us reuse NoteEvent.beat as-is without a second unit conversion.
 */
export async function parseMidiFile(file: File): Promise<Song> {
  let midi: Midi
  try {
    const buffer = await file.arrayBuffer()
    midi = new Midi(buffer)
  } catch {
    throw new MidiImportError(`"${file.name}" doesn't look like a valid MIDI file.`)
  }

  const tracksWithNotes = midi.tracks.filter((track) => track.notes.length > 0)
  if (tracksWithNotes.length === 0) {
    throw new MidiImportError(`"${file.name}" doesn't contain any notes.`)
  }

  // Two heuristics for which hand a note belongs to, since a generic MIDI
  // file carries no such label: with multiple note-bearing tracks, treat the
  // first as the right hand and the rest as the left; with just one track,
  // split by pitch around middle C.
  const events: NoteEvent[] = []
  tracksWithNotes.forEach((track, trackIndex) => {
    const trackHand: Hand | null = tracksWithNotes.length > 1 ? (trackIndex === 0 ? "right" : "left") : null
    for (const note of track.notes) {
      if (note.midi < FIRST_MIDI || note.midi > LAST_MIDI) continue // outside our 88 keys
      events.push({
        midi: note.midi,
        beat: note.time,
        duration: Math.max(note.duration, 0.05),
        hand: trackHand ?? (note.midi < MIDDLE_C ? "left" : "right"),
      })
    }
  })

  if (events.length === 0) {
    throw new MidiImportError(`"${file.name}" only has notes outside the 88-key piano range.`)
  }
  if (events.length > MAX_NOTES) {
    throw new MidiImportError(`"${file.name}" has too many notes (${events.length}) to practice here — try a shorter piece.`)
  }

  return {
    id: `imported-${Date.now()}`,
    title: midi.name?.trim() || file.name.replace(/\.mid[i]?$/i, ""),
    composer: "Imported",
    bpm: 60,
    difficulty: "imported",
    events: events.sort((a, b) => a.beat - b.beat),
  }
}
