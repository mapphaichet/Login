"use client"

import { useEffect, useRef } from "react"

export function SnowAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create snowflakes with varying properties
    const snowflakes: {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      wind: number
    }[] = []

    const createSnowflakes = () => {
      const count = 200 // Increased count for more snow
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3.5 + 1, // Varied size range
          speed: Math.random() * 1.2 + 0.5, // Varied speed
          opacity: Math.random() * 0.8 + 0.2, // More varied opacity
          wind: Math.random() * 0.4 - 0.2, // Add slight wind effect
        })
      }
    }

    createSnowflakes()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw snowflakes
      snowflakes.forEach((flake) => {
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        // Update position with wind effect
        flake.y += flake.speed
        flake.x += flake.wind

        // Reset if snowflake reaches bottom or sides
        if (flake.y > canvas.height) {
          flake.y = -10
          flake.x = Math.random() * canvas.width
        }

        if (flake.x > canvas.width) {
          flake.x = 0
        } else if (flake.x < 0) {
          flake.x = canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />
}
