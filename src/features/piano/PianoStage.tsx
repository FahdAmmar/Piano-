import { MidiPort } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { SONGS } from "../../data/songs"
import { DEFAULT_BASE_MIDI, MAX_BASE_MIDI, MIN_BASE_MIDI } from "../../lib/keyboard-map"
import { PianoAudioEngine } from "../../lib/piano-audio"
import { midiToLabel } from "../../lib/note-utils"
import type { Hand, PlaybackMode, Song, SongPlayStyle } from "../../types"
import { useKeyboardInput } from "./hooks/useKeyboardInput"
import { useMidiInput } from "./hooks/useMidiInput"
import { useSongPlayback } from "./hooks/useSongPlayback"
import { MidiImportButton } from "./MidiImportButton"
import { NoteLane, type NoteLaneHandle } from "./NoteLane"
import { PianoKeyboard } from "./PianoKeyboard"
import { SongPicker } from "./SongPicker"
import { SongStyleToggle } from "./SongStyleToggle"

const PIXELS_PER_SECOND = 140

type LoadState = "loading" | "ready" | "error"

interface PianoStageProps {
  mode: PlaybackMode
}

export function PianoStage({ mode }: PianoStageProps) {
  const audioEngineRef = useRef<PianoAudioEngine | null>(null)
  const noteLaneRef = useRef<NoteLaneHandle>(null)
  const [loadState, setLoadState] = useState<LoadState>("loading")
  const [pressedMidi, setPressedMidi] = useState<ReadonlySet<number>>(new Set())
  const [baseMidi, setBaseMidi] = useState(DEFAULT_BASE_MIDI)
  const [selectedSongId, setSelectedSongId] = useState(SONGS[0].id)
  const [songStyle, setSongStyle] = useState<SongPlayStyle>("wait")
  const [importedSongs, setImportedSongs] = useState<Song[]>([])

  const allSongs = [...SONGS, ...importedSongs]
  const song = allSongs.find((s) => s.id === selectedSongId) ?? SONGS[0]
  const songPlayback = useSongPlayback({ song, enabled: mode === "song", style: songStyle })

  const handleSongImported = useCallback((imported: Song) => {
    setImportedSongs((prev) => [...prev, imported])
    setSelectedSongId(imported.id)
  }, [])

  // The audio engine owns a real AudioContext, so it's created once and torn
  // down on unmount rather than being recreated on every render.
  useEffect(() => {
    const engine = new PianoAudioEngine()
    audioEngineRef.current = engine
    engine.ready
      .then(() => setLoadState("ready"))
      .catch(() => setLoadState("error"))
    return () => {
      engine.dispose()
      audioEngineRef.current = null
    }
  }, [])

  // Reset the pressed-keys highlight synchronously when the mode changes,
  // instead of in an effect, so there's no extra render/flicker in between.
  const [prevMode, setPrevMode] = useState(mode)
  if (prevMode !== mode) {
    setPrevMode(mode)
    setPressedMidi(new Set())
  }

  // Switching modes mid-note would otherwise leave a note stuck ringing —
  // this is a real side effect (talking to the AudioContext), so it stays here.
  useEffect(() => {
    audioEngineRef.current?.stopAll()
  }, [mode])

  const handleNoteOn = useCallback(
    (midi: number, inputHand: Hand = "right", velocity = 90) => {
      setPressedMidi((prev) => {
        if (prev.has(midi)) return prev
        const next = new Set(prev)
        next.add(midi)
        return next
      })
      audioEngineRef.current?.resumeAndPlay(midi, velocity)

      // In song mode, color the ignition by which hand's part this note
      // belongs to (right = ember, left = violet) rather than the input
      // source's guess, so two-hand pieces read correctly.
      let igniteHand = inputHand
      if (mode === "song") {
        const matched = songPlayback.registerNotePress(midi)
        if (matched) igniteHand = matched.hand
      }
      noteLaneRef.current?.ignite(midi, igniteHand)
    },
    [mode, songPlayback],
  )

  const handleNoteOff = useCallback((midi: number) => {
    setPressedMidi((prev) => {
      if (!prev.has(midi)) return prev
      const next = new Set(prev)
      next.delete(midi)
      return next
    })
    audioEngineRef.current?.release(midi)
  }, [])

  const handleShiftOctave = useCallback((direction: 1 | -1) => {
    setBaseMidi((prev) => Math.min(MAX_BASE_MIDI, Math.max(MIN_BASE_MIDI, prev + direction * 12)))
  }, [])

  useKeyboardInput({ baseMidi, onNoteOn: handleNoteOn, onNoteOff: handleNoteOff, onShiftOctave: handleShiftOctave })
  const handleMidiNoteOn = useCallback(
    (midi: number, velocity: number) => handleNoteOn(midi, "right", velocity),
    [handleNoteOn],
  )
  const midi = useMidiInput({ onNoteOn: handleMidiNoteOn, onNoteOff: handleNoteOff })

  const activeMidis = mode === "song" ? songPlayback.activeMidis : undefined
  const nextLabels = activeMidis ? [...activeMidis].map(midiToLabel).sort().join(" + ") : ""

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      {loadState !== "ready" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-base/90 px-6 text-center text-ink-muted">
          {loadState === "loading" ? "Loading the piano…" : "Couldn't load the piano sound. Please refresh the page."}
        </div>
      )}

      {midi.status === "connected" && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted shadow-lg sm:right-6">
          <MidiPort size={14} className="text-ember" />
          {midi.deviceName ?? "MIDI keyboard"} connected
        </div>
      )}

      {mode === "song" && songPlayback.isComplete && (
        <div className="absolute inset-x-0 top-4 z-10 mx-auto w-fit rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-ink shadow-lg">
          {songStyle === "wait"
            ? "Nicely played — that's the whole piece."
            : `Complete — ${songPlayback.accuracy}% accuracy (${songPlayback.hitCount}/${songPlayback.hitCount + songPlayback.missCount} notes)`}
        </div>
      )}

      <div className="relative flex-1">
        <NoteLane
          ref={noteLaneRef}
          timedEvents={songPlayback.timedEvents}
          elapsedRef={songPlayback.elapsedRef}
          playedIndex={mode === "song" ? songPlayback.playedCount : songPlayback.timedEvents.length}
          pressedMidi={pressedMidi}
          pixelsPerSecond={PIXELS_PER_SECOND}
        />
      </div>

      {mode === "song" && (
        <div className="flex flex-col gap-1 px-4 pb-1 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <SongPicker songs={allSongs} selectedId={selectedSongId} onChange={setSelectedSongId} />
            <SongStyleToggle style={songStyle} onChange={setSongStyle} />
            <MidiImportButton onImported={handleSongImported} />
          </div>
          <span className="shrink-0">
            {songPlayback.playedCount} / {songPlayback.timedEvents.length} notes
            {songStyle === "scroll" && songPlayback.accuracy !== null ? ` · ${songPlayback.accuracy}% accuracy` : ""}
            {nextLabels ? ` · next: ${nextLabels}` : ""}
          </span>
        </div>
      )}

      <div className="h-32 shrink-0 overflow-x-auto sm:h-40 md:h-48">
        <div className="h-full min-w-[1400px]">
          <PianoKeyboard
            pressedMidi={pressedMidi}
            activeMidis={activeMidis}
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
          />
        </div>
      </div>
    </main>
  )
}
