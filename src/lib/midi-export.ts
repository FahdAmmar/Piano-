import { Midi } from "@tonejs/midi"

export interface RecordedNote {
  midi: number
  startSec: number
  durationSec: number
}

const DEFAULT_EXPORT_TEMPO = 120 // nominal — note times are written directly in seconds

export function buildMidiBlob(notes: RecordedNote[]): Blob {
  const midi = new Midi()
  midi.header.setTempo(DEFAULT_EXPORT_TEMPO)
  midi.name = "Nocturne Recording"

  const track = midi.addTrack()
  track.name = "Piano"
  for (const note of notes) {
    track.addNote({ midi: note.midi, time: note.startSec, duration: note.durationSec })
  }

  return new Blob([new Uint8Array(midi.toArray())], { type: "audio/midi" })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
