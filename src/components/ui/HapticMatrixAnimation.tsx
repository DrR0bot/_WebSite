import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

// ============================================================
// EASY COLOR CONFIGURATION - Just paste your HEX code here!
// ============================================================
const MESH_BASE_COLOR = '#81B7C2'
// ============================================================

// Helper function to convert HEX to normalized RGB (0-1 range)
function hexToNormalizedRGB(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { r: 0.5, g: 0.5, b: 0.5 }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  }
}

// Vertex shader - handles mesh deformation with ripple and pressure
const vertexShader = `
  uniform float uTime;
  uniform vec2 uRippleCenter;
  uniform float uRippleTime;
  uniform float uRippleStrength;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vRipple;
  varying float vPressure;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Ambient floating motion - subtle waves for gentle 3D effect
    float wave1 = sin(pos.x * 2.0 + uTime * 0.8) * 0.05;
    float wave2 = sin(pos.y * 2.5 + uTime * 0.6) * 0.05;
    float wave3 = cos(pos.x * 1.5 + pos.y * 1.5 + uTime * 0.5) * 0.08;
    
    float ambientWave = wave1 + wave2 + wave3;
    
    // Ripple effect from click
    float dist = distance(uv, uRippleCenter);
    float rippleRadius = uRippleTime * 0.35;  // Slower expansion (was 0.45)
    float rippleWidth = 0.12;  // Narrower ring (was 0.15)
    float ripple = 0.0;
    float pressure = 0.0;
    
    if (uRippleStrength > 0.0) {
      // Outward propagating ring
      ripple = smoothstep(rippleRadius - rippleWidth, rippleRadius, dist) 
             - smoothstep(rippleRadius, rippleRadius + rippleWidth, dist);
      ripple *= uRippleStrength * sin(dist * 15.0 - uRippleTime * 4.0) * 0.25;  // Reduced amplitude (was 0.5), less wavy (was 20.0, 4.0)
      ripple *= 1.0 - smoothstep(0.0, 3.5, uRippleTime);  // Faster fade (was 3.5)
      
      // Pressure field - strongest at center, fading outward
      pressure = 1.0 - smoothstep(0.0, rippleRadius + 0.2, dist);  // Tighter field (was 0.25)
      pressure *= uRippleStrength * 0.7;  // Reduced intensity
      pressure *= 1.0 - smoothstep(0.0, 3.0, uRippleTime);  // Faster fade (was 4.0)
      
      // Add some oscillation to pressure
      pressure *= 0.7 + 0.3 * sin(uRippleTime * 1.2);  // Subtler oscillation
    }
    
    pos.z += ambientWave + ripple;
    
    vElevation = ambientWave;
    vRipple = ripple;
    vPressure = pressure + ambientWave * 0.3;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Fragment shader with CFD/FEA jet colormap and circuit board aesthetic
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uRippleCenter;
  uniform float uRippleTime;
  uniform float uRippleStrength;
  uniform vec3 uBaseColor;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vRipple;
  varying float vPressure;
  
  // Classic "Jet" colormap
  vec3 jetColormap(float t) {
    t = clamp(t, 0.0, 1.0);
    
    vec3 color;
    
    if (t < 0.25) {
      float s = t / 0.25;
      color = vec3(0.0, s, 1.0);
    } else if (t < 0.5) {
      float s = (t - 0.25) / 0.25;
      color = vec3(0.0, 1.0, 1.0 - s);
    } else if (t < 0.75) {
      float s = (t - 0.5) / 0.25;
      color = vec3(s, 1.0, 0.0);
    } else {
      float s = (t - 0.75) / 0.25;
      color = vec3(1.0, 1.0 - s, 0.0);
    }
    
    return color;
  }
  
  // Draw a rectangle (returns 1.0 inside, 0.0 outside)
  float rect(vec2 uv, vec2 center, vec2 size) {
    vec2 d = abs(uv - center) - size * 0.5;
    return 1.0 - smoothstep(0.0, 0.008, max(d.x, d.y));
  }
  
  // Draw crosshair marker
  float crosshair(vec2 uv, vec2 center, float size, float thickness) {
    float h = smoothstep(thickness, 0.0, abs(uv.y - center.y)) * 
              smoothstep(size, size * 0.3, abs(uv.x - center.x));
    float v = smoothstep(thickness, 0.0, abs(uv.x - center.x)) * 
              smoothstep(size, size * 0.3, abs(uv.y - center.y));
    return max(h, v);
  }
  
  void main() {
    // Grid configuration
    float gridCount = 10.0;
    vec2 gridUv = vUv * gridCount;
    vec2 gridCell = fract(gridUv);
    vec2 gridId = floor(gridUv);
    
    // === DARK BORDER/FRAME ===
    float borderWidth = 0.06;
    float borderInner = 0.055;
    float inBorder = 1.0 - (
      smoothstep(0.0, borderWidth, vUv.x) * 
      smoothstep(0.0, borderWidth, vUv.y) * 
      smoothstep(0.0, borderWidth, 1.0 - vUv.x) * 
      smoothstep(0.0, borderWidth, 1.0 - vUv.y)
    );
    float innerEdge = (
      smoothstep(borderInner - 0.01, borderInner, vUv.x) * 
      smoothstep(borderInner - 0.01, borderInner, vUv.y) * 
      smoothstep(borderInner - 0.01, borderInner, 1.0 - vUv.x) * 
      smoothstep(borderInner - 0.01, borderInner, 1.0 - vUv.y)
    );
    vec3 borderColor = vec3(0.2, 0.25, 0.3);  // Dark gray-blue border
    
    // === CIRCUIT TRACE GRID ===
    float traceThickness = 0.025;
    float traceH = smoothstep(traceThickness, 0.0, abs(gridCell.y - 0.5));
    float traceV = smoothstep(traceThickness, 0.0, abs(gridCell.x - 0.5));
    float traces = max(traceH, traceV) * 0.6;
    
    // Thinner sub-traces
    float subTraceH = smoothstep(0.012, 0.0, abs(gridCell.y - 0.25)) + 
                      smoothstep(0.012, 0.0, abs(gridCell.y - 0.75));
    float subTraceV = smoothstep(0.012, 0.0, abs(gridCell.x - 0.25)) + 
                      smoothstep(0.012, 0.0, abs(gridCell.x - 0.75));
    traces += (subTraceH + subTraceV) * 0.25;
    
    // === CROSSHAIR MARKERS at grid intersections ===
    float crosshairs = 0.0;
    for (float i = 0.0; i < 11.0; i++) {
      for (float j = 0.0; j < 11.0; j++) {
        vec2 crossPos = vec2(i, j) / gridCount;
        crosshairs += crosshair(vUv, crossPos, 0.025, 0.003) * 0.5;
      }
    }
    
    // === CHIP/COMPONENT MARKERS at cell centers ===
    float chips = 0.0;
    vec2 cellCenter = vec2(0.5);
    
    // Main chip body (dark rectangle)
    float chipBody = rect(gridCell, cellCenter, vec2(0.22, 0.16));
    
    // Chip pins (small rectangles on sides)
    float pin1 = rect(gridCell, cellCenter + vec2(-0.14, 0.0), vec2(0.04, 0.08));
    float pin2 = rect(gridCell, cellCenter + vec2(0.14, 0.0), vec2(0.04, 0.08));
    float pin3 = rect(gridCell, cellCenter + vec2(0.0, -0.10), vec2(0.08, 0.03));
    float pin4 = rect(gridCell, cellCenter + vec2(0.0, 0.10), vec2(0.08, 0.03));
    
    chips = chipBody + (pin1 + pin2 + pin3 + pin4) * 0.7;
    
    // === BASE COLOR with pressure response ===
    vec3 baseColor = uBaseColor;
    
    // Ripple activity for color blend
    float rippleActivity = abs(vRipple) * 2.0 + uRippleStrength * (1.0 - smoothstep(0.0, 2.5, uRippleTime));
    rippleActivity = clamp(rippleActivity, 0.0, 0.85);
    
    // Pressure colormap
    float pressureNorm = vPressure * 0.5 + 0.5;
    pressureNorm = clamp(pressureNorm, 0.0, 1.0);
    vec3 pressureColor = jetColormap(pressureNorm);
    
    // Mix base and pressure colors
    vec3 surfaceColor = mix(baseColor, pressureColor, rippleActivity);
    
    // === COMPOSE FINAL COLOR ===
    vec3 color = surfaceColor;
    
    // Add circuit traces (white/light cyan)
    vec3 traceColor = vec3(0.9, 0.95, 1.0);
    color = mix(color, traceColor, traces * 0.4);
    
    // Add crosshairs (white)
    color = mix(color, vec3(1.0), crosshairs * 0.6);
    
    // Add chip components (dark)
    vec3 chipColor = vec3(0.15, 0.18, 0.22);
    color = mix(color, chipColor, chips * 0.9);
    
    // Apply border
    color = mix(color, borderColor, inBorder);
    
    // Inner edge highlight
    float edgeHighlight = (1.0 - innerEdge) * innerEdge * 4.0;
    color += vec3(0.3, 0.35, 0.4) * edgeHighlight * 0.3;
    
    // Alpha with slight transparency
    float alpha = 0.95;
    
    gl_FragColor = vec4(color, alpha);
  }
`

