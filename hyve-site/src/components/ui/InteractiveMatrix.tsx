import React, { useEffect, useRef, useState } from 'react'

interface InteractiveMatrixProps {
  width?: number
  height?: number
  className?: string
}

interface Point {
  x: number
  y: number
  z: number
  originalY: number
  velocity: number
  physicsOffset: number
}

export const InteractiveMatrix: React.FC<InteractiveMatrixProps> = ({
  width = 350,
  height = 380,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const pointsRef = useRef<Point[][]>([])
  const [isInteracting, setIsInteracting] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0 })

  const gridSize = 10 // 10x10 grid
  const padding = 100 // Add padding to prevent clipping
  const actualWidth = width + padding * 2
  const actualHeight = height + padding * 2
  const cellWidth = width / gridSize
  const cellHeight = height / gridSize

  // Initialize points with curvature
  useEffect(() => {
    const points: Point[][] = []
    const centerX = gridSize / 2
    const centerY = gridSize / 2
    const maxCurve = 60 // Maximum curvature depth - increased for more dramatic effect

    for (let y = 0; y < gridSize; y++) {
      points[y] = []
      for (let x = 0; x < gridSize; x++) {
        const posX = x * cellWidth + cellWidth / 2 + padding
        const posY = y * cellHeight + cellHeight / 2 + padding

        // Calculate distance from center for curvature effect
        const dx = (x - centerX) / centerX
        const dy = (y - centerY) / centerY

        // Create primary wave-like curvature
        const curvatureX = Math.sin(dx * Math.PI * 0.7) * maxCurve
        const curvatureY = Math.cos(dy * Math.PI * 0.5) * maxCurve * 0.8

        // Add secondary curvature for more dramatic effect
        const secondaryCurve = Math.sin((x + y) * 0.3) * 15

        // Combine curvatures for a more complex shape
        const totalCurvature = (curvatureX + curvatureY) * 0.6 + secondaryCurve

        points[y][x] = {
          x: posX + curvatureX * 0.3, // Slight horizontal displacement
          y: posY + totalCurvature,
          z: totalCurvature, // Store depth for visual effects
          originalY: posY + totalCurvature,
          velocity: 0,
          physicsOffset: 0,
        }
      }
    }
    pointsRef.current = points
  }, [cellWidth, cellHeight, padding])

  // Update physics (similar to background mesh)
  const updatePhysics = () => {
    const points = pointsRef.current
    const springStrength = 0.035
    const damping = 0.85
    const minVelocity = 0.001
    const minDistance = 0.002

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const point = points[y][x]

        // Update physics if active
        if (
          Math.abs(point.velocity) >= minVelocity ||
          Math.abs(point.physicsOffset) >= minDistance
        ) {
          // Physics targets 0 offset (spring back)
          const currentOffset = point.physicsOffset
          const targetOffset = 0
          const distance = targetOffset - currentOffset

          // Apply spring force
          const springForce = distance * springStrength
          point.velocity = (point.velocity + springForce) * damping

          // Update physics offset
          point.physicsOffset += point.velocity

          // Update Y position and maintain curvature
          point.y = point.originalY + point.physicsOffset
          // Update z-depth based on physics
          point.z = Math.max(0, point.z + point.physicsOffset * 0.3)
        } else {
          // Reset when settled
          point.physicsOffset = 0
          point.velocity = 0
          point.y = point.originalY
          // Restore original z-depth
          const centerX = gridSize / 2
          const centerY = gridSize / 2
          const gridX = Math.floor(point.x / cellWidth)
          const gridY = Math.floor(point.y / cellHeight)
          const dx = (gridX - centerX) / centerX
          const dy = (gridY - centerY) / centerY
          const curvatureX = Math.sin(dx * Math.PI * 0.7) * 60
          const curvatureY = Math.cos(dy * Math.PI * 0.5) * 60 * 0.8
          const secondaryCurve = Math.sin((gridX + gridY) * 0.3) * 15
          point.z = (curvatureX + curvatureY) * 0.6 + secondaryCurve
        }
      }
    }
  }

  // Handle click interaction
  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Find clicked grid cell (account for padding)
    const gridX = Math.floor((clickX - padding) / cellWidth)
    const gridY = Math.floor((clickY - padding) / cellHeight)

    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      const points = pointsRef.current

      // Apply depression effect to nearby points
      const influenceRadius = 3 // Affect points within 3 grid squares
      const pushDownDistance = 20

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const point = points[y][x]
          const dx = x - gridX
          const dy = y - gridY
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance <= influenceRadius) {
            // Bell-shaped falloff
            const normalizedDistance = distance / influenceRadius
            const bellCurve = Math.exp(-(normalizedDistance * normalizedDistance) * 6)

            // Apply downward velocity
            point.velocity = -pushDownDistance * bellCurve * 0.5
          }
        }
      }

      setIsInteracting(true)
      setTimeout(() => setIsInteracting(false), 500)
    }
  }

  // Handle mouse move for hover effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  // Render
  const render = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, actualWidth, actualHeight)

    const points = pointsRef.current
    const mouse = mouseRef.current

    // Draw grid lines with perspective
    // Horizontal lines
    for (let y = 0; y < gridSize; y++) {
      ctx.beginPath()
      for (let x = 0; x < gridSize; x++) {
        const point = points[y][x]
        const nextPoint = x < gridSize - 1 ? points[y][x + 1] : null

        if (nextPoint) {
          // Calculate line opacity based on depth
          const avgZ = (point.z + nextPoint.z) / 2
          const depthFactor = 1 - (avgZ / 80) * 0.4 // Adjusted for increased curvature
          ctx.strokeStyle = `rgba(22, 96, 136, ${0.3 * depthFactor})`
          ctx.lineWidth = 0.5 + depthFactor * 0.5

          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(nextPoint.x, nextPoint.y)
          ctx.stroke()
        }
      }
    }

    // Vertical lines
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize - 1; y++) {
        const point = points[y][x]
        const nextPoint = points[y + 1][x]

        // Calculate line opacity based on depth
        const avgZ = (point.z + nextPoint.z) / 2
        const depthFactor = 1 - (avgZ / 80) * 0.4
        ctx.strokeStyle = `rgba(22, 96, 136, ${0.3 * depthFactor})`
        ctx.lineWidth = 0.5 + depthFactor * 0.5

        ctx.beginPath()
        ctx.moveTo(point.x, point.y)
        ctx.lineTo(nextPoint.x, nextPoint.y)
        ctx.stroke()
      }
    }

    // Draw filled grid cells (between the points)
    for (let y = 0; y < gridSize - 1; y++) {
      for (let x = 0; x < gridSize - 1; x++) {
        // Get the four corners of each cell
        const topLeft = points[y][x]
        const topRight = points[y][x + 1]
        const bottomLeft = points[y + 1][x]
        const bottomRight = points[y + 1][x + 1]

        // Calculate average position for hover detection
        const centerX = (topLeft.x + topRight.x + bottomLeft.x + bottomRight.x) / 4
        const centerY = (topLeft.y + topRight.y + bottomLeft.y + bottomRight.y) / 4
        const avgZ = (topLeft.z + topRight.z + bottomLeft.z + bottomRight.z) / 4

        // Check hover state
        const dx = centerX - mouse.x
        const dy = centerY - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const isHovered = distance < 40

        // Calculate depth-based opacity
        const depthFactor = 1 - (avgZ / 80) * 0.5
        const cellOpacity = 0.1 + depthFactor * 0.2

        // Create path for the cell
        ctx.beginPath()
        ctx.moveTo(topLeft.x, topLeft.y)
        ctx.lineTo(topRight.x, topRight.y)
        ctx.lineTo(bottomRight.x, bottomRight.y)
        ctx.lineTo(bottomLeft.x, bottomLeft.y)
        ctx.closePath()

        // Fill the cell
        ctx.fillStyle = isHovered
          ? `rgba(22, 96, 136, ${0.3 + depthFactor * 0.2})`
          : `rgba(22, 96, 136, ${cellOpacity})`
        ctx.fill()

        // Draw cell border
        ctx.strokeStyle = `rgba(22, 96, 136, ${0.2 + depthFactor * 0.2})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    // Draw points on top
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const point = points[y][x]
        const depthFactor = 1 - (point.z / 80) * 0.5

        // Draw point
        ctx.fillStyle = `rgba(22, 96, 136, ${0.6 + depthFactor * 0.4})`
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw interaction indicator
    if (isInteracting) {
      ctx.fillStyle = 'rgba(22, 96, 136, 0.1)'
      ctx.fillRect(0, 0, width, height)
    }
  }

  // Animation loop
  const animate = () => {
    updatePhysics()
    render()
    animationRef.current = requestAnimationFrame(animate)
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
        width={actualWidth}
        height={actualHeight}
        className="cursor-pointer pointer-events-auto"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseRef.current = { x: -100, y: -100 }
        }}
        style={{
          width: `${actualWidth}px`,
          height: `${actualHeight}px`,
          marginLeft: `-${padding}px`,
          marginTop: `-${padding}px`,
          background: 'transparent',
          position: 'relative',
          zIndex: 20,
        }}
      />
    </div>
  )
}
