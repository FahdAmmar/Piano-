import type { Song } from "../../types"
import type { SongProgress } from "../../lib/practice-progress-storage"

interface SongPickerProps {
  songs: Song[]
  selectedId: string
  onChange: (id: string) => void
  progress?: Record<string, SongProgress>
}

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  "two-hands": "Two Hands",
  imported: "Your Imports",
} as const

export function SongPicker({ songs, selectedId, onChange, progress }: SongPickerProps) {
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
            {songsInGroup.map((song) => {
              const songProgress = progress?.[song.id]
              const suffix = songProgress?.completed
                ? songProgress.bestAccuracy !== null
                  ? ` ✓ ${songProgress.bestAccuracy}%`
                  : " ✓"
                : ""
              return (
                <option key={song.id} value={song.id}>
                  {song.title}
                  {suffix}
                </option>
              )
            })}
          </optgroup>
        )
      })}
    </select>
  )
}