interface SensorData {
  element: HTMLDivElement
  row: number
  col: number
  uvX: number
  uvY: number
}

interface HapticMatrixAnimationProps {
  className?: string
}

// Smoothstep utility function
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// Get jet colormap color as CSS
function getJetColor(t: number): string {
  t = Math.max(0, Math.min(1, t))

  let r: number, g: number, b: number

  if (t < 0.25) {
    const s = t / 0.25
    r = 0
    g = s
    b = 1
  } else if (t < 0.5) {
    const s = (t - 0.25) / 0.25
    r = 0
    g = 1
    b = 1 - s
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25
    r = s
    g = 1
    b = 0
  } else {
    const s = (t - 0.75) / 0.25
    r = 1
    g = 1 - s
    b = 0
  }

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

// Set to true to show debug controls, false to hide them
const SHOW_DEBUG_CONTROLS = false

export const HapticMatrixAnimation: React.FC<HapticMatrixAnimationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sensorContainerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const frameRef = useRef<number>(0)
  const clockRef = useRef<THREE.Clock | null>(null)
  const sensorElementsRef = useRef<SensorData[]>([])
  const rippleCenterRef = useRef({ x: 0.5, y: 0.5 })
  const rippleTimeRef = useRef(0)
  const rippleActiveRef = useRef(false)

  const [isLoaded, setIsLoaded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Debug controls state - final tuned values
  const [camX, setCamX] = useState(0.40)
  const [camY, setCamY] = useState(-1.10)
  const [camZ, setCamZ] = useState(4.80)
  const [rotX, setRotX] = useState(-0.49)
  const [rotY, setRotY] = useState(-0.27)
  const [fov, setFov] = useState(49)

  const GRID_SIZE = 10

  // Update camera and mesh when debug controls change
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ)
      cameraRef.current.fov = fov
      cameraRef.current.updateProjectionMatrix()
      cameraRef.current.lookAt(0, 0, 0)
    }
  }, [camX, camY, camZ, fov])

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotX
      meshRef.current.rotation.y = rotY
    }
  }, [rotX, rotY])

  // Calculate pressure value at a UV position (matches reduced shader values)
  const calculatePressure = useCallback((uvX: number, uvY: number, centerX: number, centerY: number, time: number) => {
    const dist = Math.sqrt((uvX - centerX) ** 2 + (uvY - centerY) ** 2)
    const rippleRadius = time * 0.35  // Match shader (was 0.45)

    let pressure = 1.0 - smoothstep(0, rippleRadius + 0.2, dist)  // Match shader (was 0.25)
    pressure *= 0.7  // Reduced intensity
    pressure *= 1.0 - smoothstep(0, 3.0, time)  // Match shader (was 4.0)
    pressure *= 0.7 + 0.3 * Math.sin(time * 1.2)  // Match shader oscillation

    return pressure
  }, [])

  // Update sensor positions based on 3D projection
  const updateSensorPositions = useCallback(() => {
    if (!meshRef.current || !cameraRef.current || !materialRef.current || !containerRef.current) return

    const tempVec = new THREE.Vector3()
    const mesh = meshRef.current
    const camera = cameraRef.current
    const material = materialRef.current
    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    sensorElementsRef.current.forEach(sensor => {
      const x = (sensor.uvX - 0.5) * 3.5
      const y = (sensor.uvY - 0.5) * 3.5

      const time = material.uniforms.uTime.value
      // Match the shader wave amplitudes for accurate sensor positioning
      const wave1 = Math.sin(x * 2.0 + time * 0.8) * 0.15
      const wave2 = Math.sin(y * 2.5 + time * 0.6) * 0.12
      const wave3 = Math.cos(x * 1.5 + y * 1.5 + time * 0.5) * 0.08
      const z = wave1 + wave2 + wave3

      tempVec.set(x, y, z)
      tempVec.applyEuler(mesh.rotation)
      tempVec.add(mesh.position)
      tempVec.project(camera)

      const screenX = (tempVec.x * 0.5 + 0.5) * rect.width
      const screenY = (-tempVec.y * 0.5 + 0.5) * rect.height

      sensor.element.style.left = `${screenX}px`
      sensor.element.style.top = `${screenY}px`
    })
  }, [])

  // Update sensor values based on ripple
  const updateSensorValues = useCallback(() => {
    if (!rippleActiveRef.current) {
      sensorElementsRef.current.forEach(sensor => {
        sensor.element.style.opacity = '0'
        sensor.element.style.transform = 'translate(-50%, -50%) scale(0.5)'
      })
      return
    }

    const rippleRadius = rippleTimeRef.current * 0.35

    sensorElementsRef.current.forEach(sensor => {
      const dist = Math.sqrt(
        (sensor.uvX - rippleCenterRef.current.x) ** 2 + (sensor.uvY - rippleCenterRef.current.y) ** 2
      )

      // Calculate pressure for this sensor
      const pressure = calculatePressure(
        sensor.uvX,
        sensor.uvY,
        rippleCenterRef.current.x,
        rippleCenterRef.current.y,
        rippleTimeRef.current
      )

      const kPa = pressure * 5.0
      const noise = (Math.random() - 0.5) * 0.2
      const displayValue = Math.max(0, kPa + noise)

      // Only show sensors that are within the ripple radius and have meaningful pressure
      const isInRange = dist < rippleRadius + 0.15
      
      if (isInRange && displayValue > 0.05) {
        // Use the pressure value directly for opacity (0-1 range)
        // Boost it slightly so it's visible, but let it fade naturally with the value
        const opacity = Math.min(1, displayValue / 2.5)  // Full opacity at ~2.5 kPa, fades to 0 naturally
        
        sensor.element.textContent = displayValue.toFixed(2)
        sensor.element.style.opacity = opacity.toFixed(3)
        sensor.element.style.transform = 'translate(-50%, -50%) scale(1)'
        sensor.element.style.color = getJetColor(displayValue / 5.0)
      } else {
        sensor.element.style.opacity = '0'
        sensor.element.style.transform = 'translate(-50%, -50%) scale(0.5)'
      }
    })
  }, [calculatePressure])

  useEffect(() => {
    if (!containerRef.current || !sensorContainerRef.current) return

    // Skip the entire Three.js + sensor-overlay setup when running under the
    // build-time prerender. The marker is set by scripts/prerender.js before
    // navigation. Without this guard, the prerender snapshots ~100 invisible
    // "0.00" sensor-value cells into the static HTML, polluting what crawlers
    // and LLMs ingest. The container's aria-label still describes what the
    // visualisation represents, so prerendered output remains semantic.
    if (typeof window !== 'undefined' && (window as { __PRERENDER__?: boolean }).__PRERENDER__) {
      return
    }

    const container = containerRef.current
    const sensorContainer = sensorContainerRef.current

    // Create sensor value DOM elements
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const el = document.createElement('div')
        el.className = 'sensor-value'
        el.textContent = '0.00'
        sensorContainer.appendChild(el)
        sensorElementsRef.current.push({
          element: el,
          row,
          col,
          uvX: (col + 0.5) / GRID_SIZE,
          uvY: (row + 0.5) / GRID_SIZE,
        })
      }
    }

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera with tuned perspective settings
    const camera = new THREE.PerspectiveCamera(49, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0.40, -1.10, 4.80)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create haptic matrix mesh
    const geometry = new THREE.PlaneGeometry(3.5, 3.5, 64, 64)

    // Convert HEX color to normalized RGB for shader
    const baseColorRGB = hexToNormalizedRGB(MESH_BASE_COLOR)

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRippleCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uRippleTime: { value: 0 },
        uRippleStrength: { value: 0 },
        uBaseColor: { value: new THREE.Vector3(baseColorRGB.r, baseColorRGB.g, baseColorRGB.b) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    })
    materialRef.current = material

    const mesh = new THREE.Mesh(geometry, material)
    // Tuned rotation for optimal 3D perspective
    mesh.rotation.x = -0.49
    mesh.rotation.y = -0.27
    scene.add(mesh)
    meshRef.current = mesh

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handleInteraction = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(mesh)

      if (intersects.length > 0 && intersects[0].uv) {
        const uv = intersects[0].uv
        material.uniforms.uRippleCenter.value.set(uv.x, uv.y)
        material.uniforms.uRippleTime.value = 0
        material.uniforms.uRippleStrength.value = 1

        rippleCenterRef.current = { x: uv.x, y: uv.y }
        rippleTimeRef.current = 0
        rippleActiveRef.current = true

        // Hide the touch hint after first interaction
        setHasInteracted(true)

        sensorElementsRef.current.forEach(sensor => {
          sensor.element.classList.remove('active')
        })
      }
    }

    const handleClick = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY)
    }

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleInteraction(touch.clientX, touch.clientY)
    }

    container.addEventListener('click', handleClick)
    container.addEventListener('touchstart', handleTouch, { passive: false })

    // Animation loop
    const clock = new THREE.Clock()
    clockRef.current = clock

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      const elapsed = clock.getElapsedTime()
      material.uniforms.uTime.value = elapsed

      if (material.uniforms.uRippleStrength.value > 0) {
        material.uniforms.uRippleTime.value += 0.016
        rippleTimeRef.current += 0.016

        if (material.uniforms.uRippleTime.value > 4.0) {  // Reduced duration (was 5.0)
          material.uniforms.uRippleStrength.value = 0
          rippleActiveRef.current = false
        }
      }

      // When debug controls are active, don't animate rotation (let sliders control it)
      // When debug is off, add gentle oscillation around tuned base values
      if (!SHOW_DEBUG_CONTROLS) {
        mesh.rotation.y = -0.27 + Math.sin(elapsed * 0.3) * 0.08
        mesh.rotation.x = -0.49 + Math.cos(elapsed * 0.25) * 0.05
      }

      updateSensorPositions()
      updateSensorValues()

      renderer.render(scene, camera)
    }

    animate()
    setIsLoaded(true)

    // Handle resize
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('click', handleClick)
      container.removeEventListener('touchstart', handleTouch)
      cancelAnimationFrame(frameRef.current)

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      // Clear sensor elements
      sensorElementsRef.current.forEach(sensor => {
        if (sensorContainer.contains(sensor.element)) {
          sensorContainer.removeChild(sensor.element)
        }
      })
      sensorElementsRef.current = []

      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [updateSensorPositions, updateSensorValues])

  return (
    <div
      className={`relative w-full h-full ${className}`}
      role="img"
      aria-label="Interactive 10x10 Haptic Matrix sensor visualisation: a flexible Kapton substrate with 100 individual sensing nodes that display real-time pressure, temperature, and strain data when interacted with."
    >
      {/* Three.js canvas container */}
      <div ref={containerRef} className="absolute inset-0 cursor-pointer" style={{ touchAction: 'none' }} />

      {/* Sensor values overlay */}
      <div ref={sensorContainerRef} className="absolute inset-0 pointer-events-none" />

      {/* Technical Callout Lines - Engineering documentation style */}
      {isLoaded && (
        <div className="absolute inset-0 pointer-events-none overflow-visible callouts-container hidden sm:block">
          
          {/* SVG Layer for connected lines - viewBox creates a 1000x1000 coordinate system */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1000 1000" 
            preserveAspectRatio="none"
            style={{ zIndex: 20 }}
          >
            {/* Top-right callout: Sensor Matrix */}
            <g className="callout-svg callout-tr-svg">
              <circle cx="620" cy="270" r="5" fill="#334155" className="callout-dot-svg" />
              <polyline 
                points="620,270 750,80 1000,80" 
                stroke="#334155" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="callout-path-svg"
              />
            </g>
            
            {/* Top-left callout: Flexible Substrate */}
            <g className="callout-svg callout-tl-svg">
              <circle cx="340" cy="340" r="5" fill="#334155" className="callout-dot-svg" />
              <polyline 
                points="340,340 250,220 0,220" 
                stroke="#334155" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="callout-path-svg"
              />
            </g>
            
            {/* Bottom-right callout: MEMS Array */}
            <g className="callout-svg callout-br-svg">
              <circle cx="640" cy="800" r="5" fill="#334155" className="callout-dot-svg" />
              <polyline 
                points="640,800 800,950 1000,950" 
                stroke="#334155" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="callout-path-svg"
              />
            </g>
            
            {/* Bottom-left callout: Data Acquisition */}
            <g className="callout-svg callout-bl-svg">
              <circle cx="420" cy="800" r="5" fill="#334155" className="callout-dot-svg" />
              <polyline 
                points="420,800 250,980 0,980" 
                stroke="#334155" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="callout-path-svg"
              />
            </g>
          </svg>
          
          {/* Labels positioned at line endpoints */}
          <div className="callout-label callout-label-tr pointer-events-auto" style={{ position: 'absolute', top: '5%', right: '2%', textAlign: 'right' }}>
            <span className="callout-title text-slate-700 font-semibold text-xs tracking-wide block">10×10 SENSOR MATRIX</span>
            <span className="callout-subtitle text-[10px] text-slate-400 font-normal italic">High-density tactile array</span>
          </div>
          
          <div className="callout-label callout-label-tl pointer-events-auto" style={{ position: 'absolute', top: '19%', left: '2%', textAlign: 'left' }}>
            <span className="callout-title text-slate-700 font-semibold text-xs tracking-wide block">FLEXIBLE SUBSTRATE</span>
            <span className="callout-subtitle text-[10px] text-slate-400 font-normal italic">Conformable sensing surface</span>
          </div>
          
          <div className="callout-label callout-label-br pointer-events-auto" style={{ position: 'absolute', top: '92%', right: '2%', textAlign: 'right' }}>
            <span className="callout-title text-slate-700 font-semibold text-xs tracking-wide block">MEMS ARRAY</span>
            <span className="callout-subtitle text-[10px] text-slate-400 font-normal italic">Custom sensing elements</span>
          </div>
          
          <div className="callout-label callout-label-bl pointer-events-auto" style={{ position: 'absolute', top: '95%', left: '2%', textAlign: 'left' }}>
            <span className="callout-title text-slate-700 font-semibold text-xs tracking-wide block">REAL-TIME ACQUISITION</span>
            <span className="callout-subtitle text-[10px] text-slate-400 font-normal italic">1kHz sampling rate</span>
          </div>
          
        </div>
      )}

      {/* Touch/Click Hint */}
      {isLoaded && !hasInteracted && (
        <div className="touch-hint absolute bottom-[1%] left-1/2 -translate-x-1/2 pointer-events-none z-30">
          <div className="flex items-center gap-3 text-slate-500 text-base">
            <svg className="w-7 h-7 touch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 18v-3m0-3V9m0 0V6a2 2 0 114 0v6m-4-3a2 2 0 10-4 0v4a6 6 0 0012 0v-4a2 2 0 10-4 0" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium tracking-wide">Tap to interact</span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-hyve-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Debug Controls - Remove when done tuning */}
      {SHOW_DEBUG_CONTROLS && (
        <div className="absolute top-2 right-2 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 pointer-events-auto max-h-[90%] overflow-y-auto">
          <div className="font-bold mb-2 text-yellow-400">Debug Controls</div>
          
          <div className="mb-3">
            <div className="text-gray-400 mb-1">Camera Position</div>
            <label className="flex items-center gap-2 mb-1">
              <span className="w-8">X:</span>
              <input type="range" min="-5" max="5" step="0.1" value={camX} onChange={e => setCamX(parseFloat(e.target.value))} className="w-24" />
              <span className="w-12 text-right text-cyan-400">{camX.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2 mb-1">
              <span className="w-8">Y:</span>
              <input type="range" min="-5" max="5" step="0.1" value={camY} onChange={e => setCamY(parseFloat(e.target.value))} className="w-24" />
              <span className="w-12 text-right text-cyan-400">{camY.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-8">Z:</span>
              <input type="range" min="1" max="10" step="0.1" value={camZ} onChange={e => setCamZ(parseFloat(e.target.value))} className="w-24" />
              <span className="w-12 text-right text-cyan-400">{camZ.toFixed(2)}</span>
            </label>
          </div>

          <div className="mb-3">
            <div className="text-gray-400 mb-1">Mesh Rotation</div>
            <label className="flex items-center gap-2 mb-1">
              <span className="w-8">X:</span>
              <input type="range" min="-1.57" max="0" step="0.01" value={rotX} onChange={e => setRotX(parseFloat(e.target.value))} className="w-24" />
              <span className="w-12 text-right text-green-400">{rotX.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-8">Y:</span>
              <input type="range" min="-1.57" max="1.57" step="0.01" value={rotY} onChange={e => setRotY(parseFloat(e.target.value))} className="w-24" />
              <span className="w-12 text-right text-green-400">{rotY.toFixed(2)}</span>
            </label>
          </div>

          <div className="mb-3">
            <div className="text-gray-400 mb-1">Camera FOV</div>
            <label className="flex items-center gap-2">
              <span className="w-8">°:</span>
              <input type="range" min="20" max="100" step="1" value={fov} onChange={e => setFov(parseFloat(e.target.value))} className="w-24" />
              <span className="w-12 text-right text-orange-400">{fov.toFixed(0)}</span>
            </label>
          </div>

          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-gray-400 mb-1">Copy these values:</div>
            <div className="bg-gray-900 p-2 rounded text-[10px] select-all">
              camera.position.set({camX.toFixed(2)}, {camY.toFixed(2)}, {camZ.toFixed(2)})<br/>
              camera.fov = {fov}<br/>
              mesh.rotation.x = {rotX.toFixed(2)}<br/>
              mesh.rotation.y = {rotY.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Sensor value styles */}
      <style>{`
        .sensor-value {
          position: absolute;
          font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
          font-size: 9px;
          font-weight: 600;
          color: white;
          text-shadow: 0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5);
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.5);
          transition: opacity 0.1s linear, transform 0.15s ease-out, color 0.1s linear;
          white-space: nowrap;
          pointer-events: none;
        }
        
        @media (min-width: 768px) {
          .sensor-value {
            font-size: 10px;
          }
        }
        
        /* Callout container */
        .callouts-container {
          z-index: 20;
        }
        
        /* SVG Callout dots */
        .callout-dot-svg {
          opacity: 0;
          animation: dotFadeIn 0.3s ease-out forwards;
        }
        
        /* SVG Callout paths */
        .callout-path-svg {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: pathDraw 0.8s ease-out forwards;
        }
        
        /* Labels */
        .callout-label {
          opacity: 0;
          transform: translateY(5px);
          animation: labelFadeIn 0.4s ease-out forwards;
          cursor: default;
        }
        
        .callout-label .callout-title,
        .callout-label .callout-subtitle {
          transition: font-size 0.25s ease, color 0.25s ease;
        }
        
        .callout-label:hover .callout-title {
          font-size: 16px;
          color: #1e293b;
        }
        
        .callout-label:hover .callout-subtitle {
          font-size: 13px;
          color: #64748b;
        }
        
        /* Staggered delays - Top Right */
        .callout-tr-svg .callout-dot-svg { animation-delay: 0.5s; }
        .callout-tr-svg .callout-path-svg { animation-delay: 0.6s; }
        .callout-label-tr { animation-delay: 1.2s; }
        
        /* Staggered delays - Top Left */
        .callout-tl-svg .callout-dot-svg { animation-delay: 0.7s; }
        .callout-tl-svg .callout-path-svg { animation-delay: 0.8s; }
        .callout-label-tl { animation-delay: 1.4s; }
        
        /* Staggered delays - Bottom Right */
        .callout-br-svg .callout-dot-svg { animation-delay: 0.9s; }
        .callout-br-svg .callout-path-svg { animation-delay: 1.0s; }
        .callout-label-br { animation-delay: 1.6s; }
        
        /* Staggered delays - Bottom Left */
        .callout-bl-svg .callout-dot-svg { animation-delay: 1.1s; }
        .callout-bl-svg .callout-path-svg { animation-delay: 1.2s; }
        .callout-label-bl { animation-delay: 1.8s; }
        
        @keyframes dotFadeIn {
          from { 
            opacity: 0; 
            r: 0; 
          }
          to { 
            opacity: 1; 
            r: 5; 
          }
        }
        
        @keyframes pathDraw {
          from { 
            stroke-dashoffset: 1000; 
          }
          to { 
            stroke-dashoffset: 0; 
          }
        }
        
        @keyframes labelFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(5px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        /* Touch hint styles */
        .touch-hint {
          opacity: 0;
          animation: hintFadeIn 0.5s ease-out 2.5s forwards;
        }
        
        .touch-icon {
          animation: hintPulse 2s ease-in-out infinite;
        }
        
        @keyframes hintFadeIn {
          from { 
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes hintPulse {
          0%, 100% { 
            opacity: 0.6;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
