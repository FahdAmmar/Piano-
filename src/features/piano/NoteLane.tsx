import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { KEY_LAYOUT_MAP } from "../../lib/note-utils"
import type { Hand, TimedNoteEvent } from "../../types"
import { createIgnitionBurst, updateParticles, type Particle } from "./engine/particles"

interface NoteLaneProps {
  timedEvents: TimedNoteEvent[]
  elapsedRef: React.RefObject<number>
  /** Events before this index are treated as already played and are not drawn. */
  playedIndex: number
  pressedMidi: ReadonlySet<number>
  pixelsPerSecond: number
}

export interface NoteLaneHandle {
  ignite: (midi: number, hand: Hand) => void
}

const HAND_COLOR: Record<Hand, string> = {
  right: "#f2a65a",
  left: "#7c6cf0",
}

export const NoteLane = forwardRef<NoteLaneHandle, NoteLaneProps>(function NoteLane(
  { timedEvents, elapsedRef, playedIndex, pressedMidi, pixelsPerSecond },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const pressedRef = useRef(pressedMidi)
  const sizeRef = useRef({ width: 0, height: 0 })
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    pressedRef.current = pressedMidi
  }, [pressedMidi])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      ignite(midi, hand) {
        if (reducedMotionRef.current) return
        const layout = keyGeometry(midi, sizeRef.current.width)
        if (!layout) return
        particlesRef.current.push(...createIgnitionBurst(layout.centerX, sizeRef.current.height, HAND_COLOR[hand]))
      },
    }),
    [],
  )

  // Keep the canvas's pixel buffer matched to its rendered size and DPR.
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { width: rect.width, height: rect.height }
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    let frameId: number
    let lastTime: number | null = null

    const draw = (now: number) => {
      const deltaSec = lastTime === null ? 0 : (now - lastTime) / 1000
      lastTime = now
      const { width, height } = sizeRef.current
      ctx.clearRect(0, 0, width, height)

      const elapsed = elapsedRef.current
      timedEvents.forEach((event, index) => {
        if (index < playedIndex) return
        const bottom = height - (event.startSec - elapsed) * pixelsPerSecond
        const blockHeight = event.durationSec * pixelsPerSecond
        const top = bottom - blockHeight
        if (top > height || bottom < 0) return

        const geometry = keyGeometry(event.midi, width)
        if (!geometry) return
        drawBlock(ctx, geometry.x, top, geometry.width, blockHeight, HAND_COLOR[event.hand])
      })

      drawIgnitionLine(ctx, width, height)

      if (!reducedMotionRef.current) {
        pressedRef.current.forEach((midi) => {
          const geometry = keyGeometry(midi, width)
          if (geometry) drawGlowColumn(ctx, geometry.x, geometry.width, height)
        })
      }

      particlesRef.current = updateParticles(particlesRef.current, deltaSec)
      drawParticles(ctx, particlesRef.current)

      frameId = requestAnimationFrame(draw)
    }

    frameId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameId)
  }, [timedEvents, elapsedRef, playedIndex, pixelsPerSecond])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
})

function keyGeometry(midi: number, containerWidth: number) {
  const layout = KEY_LAYOUT_MAP.get(midi)
  if (!layout) return null
  const x = layout.leftFraction * containerWidth
  const width = layout.widthFraction * containerWidth
  return { x, width, centerX: x + width / 2 }
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) {
  const radius = Math.min(6, width / 3, Math.max(height, 1) / 2)
  ctx.save()
  ctx.shadowColor = color
  ctx.shadowBlur = 12
  ctx.fillStyle = color
  roundedRect(ctx, x + 1, y, Math.max(width - 2, 1), Math.max(height, 1), radius)
  ctx.fill()
  ctx.restore()
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawIgnitionLine(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, height - 2, 0, height)
  gradient.addColorStop(0, "rgba(242, 166, 90, 0)")
  gradient.addColorStop(1, "rgba(242, 166, 90, 0.55)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, height - 3, width, 3)
}

function drawGlowColumn(ctx: CanvasRenderingContext2D, x: number, width: number, height: number) {
  const columnHeight = 90
  const gradient = ctx.createLinearGradient(0, height, 0, height - columnHeight)
  gradient.addColorStop(0, "rgba(242, 166, 90, 0.35)")
  gradient.addColorStop(1, "rgba(242, 166, 90, 0)")
  ctx.fillStyle = gradient
  ctx.fillRect(x, height - columnHeight, width, columnHeight)
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(p.life, 0)
    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
}
