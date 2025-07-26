import React, { useEffect, useRef, useState } from 'react'

interface InteractiveClothProps {
  width?: number
  height?: number
  gridSize?: number
  springStrength?: number
  damping?: number
  className?: string
}

interface Point {
  x: number
  y: number
  oldX: number
  oldY: number
  pinned: boolean
}

export const InteractiveCloth: React.FC<InteractiveClothProps> = ({
  width = 300,
  height = 400,
  gridSize = 20,
  springStrength = 0.1,
  damping = 0.99,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0, isDown: false })
  const pointsRef = useRef<Point[][]>([])
  const [isInteracting, setIsInteracting] = useState(false)

  const cols = Math.floor(width / gridSize)
  const rows = Math.floor(height / gridSize)

  // Initialize points
  useEffect(() => {
    const points: Point[][] = []
    for (let y = 0; y < rows; y++) {
      points[y] = []
      for (let x = 0; x < cols; x++) {
        points[y][x] = {
          x: x * gridSize,
          y: y * gridSize,
          oldX: x * gridSize,
          oldY: y * gridSize,
          pinned: y === 0, // Pin the top row
        }
      }
    }
    pointsRef.current = points
  }, [cols, rows, gridSize])

  // Update physics
  const updatePhysics = () => {
    const points = pointsRef.current
    const mouse = mouseRef.current

    // Update points
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const point = points[y][x]
        if (point.pinned) continue

        // Store current position
        const currentX = point.x
        const currentY = point.y

        // Apply verlet integration
        point.x += (point.x - point.oldX) * damping
        point.y += (point.y - point.oldY) * damping

        // Add gravity
        point.y += 0.3

        // Mouse interaction
        if (mouse.isDown) {
          const dx = point.x - mouse.x
          const dy = point.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 50

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            point.x -= dx * force * 0.1
            point.y -= dy * force * 0.1
          }
        }

        // Store old position
        point.oldX = currentX
        point.oldY = currentY
      }
    }

    // Apply constraints (springs)
    for (let iteration = 0; iteration < 3; iteration++) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const point = points[y][x]

          // Horizontal constraint
          if (x < cols - 1) {
            const nextPoint = points[y][x + 1]
            const dx = nextPoint.x - point.x
            const dy = nextPoint.y - point.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const restLength = gridSize
            const difference = (restLength - distance) / distance / 2

            if (!point.pinned) {
              point.x -= dx * difference * springStrength
              point.y -= dy * difference * springStrength
            }
            if (!nextPoint.pinned) {
              nextPoint.x += dx * difference * springStrength
              nextPoint.y += dy * difference * springStrength
            }
          }

          // Vertical constraint
          if (y < rows - 1) {
            const nextPoint = points[y + 1][x]
            const dx = nextPoint.x - point.x
            const dy = nextPoint.y - point.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const restLength = gridSize
            const difference = (restLength - distance) / distance / 2

            if (!point.pinned) {
              point.x -= dx * difference * springStrength
              point.y -= dy * difference * springStrength
            }
            if (!nextPoint.pinned) {
              nextPoint.x += dx * difference * springStrength
              nextPoint.y += dy * difference * springStrength
            }
          }
        }
      }
    }
  }

  // Render the cloth
  const render = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const points = pointsRef.current

    // Draw grid lines
    ctx.strokeStyle = isInteracting ? 'rgba(22, 96, 136, 0.8)' : 'rgba(22, 96, 136, 0.4)'
    ctx.lineWidth = 1

    // Horizontal lines
    for (let y = 0; y < rows; y++) {
      ctx.beginPath()
      for (let x = 0; x < cols; x++) {
        const point = points[y][x]
        if (x === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      }
      ctx.stroke()
    }

    // Vertical lines
    for (let x = 0; x < cols; x++) {
      ctx.beginPath()
      for (let y = 0; y < rows; y++) {
        const point = points[y][x]
        if (y === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      }
      ctx.stroke()
    }

    // Draw points
    ctx.fillStyle = isInteracting ? 'rgba(22, 96, 136, 1)' : 'rgba(22, 96, 136, 0.6)'
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const point = points[y][x]
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.pinned ? 3 : 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // Animation loop
  const animate = () => {
    updatePhysics()
    render()
    animationRef.current = requestAnimationFrame(animate)
  }

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isDown: true,
    }
    setIsInteracting(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    mouseRef.current.x = e.clientX - rect.left
    mouseRef.current.y = e.clientY - rect.top
  }

  const handleMouseUp = () => {
    mouseRef.current.isDown = false
    setIsInteracting(false)
  }

  const handleMouseLeave = () => {
    mouseRef.current.isDown = false
    setIsInteracting(false)
  }

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative ${className}`} style={{ zIndex: 20 }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="cursor-pointer transition-all duration-300 hover:shadow-lg pointer-events-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: 'transparent',
          position: 'relative',
          zIndex: 20,
        }}
      />
      <div className="absolute top-2 left-2 text-xs text-hyve-text/50 pointer-events-none">
        {isInteracting ? 'Interacting...' : 'Click and drag to deform'}
      </div>
    </div>
  )
} 