import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Song, SongPlayStyle, TimedNoteEvent } from "../../../types"

interface UseSongPlaybackParams {
  song: Song
  enabled: boolean
  style: SongPlayStyle
  /** Loops back to loopStart once loopEnd's group clears (hit in Wait Mode, played in Auto Mode). */
  loopEnabled: boolean
  loopStart: number
  loopEnd: number
  /** Auto Mode only: fired the instant a group's notes reach their scheduled time. */
  onAutoPlay?: (events: TimedNoteEvent[]) => void
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

/**
 * Drives "Learn a Song" playback in one of two styles:
 *
 * - Wait Mode: elapsed time is clamped so it can never pass the start of the
 *   next unplayed group, so the falling block(s) stall at the strike line
 *   until every note in the group is pressed. Anyone can finish the piece
 *   regardless of timing skill.
 * - Auto Mode: elapsed time runs in real time, unclamped, and the hook plays
 *   the piece itself — the instant elapsed time reaches a group's scheduled
 *   start, onAutoPlay fires for it and playback moves on. Since both the
 *   falling block and the sound are driven off the same elapsed clock in the
 *   same frame, they stay perfectly in sync.
 *
 * elapsedRef is a ref (not state) since it updates every animation frame and
 * only the canvas needs to read it.
 */
export function useSongPlayback({ song, enabled, style, loopEnabled, loopStart, loopEnd, onAutoPlay }: UseSongPlaybackParams) {
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

  // Restart playback when the song, style, or enabled state changes — and
  // also when the loop range itself changes, jumping straight to loopStart
  // rather than requiring one full pass from the beginning first. The state
  // reset runs synchronously during render (React's documented pattern for
  // resetting state from a prop change — no extra render pass).
  const resetKey = `${song.id}:${enabled}:${style}:${loopEnabled ? `${loopStart}-${loopEnd}` : "no-loop"}`
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  const startIndex = loopEnabled ? Math.min(loopStart, Math.max(groups.length - 1, 0)) : 0
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey)
    const playedSoFar = groups.slice(0, startIndex).reduce((sum, g) => sum + g.events.length, 0)
    setPlayedCount(playedSoFar)
    setIsComplete(false)
    setActiveMidis(new Set(groups[startIndex]?.events.map((e) => e.midi) ?? []))
  }

  // The hot-path refs can't be written during render, so they're reset in a
  // small effect keyed to the same condition.
  useEffect(() => {
    groupIndexRef.current = startIndex
    elapsedRef.current = groups[startIndex]?.startSec ?? 0
    satisfiedRef.current = new Set()
    lastFrameRef.current = null
    // startIndex intentionally excluded: it's derived from resetKey's own
    // inputs, so re-including it here would re-run this for every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, groups])

  /** Shared by "chord fully hit" and "chord expired" — moves to the next group. */
  const advanceGroup = useCallback(() => {
    const clampedLoopEnd = Math.min(loopEnd, groups.length - 1)
    const atLoopEnd = loopEnabled && groupIndexRef.current === clampedLoopEnd

    if (atLoopEnd) {
      groupIndexRef.current = loopStart
      elapsedRef.current = groups[loopStart]?.startSec ?? 0
      lastFrameRef.current = null // avoid a time jump on the next frame
    } else {
      groupIndexRef.current += 1
    }

    satisfiedRef.current = new Set()
    const playedSoFar = groups.slice(0, groupIndexRef.current).reduce((sum, g) => sum + g.events.length, 0)
    setPlayedCount(playedSoFar)
    setActiveMidis(new Set(groups[groupIndexRef.current]?.events.map((e) => e.midi) ?? []))
    if (!atLoopEnd && groupIndexRef.current >= groups.length) setIsComplete(true)
  }, [groups, loopEnabled, loopStart, loopEnd])

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
          if (pending && elapsedRef.current >= pending.startSec) {
            onAutoPlay?.(pending.events)
            advanceGroup()
          }
        }
      }
      lastFrameRef.current = now
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [enabled, groups, style, advanceGroup, onAutoPlay])

  /**
   * Call when the user plays a note in Wait Mode. Returns the matched event
   * (so the caller can use its `hand` for the ignition color), or null if
   * the note wasn't part of the currently pending group. In Auto Mode the
   * hook already advances itself, so this is a no-op — presses are free
   * play and don't affect the song.
   */
  const registerNotePress = useCallback(
    (midi: number): TimedNoteEvent | null => {
      if (style === "auto") return null

      const currentGroup = groups[groupIndexRef.current]
      if (!currentGroup) return null

      const match = currentGroup.events.find((e) => e.midi === midi)
      if (!match || satisfiedRef.current.has(midi)) return null

      satisfiedRef.current.add(midi)

      if (satisfiedRef.current.size < currentGroup.events.length) {
        // Chord not fully cleared yet — stay on this group, just narrow the highlight.
        setActiveMidis(new Set(currentGroup.events.map((e) => e.midi).filter((m) => !satisfiedRef.current.has(m))))
        return match
      }

      lastFrameRef.current = null // avoid a time jump on the next frame
      advanceGroup()
      return match
    },
    [groups, style, advanceGroup],
  )

  return {
    timedEvents,
    elapsedRef,
    playedCount,
    activeMidis,
    isComplete,
    registerNotePress,
    groupCount: groups.length,
  }
}
