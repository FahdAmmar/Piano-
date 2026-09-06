export interface SongProgress {
  completed: boolean
  /** Best Scroll Mode accuracy achieved (0-100), or null if never scored. */
  bestAccuracy: number | null
}

type ProgressMap = Record<string, SongProgress>

const STORAGE_KEY = "nocturne-practice-progress"

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    return typeof parsed === "object" && parsed !== null ? (parsed as ProgressMap) : {}
  } catch {
    return {} // corrupted or unavailable (e.g. private browsing) — start fresh
  }
}

function saveProgress(progress: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // storage full or unavailable — progress just won't persist this session
  }
}

/** Marks a song as completed and, in Scroll Mode, keeps the best accuracy seen. */
export function recordCompletion(songId: string, accuracy: number | null): ProgressMap {
  const current = loadProgress()
  const existing = current[songId]
  const bestAccuracy =
    accuracy === null ? (existing?.bestAccuracy ?? null) : Math.max(existing?.bestAccuracy ?? 0, accuracy)
  const next: ProgressMap = { ...current, [songId]: { completed: true, bestAccuracy } }
  saveProgress(next)
  return next
}
