import { INSTRUMENTS, type InstrumentId } from "../../lib/piano-audio"

interface InstrumentPickerProps {
  value: InstrumentId
  onChange: (id: InstrumentId) => void
}

export function InstrumentPicker({ value, onChange }: InstrumentPickerProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as InstrumentId)}
      aria-label="Choose an instrument sound"
      className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted shadow-lg transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember sm:text-sm"
    >
      {INSTRUMENTS.map((instrument) => (
        <option key={instrument.id} value={instrument.id}>
          {instrument.label}
        </option>
      ))}
    </select>
  )
}
