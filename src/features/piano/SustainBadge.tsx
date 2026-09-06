import { Footprints } from "lucide-react"

export function SustainBadge() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs text-violet shadow-lg">
      <Footprints size={14} />
      Sustain
    </div>
  )
}
