import { Upload } from "lucide-react"
import { useRef, useState } from "react"
import { MidiImportError, parseMidiFile } from "../../lib/midi-import"
import type { Song } from "../../types"

interface MidiImportButtonProps {
  onImported: (song: Song) => void
}

export function MidiImportButton({ onImported }: MidiImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = "" // allow re-selecting the same file later
    if (!file) return

    setIsImporting(true)
    setError(null)
    try {
      const song = await parseMidiFile(file)
      onImported(song)
    } catch (err) {
      setError(err instanceof MidiImportError ? err.message : "Couldn't read that file.")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isImporting}
        className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-60 sm:text-sm"
      >
        <Upload size={13} />
        {isImporting ? "Importing…" : "Import MIDI"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".mid,.midi,audio/midi"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Import a MIDI file"
      />
      {error && (
        <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border border-line bg-surface-raised px-3 py-2 text-xs text-ink shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}
