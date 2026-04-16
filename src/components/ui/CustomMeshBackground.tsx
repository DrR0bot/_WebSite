import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface CustomMeshBackgroundProps {
  enabled?: boolean
  className?: string
  children?: React.ReactNode
  vertexPointSize?: number
  rippleRadiusMultiplier?: number // Controls how many grid squares the ripple covers
  waveAmplitude?: number // Height of the wave effect
  waveFrequency?: number // How many waves across the grid
  waveSpeed?: number // Speed of wave animation
  streamlineCount?: number // Number of air flow streamlines
  streamlineOpacity?: number // Opacity of streamlines (0-1)
  streamlineSpeed?: number // Speed of streamline flow animation
  streamlineSpeedMultiplier?: number // Independent speed control for streamlines relative to mesh
  blur?: boolean // Whether to apply blur overlay for better content focus
  blurIntensity?: string // Blur intensity (e.g., 'sm', 'md', 'lg', 'xl')
}

interface PointData {
  x: number
  z: number
  index: number
}

// IMPORTANT: When updating Tailwind colors, update these RGB values:
// hyve.text (#3D4657) = RGB(0.239, 0.275, 0.341)
// hyve.background (#F4F2F3) = #F4F2F3
// hyve.content (#CDE2E7) = #CDE2E7
const HYVE_TEXT_RGB = { r: 0.239, g: 0.275, b: 0.341 } // #3D4657

/**
 * 🌐 CUSTOM MESH GRID BACKGROUND
 *
 * Creates a static perspective grid that extends to the horizon.
 * Beautiful, clean, and performant mesh background with click interaction.
 *
 * Features:
 * - Organized grid pattern
 * - Perspective view extending to horizon
 * - Hyve brand colors
 * - Click to highlight closest point
 * - Optimized performance
 */
