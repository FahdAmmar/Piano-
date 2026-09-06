import { useEffect, useState } from "react"

export type MidiStatus = "unsupported" | "connecting" | "no-device" | "connected"

interface UseMidiInputParams {
  onNoteOn: (midi: number, velocity: number) => void
  onNoteOff: (midi: number) => void
  onSustainChange?: (isDown: boolean) => void
}

const NOTE_ON = 0x90
const NOTE_OFF = 0x80
const CONTROL_CHANGE = 0xb0
const SUSTAIN_CONTROLLER = 64
// The MIDI spec treats 0-63 as "off" and 64-127 as "on" for this controller.
const SUSTAIN_ON_THRESHOLD = 64

/**
 * Listens to every connected MIDI input (a real piano/keyboard controller)
 * and forwards note on/off and sustain-pedal messages — additive to
 * keyboard and touch input, not a replacement. Devices that use a
 * velocity==0 "note on" as note-off are handled the same as an explicit
 * note-off status byte. A physical sustain pedal sends Control Change 64,
 * the standard MIDI convention regardless of manufacturer.
 */
function getInitialStatus(): MidiStatus {
  return typeof navigator.requestMIDIAccess === "function" ? "connecting" : "unsupported"
}

export function useMidiInput({ onNoteOn, onNoteOff, onSustainChange }: UseMidiInputParams) {
  const [status, setStatus] = useState<MidiStatus>(getInitialStatus)
  const [deviceName, setDeviceName] = useState<string | null>(null)

  useEffect(() => {
    if (typeof navigator.requestMIDIAccess !== "function") return

    let cancelled = false

    function handleMessage(event: MIDIMessageEvent) {
      const data = event.data
      if (!data || data.length < 3) return
      const command = data[0] & 0xf0
      const [, dataByte1, dataByte2] = data
      if (command === NOTE_ON && dataByte2 > 0) {
        onNoteOn(dataByte1, dataByte2)
      } else if (command === NOTE_OFF || command === NOTE_ON) {
        onNoteOff(dataByte1)
      } else if (command === CONTROL_CHANGE && dataByte1 === SUSTAIN_CONTROLLER) {
        onSustainChange?.(dataByte2 >= SUSTAIN_ON_THRESHOLD)
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
  }, [onNoteOn, onNoteOff, onSustainChange])

  return { status, deviceName }
}
