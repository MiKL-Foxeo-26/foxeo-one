'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const LAB_COLORS = ['#a855f7', '#8b5cf6', '#7c3aed']
const ONE_COLORS = ['#22c55e', '#f97316', '#fbbf24']

export function GraduationConfetti() {
  useEffect(() => {
    const duration = 4 * 1000
    const end = Date.now() + duration
    let animationId: number | null = null

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: LAB_COLORS,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ONE_COLORS,
      })

      if (Date.now() < end) {
        animationId = requestAnimationFrame(frame)
      }
    }

    frame()

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return null
}