export const CustomMeshBackground = ({
  enabled = true,
  className = '',
  children,
  vertexPointSize = 1.5,
  rippleRadiusMultiplier = 1.1, // Default: ripple covers 3 grid squares
  waveAmplitude = 0.3, // Gentle wave height
  waveFrequency = 0.3, // Frequency of waves across the grid
  waveSpeed = 0.4, // Speed of wave animation (reduced for calmer motion)
  streamlineCount = 12, // Number of air flow streamlines
  streamlineOpacity = 0.15, // Very subtle by default
  streamlineSpeed = 1.3, // Normal flow speed (reduced for calmer motion)
  streamlineSpeedMultiplier = 1.8, // Streamlines speed relative to mesh (reduced for calmer motion)
  blur = false,
  blurIntensity = 'sm',
}: CustomMeshBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    if (!enabled || !mountRef.current) return

    // Capture the current ref value for cleanup
    const currentMount = mountRef.current

    // Clear any existing content first
    while (currentMount.firstChild) {
      currentMount.removeChild(currentMount.firstChild)
    }

    // Match legacy Three.js r134 colour/rendering behaviour.
    // Newer Three.js enables sRGB colour management by default, which
    // shifts the mesh/fog tones. Disabling it + using linear output space
    // keeps the background visually identical to the previous CDN build.
    THREE.ColorManagement.enabled = false

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xcde2e7, 5, 50) // Add fog for depth with light content color

    // Get the actual container dimensions
    const container = mountRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    const camera = new THREE.PerspectiveCamera(60, containerWidth / containerHeight, 0.1, 100)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })

    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(containerWidth, containerHeight)

    // Style the canvas to enable clicks
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'auto'
    renderer.domElement.style.cursor = 'pointer'
    renderer.domElement.style.zIndex = '1' // Ensure canvas is above background but below content

    container.appendChild(renderer.domElement)

    // Create grid with lines
    const gridWidth = 120
    const gridDepth = 120
    const gridDivisions = 80 // Reduced from 150 for better performance

    // Create ONE big buffer for the grid
    const positions: number[] = []

    // Add horizontal line segments
    const gridYOffset = 7 // Lift the grid up by 2 units

    // ============ TOP HALF ANIMATION: Air Flow Streamlines ============
    // Create streamlines for wind tunnel-like air flow visualization
    const streamlines: any[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any
    const streamlineGroup = new THREE.Group()

    // Create streamlines at different heights
    for (let i = 0; i < streamlineCount; i++) {
      const y = 15 + (i / (streamlineCount - 1)) * 15 // Y: 15 to 30
      const phase = (i / streamlineCount) * Math.PI * 2 // Phase offset for variety

      // Create a curved path for the streamline
      const points = []
      const segments = 100

      for (let j = 0; j <= segments; j++) {
        const t = j / segments
        const x = -60 + t * 120 // Flow from left to right
        const z = Math.sin(t * Math.PI * 2 + phase) * 10 - 5 // Gentle sine wave
        const yOffset = Math.sin(t * Math.PI * 3 + phase * 0.5) * 2 // Vertical undulation
        points.push(new THREE.Vector3(x, y + yOffset, z))
      }

      const curve = new THREE.CatmullRomCurve3(points)

      // Create streamline geometry with gradient opacity
      const streamlineGeometry = new THREE.BufferGeometry()
      const streamlinePoints = curve.getPoints(200)
      const positions = new Float32Array(streamlinePoints.length * 3)
      const opacities = new Float32Array(streamlinePoints.length)

      streamlinePoints.forEach((point: any, idx: number) => {
        positions[idx * 3] = point.x
        positions[idx * 3 + 1] = point.y
        positions[idx * 3 + 2] = point.z

        // Fade in and out at edges
        const t = idx / (streamlinePoints.length - 1)
        const fadeIn = Math.min(t * 5, 1) // Quick fade in
        const fadeOut = Math.min((1 - t) * 5, 1) // Quick fade out
        opacities[idx] = fadeIn * fadeOut
      })

      streamlineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      streamlineGeometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1))

      // Create custom shader material for smooth gradient
      const streamlineMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          time: { value: 0 },
          baseOpacity: { value: streamlineOpacity }, // Configurable opacity
          color: { value: new THREE.Color(0x166088) },
        },
        vertexShader: `
          attribute float opacity;
          varying float vOpacity;
          varying float vX;
          uniform float time;
          
          void main() {
            vOpacity = opacity;
            vX = position.x;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float baseOpacity;
          uniform vec3 color;
          varying float vOpacity;
          varying float vX;
          
          void main() {
            // Create moving gradient effect
            float flow = sin((vX + time * 20.0) * 0.1) * 0.5 + 0.5;
            float finalOpacity = vOpacity * baseOpacity * (0.5 + flow * 0.5);
            gl_FragColor = vec4(color, finalOpacity);
          }
        `,
      })

      const streamline = new THREE.Line(streamlineGeometry, streamlineMaterial)
      streamlineGroup.add(streamline)

      streamlines.push({
        mesh: streamline,
        material: streamlineMaterial,
        curve: curve,
        phase: phase,
        speed: (0.5 + Math.random() * 0.3) * streamlineSpeed, // Varying speeds with multiplier
      })
    }

    scene.add(streamlineGroup)
    for (let i = 0; i <= gridDivisions; i++) {
      const z = (i / gridDivisions) * gridDepth - gridDepth / 2
      for (let j = 0; j < gridDivisions; j++) {
        const x0 = (j / gridDivisions) * gridWidth - gridWidth / 2
        const x1 = ((j + 1) / gridDivisions) * gridWidth - gridWidth / 2
        positions.push(x0, gridYOffset, z, x1, gridYOffset, z)
      }
    }

    // Add vertical line segments
    for (let j = 0; j <= gridDivisions; j++) {
      const x = (j / gridDivisions) * gridWidth - gridWidth / 2
      for (let i = 0; i < gridDivisions; i++) {
        const z0 = (i / gridDivisions) * gridDepth - gridDepth / 2
        const z1 = ((i + 1) / gridDivisions) * gridDepth - gridDepth / 2
        positions.push(x, gridYOffset, z0, x, gridYOffset, z1)
      }
    }

    const gridGeometry = new THREE.BufferGeometry()
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x166088, // Hyve text color for better contrast
      opacity: 0.6,
      transparent: true,
    })

    const grid = new THREE.LineSegments(gridGeometry, lineMaterial)
    grid.rotation.y = Math.PI / 7 // 30 degrees rotation for perspective
    scene.add(grid)

    // Create vertex points with colors
    const pointGeometry = new THREE.BufferGeometry()
    // Create a canvas-based circular texture
    const circleSize = 64
    const canvas = document.createElement('canvas')
    canvas.width = circleSize
    canvas.height = circleSize
    const ctx = canvas.getContext('2d')!
    ctx.beginPath()
    ctx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)

    const pointMaterial = new THREE.PointsMaterial({
      size: vertexPointSize * 0.1,
      map: texture,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      alphaTest: 0.5,
      vertexColors: true,
    })

    // Create points at every grid intersection
    const pointsArray: number[] = []
    const colorsArray: number[] = []
    const pointsData: PointData[] = [] // Store point data for click detection

    // Calculate grid square size for positioning
    const gridSquareSize = gridWidth / gridDivisions // ~1.6 units
    const pushDownDistance = gridSquareSize * 0.5 // 2 times the square size

    for (let i = 0; i <= gridDivisions; i++) {
      for (let j = 0; j <= gridDivisions; j++) {
        const x = (j / gridDivisions) * gridWidth - gridWidth / 2
        const z = (i / gridDivisions) * gridDepth - gridDepth / 2
        pointsArray.push(x, gridYOffset, z) // Y starts at gridYOffset

        // Default color (Hyve text color for consistency)
        colorsArray.push(HYVE_TEXT_RGB.r, HYVE_TEXT_RGB.g, HYVE_TEXT_RGB.b) // Using constant

        // Store point data for distance calculations
        pointsData.push({ x, z, index: pointsData.length })
      }
    }

    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointsArray, 3))
    pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3))

    const points = new THREE.Points(pointGeometry, pointMaterial)
    points.rotation.y = Math.PI / 7 // Rotate points with the grid

    scene.add(points)

    // Position camera for perspective view
    camera.position.set(0, 10, 35) // Higher and further back for better coverage
    camera.lookAt(0, -5, -15) // Look further down and deeper

    // Wave animation state
    let waveTime = 0
    let streamlineTime = 0 // Separate time for streamlines
    let animationId: number | null = null

    // Store original Y positions for wave calculation
    const originalYPositions = new Float32Array(pointsData.length)
    originalYPositions.fill(gridYOffset) // All points start at Y=gridYOffset

    // Animation system for smooth movement
    const animationState = {
      physicsOffsets: new Float32Array(pointsData.length), // Physics displacement from base position
      velocities: new Float32Array(pointsData.length), // Current velocity for each point
      hasPhysics: false,
    }

    // Initialize all physics offsets to 0
    animationState.physicsOffsets.fill(0)
    animationState.velocities.fill(0)

    // Visual ripple system
    const visualRipples: Array<{
      x: number
      z: number
      radius: number
      maxRadius: number
      opacity: number
      speed: number
      material: any // eslint-disable-line @typescript-eslint/no-explicit-any
      geometry: any // eslint-disable-line @typescript-eslint/no-explicit-any
      mesh: any // eslint-disable-line @typescript-eslint/no-explicit-any
    }> = []

    const rippleGroup = new THREE.Group()
    rippleGroup.rotation.y = Math.PI / 7 // Match grid rotation
    scene.add(rippleGroup)

    // Function to create a visual ripple at click position
    const createVisualRipple = (x: number, z: number) => {
      const geometry = new THREE.CircleGeometry(1, 32) // Start with a small circle
      const material = new THREE.MeshBasicMaterial({
        color: 0x166088, // Hyve text/interactive color (Lapis Lazuli)
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)

      // Position the ripple at the click point
      mesh.position.set(x, gridYOffset + 0.1, z) // Slightly above the grid to avoid z-fighting
      mesh.rotation.x = -Math.PI / 2 // Lay flat
      mesh.scale.set(0.1, 0.1, 0.1) // Start small

      rippleGroup.add(mesh)

      visualRipples.push({
        x,
        z,
        radius: 0.1, // Start small
        maxRadius: gridSquareSize * rippleRadiusMultiplier, // Configurable expansion radius
        opacity: 0.8,
        speed: gridSquareSize * 0.5, // Slower expansion to match bounce settling time
        material,
        geometry,
        mesh,
      })
    }

    // Create a map for fast grid vertex lookups
    const gridVertexMap = new Map<string, number[]>()

    // Build the lookup map once
    const buildGridVertexMap = () => {
      const gridPositions = gridGeometry.attributes.position.array as Float32Array

      for (let i = 0; i < gridPositions.length; i += 3) {
        const x = gridPositions[i]
        const z = gridPositions[i + 2]
        const key = `${x.toFixed(3)},${z.toFixed(3)}`

        if (!gridVertexMap.has(key)) {
          gridVertexMap.set(key, [])
        }
        gridVertexMap.get(key)!.push(i + 1) // Store Y coordinate indices
      }
    }

    buildGridVertexMap()

    // Helper function to calculate wave height at a point
    const calculateWaveHeight = (x: number, z: number, time: number): number => {
      const waveX = Math.sin(x * waveFrequency + time) * waveAmplitude
      const waveZ = Math.sin(z * waveFrequency + time * 0.7) * waveAmplitude
      return (waveX + waveZ) * 0.5
    }

    // Main animation loop that handles both wave and physics
    const animate = () => {
      // Increment wave time for mesh grid
      waveTime += 0.016 * waveSpeed // Assuming 60fps

      // Increment streamline time separately - can be faster or slower
      streamlineTime += 0.016 * streamlineSpeed * streamlineSpeedMultiplier

      const pointPositions = pointGeometry.attributes.position.array as Float32Array
      const gridPositions = gridGeometry.attributes.position.array as Float32Array
      let hasPhysicsMovement = false

      // ============ ANIMATE STREAMLINES ============
      // Update time uniform for shader animation
      streamlines.forEach(streamline => {
        // Update shader time for flowing effect using separate streamlineTime
        streamline.material.uniforms.time.value = streamlineTime * streamline.speed

        // Optional: Add subtle vertical movement to the entire streamline
        const verticalOffset = Math.sin(streamlineTime * 0.2 + streamline.phase) * 0.5
        streamline.mesh.position.y = verticalOffset
      })

      // Physics animation parameters
      const springStrength = 0.035
      const damping = 0.85
      const minVelocity = 0.001
      const minDistance = 0.002

      // Update ALL points with combined wave + physics
      for (let i = 0; i < pointsData.length; i++) {
        const point = pointsData[i]
        const positionIndex = i * 3 + 1 // Y coordinate

        // Calculate wave height for this point
        const waveHeight = calculateWaveHeight(point.x, point.z, waveTime)

        // Update physics if active for this point
        if (
          Math.abs(animationState.velocities[i]) >= minVelocity ||
          Math.abs(animationState.physicsOffsets[i]) >= minDistance
        ) {
          // Physics targets 0 offset (spring back to wave motion)
          const currentOffset = animationState.physicsOffsets[i]
          const targetOffset = 0
          const distance = targetOffset - currentOffset

          // Apply spring force
          const springForce = distance * springStrength
          animationState.velocities[i] = (animationState.velocities[i] + springForce) * damping

          // Update physics offset
          animationState.physicsOffsets[i] += animationState.velocities[i]

          hasPhysicsMovement = true
        } else {
          // Reset physics values when settled
          animationState.physicsOffsets[i] = 0
          animationState.velocities[i] = 0
        }

        // Combine wave height and physics offset for final position
        pointPositions[positionIndex] =
          originalYPositions[i] + waveHeight + animationState.physicsOffsets[i]
      }

      // Update state
      animationState.hasPhysics = hasPhysicsMovement

      // Update grid vertices
      for (let i = 0; i < pointsData.length; i++) {
        const point = pointsData[i]
        const newY = pointPositions[i * 3 + 1]
        const key = `${point.x.toFixed(3)},${point.z.toFixed(3)}`

        const indices = gridVertexMap.get(key)
        if (indices) {
          for (const idx of indices) {
            gridPositions[idx] = newY
          }
        }
      }

      // Update visual ripples
      for (let i = visualRipples.length - 1; i >= 0; i--) {
        const ripple = visualRipples[i]

        // Expand the ripple
        ripple.radius += ripple.speed * 0.016

        // Calculate progress (0 to 1)
        const progress = ripple.radius / ripple.maxRadius

        // Fade out
        ripple.opacity = 0.8 * (1 - progress) * (1 - progress)

        // Update scale
        const scale = ripple.radius / 0.1
        ripple.mesh.scale.set(scale, scale, scale)

        // Update opacity
        ripple.material.opacity = ripple.opacity

        // Remove if faded out
        if (ripple.opacity <= 0.05 || ripple.radius > ripple.maxRadius) {
          rippleGroup.remove(ripple.mesh)
          ripple.geometry.dispose()
          ripple.material.dispose()
          visualRipples.splice(i, 1)
        }
      }

      // Update geometry
      pointGeometry.attributes.position.needsUpdate = true
      gridGeometry.attributes.position.needsUpdate = true

      // Render
      renderer.render(scene, camera)

      // Continue animation
      animationId = requestAnimationFrame(animate)
    }

    // Click detection setup
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Click handler to create depression effect
    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      // Create a plane at y=gridYOffset for intersection
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -gridYOffset)
      const intersectPoint = new THREE.Vector3()

      if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
        // Transform hit point to local grid space
        const localPoint = grid.worldToLocal(intersectPoint.clone())

        // Find the closest grid point
        let closestDistance = Infinity
        let closestIndex = -1

        pointsData.forEach((point, index) => {
          const distance = Math.sqrt((point.x - localPoint.x) ** 2 + (point.z - localPoint.z) ** 2)

          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        })

        if (closestIndex !== -1) {
          // Get color array for points
          const colors = pointGeometry.attributes.color.array as Float32Array

          // Reset all colors to default
          for (let i = 0; i < pointsData.length; i++) {
            const colorIndex = i * 3
            colors[colorIndex] = HYVE_TEXT_RGB.r // R of #3D4657
            colors[colorIndex + 1] = HYVE_TEXT_RGB.g // G of #3D4657
            colors[colorIndex + 2] = HYVE_TEXT_RGB.b // B of #3D4657
          }

          // Get the clicked point coordinates
          const clickedPoint = pointsData[closestIndex]
          const influenceRadius = gridSquareSize * 5 // Affect points within 5 grid squares

          // Apply initial downward velocity for depression effect
          pointsData.forEach((point, index) => {
            const distance = Math.sqrt(
              (point.x - clickedPoint.x) ** 2 + (point.z - clickedPoint.z) ** 2
            )

            if (distance <= influenceRadius) {
              // Calculate bell-shaped falloff
              const normalizedDistance = distance / influenceRadius
              const bellCurve = Math.exp(-(normalizedDistance * normalizedDistance) * 6)

              // Apply downward velocity - this gets added to the wave motion
              animationState.velocities[index] = -pushDownDistance * bellCurve * 2

              // Color the center point - removed for cleaner look
              // if (index === closestIndex) {
              //   const colorIndex = index * 3
              //   colors[colorIndex] = 1.0     // R - bright red
              //   colors[colorIndex + 1] = 0.3 // G - some green
              //   colors[colorIndex + 2] = 0.0 // B - no blue
              // }
            }
          })

          // Update color attribute
          pointGeometry.attributes.color.needsUpdate = true

          // Create visual ripple at the clicked point
          createVisualRipple(clickedPoint.x, clickedPoint.z)
        }
      }
    }

    // Add click event listener
    renderer.domElement.addEventListener('click', handleClick, false)

    // Start the main animation loop
    animate()

    // Initial render
    renderer.render(scene, camera)

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        const newWidth = mountRef.current.clientWidth
        const newHeight = mountRef.current.clientHeight
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
        renderer.render(scene, camera)
      }
    }

    window.addEventListener('resize', handleResize)

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      grid,
      points,
      animationState,
    }

    // Cleanup
    return () => {
      // Cleaning up Three.js scene
      window.removeEventListener('resize', handleResize)

      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleClick)
      }

      // Stop animation
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }

      // Clean up visual ripples
      visualRipples.forEach(ripple => {
        if (rippleGroup && ripple.mesh) {
          rippleGroup.remove(ripple.mesh)
        }
        if (ripple.geometry) {
          ripple.geometry.dispose()
        }
        if (ripple.material) {
          ripple.material.dispose()
        }
      })
      visualRipples.length = 0

      // Clean up streamlines
      streamlines.forEach(streamline => {
        if (streamlineGroup && streamline.mesh) {
          streamlineGroup.remove(streamline.mesh)
        }
        if (streamline.mesh.geometry) {
          streamline.mesh.geometry.dispose()
        }
        if (streamline.material) {
          streamline.material.dispose()
        }
      })

      // Clean up geometries and materials
      if (gridGeometry) gridGeometry.dispose()
      if (pointGeometry) pointGeometry.dispose()
      if (pointMaterial) pointMaterial.dispose()
      if (lineMaterial) lineMaterial.dispose()

      // Clean up renderer and remove canvas
      if (renderer) {
        if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement)
        }
        renderer.dispose()
      }

      // Clear scene reference
      sceneRef.current = null
    }
  }, [
    enabled,
    vertexPointSize,
    rippleRadiusMultiplier,
    waveAmplitude,
    waveFrequency,
    waveSpeed,
    streamlineCount,
    streamlineOpacity,
    streamlineSpeed,
    streamlineSpeedMultiplier,
  ])

  if (!enabled) {
    return <div className={className}>{children}</div>
  }

  const getBlurClass = () => {
    switch (blurIntensity) {
      case 'sm':
        return 'backdrop-blur-sm'
      case 'md':
        return 'backdrop-blur-md'
      case 'lg':
        return 'backdrop-blur-lg'
      case 'xl':
        return 'backdrop-blur-xl'
      default:
        return 'backdrop-blur-sm'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mountRef}
        className="absolute inset-0"
        style={{
          zIndex: 1, // Match canvas z-index
          background: 'linear-gradient(to bottom, #F4F2F3 0%, #CDE2E7 100%)', // Hyve light gradient
        }}
      />
      {blur && <div className={`absolute inset-0 ${getBlurClass()} bg-white/10 z-[2]`} />}
      <div className="relative z-10 pointer-events-none">{children}</div>
    </div>
  )
}
