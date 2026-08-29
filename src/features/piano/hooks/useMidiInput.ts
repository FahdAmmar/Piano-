import { useEffect, useState } from "react"

export type MidiStatus = "unsupported" | "connecting" | "no-device" | "connected"

interface UseMidiInputParams {
  onNoteOn: (midi: number, velocity: number) => void
  onNoteOff: (midi: number) => void
}

const NOTE_ON = 0x90
const NOTE_OFF = 0x80

/**
 * Listens to every connected MIDI input (a real piano/keyboard controller)
 * and forwards note on/off messages — additive to keyboard and touch input,
 * not a replacement. Devices that use a velocity==0 "note on" as note-off
 * are handled the same as an explicit note-off status byte.
 */
function getInitialStatus(): MidiStatus {
  return typeof navigator.requestMIDIAccess === "function" ? "connecting" : "unsupported"
}

export function useMidiInput({ onNoteOn, onNoteOff }: UseMidiInputParams) {
  const [status, setStatus] = useState<MidiStatus>(getInitialStatus)
  const [deviceName, setDeviceName] = useState<string | null>(null)

  useEffect(() => {
    if (typeof navigator.requestMIDIAccess !== "function") return

    let cancelled = false

    function handleMessage(event: MIDIMessageEvent) {
      const data = event.data
      if (!data || data.length < 3) return
      const command = data[0] & 0xf0
      const [, note, velocity] = data
      if (command === NOTE_ON && velocity > 0) {
        onNoteOn(note, velocity)
      } else if (command === NOTE_OFF || command === NOTE_ON) {
        onNoteOff(note)
      }
    }

    function attach(access: MIDIAccess) {
      const inputs = [...access.inputs.values()]
      for (const input of inputs) input.onmidimessage = handleMessage
      if (cancelled) return
      setStatus(inputs.length > 0 ? "connected" : "no-device")
      setDeviceName(inputs[0]?.name ?? null)
    }

    navigator
      .requestMIDIAccess()
      .then((access) => {
        if (cancelled) return
        attach(access)
        access.onstatechange = () => attach(access)
      })
      .catch(() => {
        if (!cancelled) setStatus("no-device")
      })

    return () => {
      cancelled = true
    }
  }, [onNoteOn, onNoteOff])

  return { status, deviceName }
}
