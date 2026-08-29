import { SplendidGrandPiano } from "smplr"

/**
 * Thin wrapper around smplr's sampled grand piano. Keeping this isolated
 * means the rest of the app only depends on play/release/dispose, not on
 * the underlying audio library's API.
 */
export class PianoAudioEngine {
  private readonly context: AudioContext
  private readonly instrument: ReturnType<typeof SplendidGrandPiano>
  readonly ready: Promise<void>

  constructor() {
    this.context = new AudioContext()
    this.instrument = SplendidGrandPiano(this.context)
    this.ready = this.instrument.ready
  }

  /** Browsers block audio until a user gesture resumes the context. */
  private async resume() {
    if (this.context.state === "suspended") await this.context.resume()
  }

  resumeAndPlay(midi: number, velocity = 90) {
    void this.resume()
    this.instrument.start({ note: midi, velocity })
  }

  release(midi: number) {
    this.instrument.stop(midi)
  }

  stopAll() {
    this.instrument.stop()
  }

  setVolume(volume: number) {
    this.instrument.output.volume = volume
  }

  dispose() {
    this.instrument.dispose()
  }
}
