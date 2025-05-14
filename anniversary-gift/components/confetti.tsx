"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

export function Confetti() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      // More elaborate confetti effect
      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Confetti from multiple angles
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#e11d48", "#be185d", "#db2777", "#ec4899", "#f472b6"],
        })

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#e11d48", "#be185d", "#db2777", "#ec4899", "#f472b6"],
        })

        // Add some stars and hearts
        if (Math.random() > 0.75) {
          confetti({
            ...defaults,
            particleCount: 10,
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            origin: { x: randomInRange(0.4, 0.6), y: randomInRange(0.4, 0.6) },
            shapes: ["star"],
            colors: ["#f9a8d4", "#f472b6", "#ec4899"],
          })
        }
      }, 250)
    }
  }, [])

  if (!isClient) return null

  return null
}
