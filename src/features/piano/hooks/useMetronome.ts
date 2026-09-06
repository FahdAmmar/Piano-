import { useEffect, useState } from "react"

interface UseMetronomeParams {
  context: AudioContext | null
  bpm: number
  enabled: boolean
}

const LOOKAHEAD_SEC = 0.1 // how far ahead we schedule audio clicks
const POLL_INTERVAL_MS = 25 // how often we check whether to schedule more
const BEATS_PER_ACCENT = 4 // accent the downbeat, as if in 4/4

function scheduleClick(context: AudioContext, time: number, accent: boolean) {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.frequency.value = accent ? 1600 : 1000
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(accent ? 0.28 : 0.16, time + 0.001)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
  osc.connect(gain)
  gain.connect(context.destination)
  osc.start(time)
  osc.stop(time + 0.06)
}

/**
 * A metronome click driven by the AudioContext's own clock rather than JS
 * timers, using the standard "lookahead scheduler" pattern: a fast-polling
 * interval keeps pushing precisely-timed audio events a little ahead of
 * playback, so the click stays steady even if the JS thread briefly stalls.
 * beatPulse increments on each beat for a visual indicator to sync against.
 */
export function useMetronome({ context, bpm, enabled }: UseMetronomeParams) {
  const [beatPulse, setBeatPulse] = useState(0)

  useEffect(() => {
    if (!enabled || !context) return

    const secondsPerBeat = 60 / bpm
    let nextNoteTime = context.currentTime + 0.05
    let beatCount = 0

    const tick = () => {
      while (nextNoteTime < context.currentTime + LOOKAHEAD_SEC) {
        const accent = beatCount % BEATS_PER_ACCENT === 0
        scheduleClick(context, nextNoteTime, accent)
        const delayMs = Math.max((nextNoteTime - context.currentTime) * 1000, 0)
        window.setTimeout(() => setBeatPulse((p) => p + 1), delayMs)
        nextNoteTime += secondsPerBeat
        beatCount += 1
      }
    }

    tick()
    const intervalId = window.setInterval(tick, POLL_INTERVAL_MS)
    return () => window.clearInterval(intervalId)
  }, [enabled, bpm, context])

  return { beatPulse }
}
