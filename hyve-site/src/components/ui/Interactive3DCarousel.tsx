import { useSpring, animated, config } from '@react-spring/three'
import { OrbitControls, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { motion } from 'framer-motion'
import { Plane, Car, Wind, Shield } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { create } from 'zustand'

// Industry data structure
interface Industry {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  shortDescription: string
  color: string
  position: [number, number, number]
}

// Industry definitions for carousel
const INDUSTRIES: Industry[] = [
  {
    id: 'aerospace',
    name: 'Aerospace',
    icon: Plane,
    shortDescription: 'Real-time aerodynamic intelligence for next-gen aircraft',
    color: '#0ea5e9', // sky blue
    position: [0, 0, 0],
  },
  {
    id: 'motorsport',
    name: 'Motorsport',
    icon: Car,
    shortDescription: 'Precision aerodynamics for competitive advantage',
    color: '#f59e0b', // amber
    position: [8, 0, 0],
  },
  {
    id: 'energy',
    name: 'Renewable Energy',
    icon: Wind,
    shortDescription: 'Maximizing efficiency for sustainable power generation',
    color: '#10b981', // emerald
    position: [16, 0, 0],
  },
  {
    id: 'structural',
    name: 'Structural Health',
    icon: Shield,
    shortDescription: 'Reliable sensing in extreme conditions',
    color: '#8b5cf6', // violet
    position: [24, 0, 0],
  },
]

// Zustand store for carousel state
interface CarouselStore {
  currentIndex: number
  setCurrentIndex: (index: number) => void
  isTransitioning: boolean
  setIsTransitioning: (transitioning: boolean) => void
}

const useCarouselStore = create<CarouselStore>(set => ({
  currentIndex: 0,
  setCurrentIndex: index => set({ currentIndex: index }),
  isTransitioning: false,
  setIsTransitioning: transitioning => set({ isTransitioning: transitioning }),
}))

// Placeholder 3D Scene Component for each industry
const IndustryScene: React.FC<{ industry: Industry; isActive: boolean }> = ({
  industry,
  isActive,
}) => {
  // Animated spring for the scene
  const { scale, opacity } = useSpring({
    scale: isActive ? 1 : 0.7,
    opacity: isActive ? 1 : 0.3,
    config: config.gentle,
  })

  return (
    <animated.group position={industry.position} scale={scale}>
      {/* Placeholder geometry - will be replaced with Blender animations */}
      <animated.mesh position={[0, 0, 0]} material-opacity={opacity}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={industry.color} transparent />
      </animated.mesh>

      {/* Industry label */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.3}
        color="#166088"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.woff"
      >
        {industry.name}
      </Text>

      {/* Floating particles effect */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 0.8) * 1.5,
            Math.cos(i * 0.8) * 1.5 + 0.5,
            Math.sin(i * 0.4) * 0.5,
          ]}
        >
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color={industry.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </animated.group>
  )
}

// Carousel Camera Controller
const CarouselCamera: React.FC = () => {
  const { currentIndex } = useCarouselStore()

  // Animated camera position based on current industry
  const { position } = useSpring({
    position: [INDUSTRIES[currentIndex].position[0], 2, 6],
    config: config.gentle,
  })

  return <animated.perspectiveCamera makeDefault position={position} fov={60} />
}

// Callout Lines Component
const CalloutLines: React.FC = () => {
  const { currentIndex } = useCarouselStore()
  const currentIndustry = INDUSTRIES[currentIndex]

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Left callout */}
      <motion.div
        key={`left-${currentIndex}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute left-8 top-1/3 transform -translate-y-1/2"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-[1px] bg-hyve-accent"></div>
          <div className="bg-hyve-background/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
            <p className="text-sm text-hyve-text font-medium">High-density data acquisition</p>
            <p className="text-xs text-hyve-text/70 mt-1">Real-time surface monitoring</p>
          </div>
        </div>
      </motion.div>

      {/* Right callout */}
      <motion.div
        key={`right-${currentIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute right-8 top-2/3 transform -translate-y-1/2"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-hyve-background/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
            <p className="text-sm text-hyve-text font-medium">{currentIndustry.shortDescription}</p>
            <p className="text-xs text-hyve-text/70 mt-1">Flexible membrane technology</p>
          </div>
          <div className="w-16 h-[1px] bg-hyve-accent"></div>
        </div>
      </motion.div>
    </div>
  )
}

// Main Interactive 3D Carousel Component
export const Interactive3DCarousel: React.FC = () => {
  const { currentIndex, setCurrentIndex, setIsTransitioning } = useCarouselStore()
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Drag gesture handler
  const bind = useDrag(
    ({ offset: [ox], direction: [dx], velocity: [vx], active }) => {
      if (active) {
        setIsDragging(true)
        setIsTransitioning(true)
      } else {
        setIsDragging(false)
        setIsTransitioning(false)

        // Determine if we should change slides based on drag distance and velocity
        const threshold = 50
        const velocityThreshold = 0.5

        if (Math.abs(ox) > threshold || Math.abs(vx) > velocityThreshold) {
          if (dx < 0 && currentIndex < INDUSTRIES.length - 1) {
            // Drag left - next slide
            setCurrentIndex(currentIndex + 1)
          } else if (dx > 0 && currentIndex > 0) {
            // Drag right - previous slide
            setCurrentIndex(currentIndex - 1)
          }
        }
      }
    },
    {
      axis: 'x',
      bounds: { left: -200, right: 200 },
      rubberband: true,
    }
  )

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-hyve-content/10 to-transparent rounded-2xl overflow-hidden border border-hyve-content/20">
      {/* 3D Canvas */}
      <Canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing" {...bind()} shadows>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />

        {/* Camera Controller */}
        <CarouselCamera />

        {/* Industry Scenes */}
        {INDUSTRIES.map((industry, index) => (
          <IndustryScene key={industry.id} industry={industry} isActive={index === currentIndex} />
        ))}

        {/* Orbit Controls (disabled for drag interaction) */}
        <OrbitControls
          enabled={!isDragging}
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
        />
      </Canvas>

      {/* Callout Lines */}
      <CalloutLines />

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {INDUSTRIES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-hyve-accent'
                : 'bg-hyve-content/30 hover:bg-hyve-content/50'
            }`}
          />
        ))}
      </div>

      {/* Industry Icon Indicator */}
      <div className="absolute top-4 left-4">
        <motion.div
          key={currentIndex}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-12 h-12 bg-hyve-background/90 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          {React.createElement(INDUSTRIES[currentIndex].icon, {
            className: 'w-6 h-6 text-hyve-text',
          })}
        </motion.div>
      </div>

      {/* Swipe Hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isDragging ? 0 : 1 }}
        className="absolute bottom-4 right-4 text-xs text-hyve-text/40"
      >
        Drag to explore →
      </motion.div>
    </div>
  )
}
