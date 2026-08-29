export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number // 1 = just born, 0 = dead
  color: string
  size: number
}

const PARTICLE_COUNT = 10
const GRAVITY = 90
const DECAY_PER_SEC = 1.6

export function createIgnitionBurst(x: number, y: number, color: string): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Fan the sparks upward in a half-circle, with a little randomness so
    // repeated hits on the same key don't look identical.
    const angle = (Math.PI / PARTICLE_COUNT) * i - Math.PI / 2 + (Math.random() - 0.5) * 0.6
    const speed = 60 + Math.random() * 80
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 20,
      life: 1,
      color,
      size: 2 + Math.random() * 2,
    })
  }
  return particles
}

export function updateParticles(particles: Particle[], deltaSec: number): Particle[] {
  return particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx * deltaSec,
      y: p.y + p.vy * deltaSec,
      vy: p.vy + GRAVITY * deltaSec,
      life: p.life - deltaSec * DECAY_PER_SEC,
    }))
    .filter((p) => p.life > 0)
}
