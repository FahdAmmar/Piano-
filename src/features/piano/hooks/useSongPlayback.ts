import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Song, SongPlayStyle, TimedNoteEvent } from "../../../types"

interface UseSongPlaybackParams {
  song: Song
  enabled: boolean
  style: SongPlayStyle
}

/** All notes that start on the same beat — a two-hand chord must clear together. */
interface NoteGroup {
  events: TimedNoteEvent[]
  startSec: number
}

function groupByBeat(events: TimedNoteEvent[]): NoteGroup[] {
  const groups: NoteGroup[] = []
  for (const event of events) {
    const current = groups[groups.length - 1]
    if (current && current.events[0].beat === event.beat) {
      current.events.push(event)
    } else {
      groups.push({ events: [event], startSec: event.startSec })
    }
  }
  return groups
}

// How far from a note's exact time (in seconds, either side) Scroll Mode
// still counts a press as a hit. Generous enough to be a fair first taste of
// real timing, not a precision rhythm-game window.
const SCROLL_HIT_WINDOW_SEC = 0.3

/**
 * Drives "Learn a Song" playback in one of two styles:
 *
 * - Wait Mode: elapsed time is clamped so it can never pass the start of the
 *   next unplayed group, so the falling block(s) stall at the strike line
 *   until every note in the group is pressed. Anyone can finish the piece
 *   regardless of timing skill.
 * - Scroll Mode: elapsed time runs in real time, unclamped. A note counts as
 *   hit only if pressed within SCROLL_HIT_WINDOW_SEC of its exact time;
 *   otherwise the group expires as a miss once that window closes. This is
 *   the real timing challenge once Wait Mode feels too easy.
 *
 * elapsedRef is a ref (not state) since it updates every animation frame and
 * only the canvas needs to read it.
 */
export function useSongPlayback({ song, enabled, style }: UseSongPlaybackParams) {
  const secondsPerBeat = 60 / song.bpm

  // Sorted once so simultaneous (two-hand) notes end up adjacent for grouping,
  // and so "the first N events" always means "the N earliest notes".
  const timedEvents = useMemo<TimedNoteEvent[]>(
    () =>
      [...song.events]
        .sort((a, b) => a.beat - b.beat)
        .map((event) => ({
          ...event,
          startSec: event.beat * secondsPerBeat,
          durationSec: event.duration * secondsPerBeat,
        })),
    [song, secondsPerBeat],
  )

  const groups = useMemo(() => groupByBeat(timedEvents), [timedEvents])

  const elapsedRef = useRef(0)
  const groupIndexRef = useRef(0)
  const satisfiedRef = useRef<Set<number>>(new Set())
  const lastFrameRef = useRef<number | null>(null)
  const [playedCount, setPlayedCount] = useState(0)
  const [activeMidis, setActiveMidis] = useState<ReadonlySet<number>>(new Set())
  const [isComplete, setIsComplete] = useState(false)
  const [hitCount, setHitCount] = useState(0)
  const [missCount, setMissCount] = useState(0)

  // Restart playback when the song, style, or enabled state changes. The
  // state reset runs synchronously during render (React's documented
  // pattern for resetting state from a prop change — no extra render pass).
  const resetKey = `${song.id}:${enabled}:${style}`
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey)
    setPlayedCount(0)
    setIsComplete(false)
    setHitCount(0)
    setMissCount(0)
    setActiveMidis(new Set(groups[0]?.events.map((e) => e.midi) ?? []))
  }

  // The hot-path refs can't be written during render, so they're reset in a
  // small effect keyed to the same condition.
  useEffect(() => {
    elapsedRef.current = 0
    groupIndexRef.current = 0
    satisfiedRef.current = new Set()
    lastFrameRef.current = null
  }, [resetKey])

  /** Shared by "chord fully hit" and "chord expired" — moves to the next group. */
  const advanceGroup = useCallback(() => {
    const nextIndex = groupIndexRef.current + 1
    groupIndexRef.current = nextIndex
    satisfiedRef.current = new Set()
    const playedSoFar = groups.slice(0, nextIndex).reduce((sum, g) => sum + g.events.length, 0)
    setPlayedCount(playedSoFar)
    setActiveMidis(new Set(groups[nextIndex]?.events.map((e) => e.midi) ?? []))
    if (nextIndex >= groups.length) setIsComplete(true)
  }, [groups])

  useEffect(() => {
    if (!enabled) return
    let frameId: number

    const tick = (now: number) => {
      if (lastFrameRef.current !== null) {
        const deltaSec = (now - lastFrameRef.current) / 1000

        if (style === "wait") {
          const pending = groups[groupIndexRef.current]
          const clamp = pending ? pending.startSec : Number.POSITIVE_INFINITY
          elapsedRef.current = Math.min(elapsedRef.current + deltaSec, clamp)
        } else {
          elapsedRef.current += deltaSec
          const pending = groups[groupIndexRef.current]
          if (pending && elapsedRef.current > pending.startSec + SCROLL_HIT_WINDOW_SEC) {
            const missed = pending.events.filter((e) => !satisfiedRef.current.has(e.midi)).length
            if (missed > 0) setMissCount((c) => c + missed)
            advanceGroup()
          }
        }
      }
      lastFrameRef.current = now
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [enabled, groups, style, advanceGroup])

  /**
   * Call when the user plays a note. Returns the matched event (so the
   * caller can use its `hand` for the ignition color) or null if the note
   * wasn't part of the currently pending group (or, in Scroll Mode, arrived
   * outside its hit window).
   */
  const registerNotePress = useCallback(
    (midi: number): TimedNoteEvent | null => {
      const currentGroup = groups[groupIndexRef.current]
      if (!currentGroup) return null

      const match = currentGroup.events.find((e) => e.midi === midi)
      if (!match || satisfiedRef.current.has(midi)) return null

      if (style === "scroll" && Math.abs(elapsedRef.current - currentGroup.startSec) > SCROLL_HIT_WINDOW_SEC) {
        return null // outside the timing window — not a valid hit
      }

      satisfiedRef.current.add(midi)
      if (style === "scroll") setHitCount((c) => c + 1)

      if (satisfiedRef.current.size < currentGroup.events.length) {
        // Chord not fully cleared yet — stay on this group, just narrow the highlight.
        setActiveMidis(new Set(currentGroup.events.map((e) => e.midi).filter((m) => !satisfiedRef.current.has(m))))
        return match
      }

      if (style === "wait") lastFrameRef.current = null // avoid a time jump on the next frame
      advanceGroup()
      return match
    },
    [groups, style, advanceGroup],
  )

  const accuracy = hitCount + missCount > 0 ? Math.round((hitCount / (hitCount + missCount)) * 100) : null

  return {
    timedEvents,
    elapsedRef,
    playedCount,
    activeMidis,
    isComplete,
    registerNotePress,
    hitCount,
    missCount,
    accuracy,
  }
}
