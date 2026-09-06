import type { Song } from "../types"

const STORAGE_KEY = "nocturne-imported-songs"
const MAX_STORED = 20 // keep this from growing unbounded across many imports

export function loadImportedSongs(): Song[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Song[]) : []
  } catch {
    return [] // corrupted or unavailable (e.g. private browsing) — start fresh
  }
}

export function saveImportedSongs(songs: Song[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs.slice(-MAX_STORED)))
  } catch {
    // storage full or unavailable — import still works for this session, just won't persist
  }
}
