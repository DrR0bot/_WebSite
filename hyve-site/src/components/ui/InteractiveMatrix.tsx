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
  const cellWidth = width / gridSize
  const cellHeight = height / gridSize
  
  // Initialize points
  useEffect(() => {
    const points: Point[][] = []
    for (let y = 0; y < gridSize; y++) {
      points[y] = []
      for (let x = 0; x < gridSize; x++) {
        const posX = x * cellWidth + cellWidth / 2
        const posY = y * cellHeight + cellHeight / 2
        points[y][x] = {
          x: posX,
          y: posY,
          z: 0,
          originalY: posY,
          velocity: 0,
          physicsOffset: 0,
        }
      }
    }
    pointsRef.current = points
  }, [cellWidth, cellHeight])
  
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
          
          // Update Y position
          point.y = point.originalY + point.physicsOffset
        } else {
          // Reset when settled
          point.physicsOffset = 0
          point.velocity = 0
          point.y = point.originalY
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
    
    // Find clicked grid cell
    const gridX = Math.floor(clickX / cellWidth)
    const gridY = Math.floor(clickY / cellHeight)
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      const points = pointsRef.current
      const clickedPoint = points[gridY][gridX]
      
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
    ctx.clearRect(0, 0, width, height)
    
    // Add subtle gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, 'rgba(244, 242, 243, 0.5)') // hyve-background
    gradient.addColorStop(1, 'rgba(205, 226, 231, 0.3)') // hyve-content
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    const points = pointsRef.current
    const mouse = mouseRef.current
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(22, 96, 136, 0.3)'
    ctx.lineWidth = 1
    
    // Horizontal lines
    for (let y = 0; y < gridSize; y++) {
      ctx.beginPath()
      for (let x = 0; x < gridSize; x++) {
        const point = points[y][x]
        if (x === 0) {
          ctx.moveTo(point.x - cellWidth/2, point.y)
        }
        ctx.lineTo(point.x + cellWidth/2, point.y)
      }
      ctx.stroke()
    }
    
    // Vertical lines
    for (let x = 0; x < gridSize; x++) {
      ctx.beginPath()
      for (let y = 0; y < gridSize; y++) {
        const point = points[y][x]
        if (y === 0) {
          ctx.moveTo(point.x, point.y - cellHeight/2)
        }
        ctx.lineTo(point.x, point.y + cellHeight/2)
      }
      ctx.stroke()
    }
    
    // Draw points
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const point = points[y][x]
        
        // Calculate distance from mouse for hover effect
        const dx = point.x - mouse.x
        const dy = point.originalY - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const isHovered = distance < 30
        
        // Draw point with glow effect
        if (isHovered || point.physicsOffset !== 0) {
          // Glow effect
          const glowSize = isHovered ? 15 : 10
          const glowGradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, glowSize
          )
          glowGradient.addColorStop(0, 'rgba(22, 96, 136, 0.3)')
          glowGradient.addColorStop(1, 'rgba(22, 96, 136, 0)')
          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(point.x, point.y, glowSize, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Draw main point
        ctx.fillStyle = isHovered ? 'rgba(22, 96, 136, 1)' : 'rgba(22, 96, 136, 0.6)'
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
        width={width}
        height={height}
        className="cursor-pointer transition-all duration-300 hover:shadow-xl pointer-events-auto"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseRef.current = { x: -100, y: -100 }
        }}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: 'transparent',
          position: 'relative',
          zIndex: 20,
        }}
      />
      <div className="absolute top-2 left-2 text-xs text-hyve-text/50 pointer-events-none">
        Haptic Matrix Demo - Click to interact
      </div>
    </div>
  )
} 