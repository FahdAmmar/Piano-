import type { Song } from "../../types"

interface SongPickerProps {
  songs: Song[]
  selectedId: string
  onChange: (id: string) => void
}

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  "two-hands": "Two Hands",
  imported: "Your Imports",
} as const

export function SongPicker({ songs, selectedId, onChange }: SongPickerProps) {
  return (
    <select
      value={selectedId}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Choose a song to practice"
      className="max-w-[55%] truncate rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember sm:max-w-none sm:text-sm"
    >
      {(Object.keys(DIFFICULTY_LABEL) as Array<keyof typeof DIFFICULTY_LABEL>).map((difficulty) => {
        const songsInGroup = songs.filter((song) => song.difficulty === difficulty)
        if (songsInGroup.length === 0) return null
        return (
          <optgroup key={difficulty} label={DIFFICULTY_LABEL[difficulty]}>
            {songsInGroup.map((song) => (
              <option key={song.id} value={song.id}>
                {song.title}
              </option>
            ))}
          </optgroup>
        )
      })}
    </select>
  )
}
