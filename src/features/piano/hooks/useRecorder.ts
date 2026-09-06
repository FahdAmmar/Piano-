import { useCallback, useRef, useState } from "react"
import type { RecordedNote } from "../../../lib/midi-export"

export type RecorderStatus = "idle" | "recording" | "done"

/**
 * Captures played notes with real timestamps while recording is active, so
 * they can be exported as a .mid file afterwards. noteOn/noteOff are cheap
 * no-ops when not recording, so callers can wire them in unconditionally.
 * Uses a status ref alongside the status state so the stable (empty-deps)
 * callbacks always see the current value, not a stale closure.
 */
export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle")
  const statusRef = useRef<RecorderStatus>("idle")
  const startTimeRef = useRef(0)
  const openNotesRef = useRef<Map<number, number>>(new Map())
  const notesRef = useRef<RecordedNote[]>([])
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([])

  const start = useCallback(() => {
    startTimeRef.current = performance.now()
    openNotesRef.current = new Map()
    notesRef.current = []
    statusRef.current = "recording"
    setStatus("recording")
    setRecordedNotes([])
  }, [])

  const stop = useCallback(() => {
    const nowSec = (performance.now() - startTimeRef.current) / 1000
    // Close out any notes still held at the moment recording stops.
    openNotesRef.current.forEach((startSec, midi) => {
      notesRef.current.push({ midi, startSec, durationSec: Math.max(nowSec - startSec, 0.05) })
    })
    openNotesRef.current.clear()
    statusRef.current = "done"
    setStatus("done")
    setRecordedNotes([...notesRef.current].sort((a, b) => a.startSec - b.startSec))
  }, [])

  const discard = useCallback(() => {
    statusRef.current = "idle"
    setStatus("idle")
    setRecordedNotes([])
  }, [])

  const noteOn = useCallback((midi: number) => {
    if (statusRef.current !== "recording" || openNotesRef.current.has(midi)) return
    openNotesRef.current.set(midi, (performance.now() - startTimeRef.current) / 1000)
  }, [])

  const noteOff = useCallback((midi: number) => {
    if (statusRef.current !== "recording") return
    const startSec = openNotesRef.current.get(midi)
    if (startSec === undefined) return
    openNotesRef.current.delete(midi)
    const nowSec = (performance.now() - startTimeRef.current) / 1000
    notesRef.current.push({ midi, startSec, durationSec: Math.max(nowSec - startSec, 0.05) })
  }, [])

  return { status, recordedNotes, start, stop, discard, noteOn, noteOff }
}
