import { ElectricPiano, Soundfont, SplendidGrandPiano, type Smplr } from "smplr"

export type InstrumentId = "grand-piano" | "electric-piano" | "organ" | "harpsichord" | "celesta" | "strings"

export const INSTRUMENTS: { id: InstrumentId; label: string }[] = [
  { id: "grand-piano", label: "Grand Piano" },
  { id: "electric-piano", label: "Electric Piano" },
  { id: "organ", label: "Organ" },
  { id: "harpsichord", label: "Harpsichord" },
  { id: "celesta", label: "Celesta" },
  { id: "strings", label: "Strings" },
]

function createInstrument(id: InstrumentId, context: AudioContext): Smplr {
  switch (id) {
    case "electric-piano":
      return ElectricPiano(context, { instrument: "WurlitzerEP200" })
    case "organ":
      return Soundfont(context, { instrument: "church_organ" })
    case "harpsichord":
      return Soundfont(context, { instrument: "harpsichord" })
    case "celesta":
      return Soundfont(context, { instrument: "celesta" })
    case "strings":
      return Soundfont(context, { instrument: "string_ensemble_1" })
    case "grand-piano":
      return SplendidGrandPiano(context)
  }
}

/**
 * Thin wrapper around smplr's sampled instruments. Keeping this isolated
 * means the rest of the app only depends on play/release/setInstrument, not
 * on the underlying audio library's per-instrument API differences.
 */
export class PianoAudioEngine {
  readonly context: AudioContext
  private instrument: Smplr
  private volume = 127 // smplr's Output.volume range is 0-127
  ready: Promise<void>

  constructor(instrumentId: InstrumentId = "grand-piano") {
    this.context = new AudioContext()
    this.instrument = createInstrument(instrumentId, this.context)
    this.ready = this.instrument.ready
  }

  /** Loads the new instrument before swapping, so there's no silent gap. */
  async setInstrument(instrumentId: InstrumentId) {
    const next = createInstrument(instrumentId, this.context)
    await next.ready
    next.output.volume = this.volume
    const previous = this.instrument
    this.instrument = next
    previous.dispose()
  }

  /** Browsers block audio until a user gesture resumes the context. */
  private async resume() {
    if (this.context.state === "suspended") await this.context.resume()
  }

  /** duration (seconds) is optional — omit it for a held note released via release(). */
  resumeAndPlay(midi: number, velocity = 90, duration?: number) {
    void this.resume()
    this.instrument.start({ note: midi, velocity, duration })
  }

  release(midi: number) {
    this.instrument.stop(midi)
  }

  stopAll() {
    this.instrument.stop()
  }

  /** 0-127, matching smplr's Output.volume range. */
  setVolume(volume: number) {
    this.volume = volume
    this.instrument.output.volume = volume
  }

  dispose() {
    this.instrument.dispose()
  }
}
