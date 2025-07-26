import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion } from 'framer-motion'
import React, { useRef, useState, Suspense } from 'react'
import * as THREE from 'three'

import { OBJModel } from './OBJModelLoader'
import { PressureVisualization, SensorDots } from './PressureVisualization'

// Animation states
enum AnimationState {
  OVERVIEW = 'overview',
  WING_FOCUS = 'wingFocus',
  SENSOR_DETAIL = 'sensorDetail',
}

// Camera positions for different states
// NOTE: Adjusted for Blender coordinate system conversion
// Format: position: [x, y, z] where:
// - x: left/right (negative = left, positive = right)
// - y: up/down (negative = down, positive = up)
// - z: forward/back (negative = closer, positive = further)
// target: [x, y, z] - what the camera looks at
// fov: field of view (smaller = more zoomed in, larger = more zoomed out)
const CAMERA_POSITIONS = {
  [AnimationState.OVERVIEW]: {
    // OVERVIEW: Wide shot showing entire aircraft
    position: [0, 3, 3], // 3 units back, 3 units up, centered
    target: [0, 0, 0], // Looking at center of scene
    fov: 35, // Moderate field of view
    // ADJUST: Increase z-value (e.g., 5 or 8) to move camera further back
    // ADJUST: Decrease z-value (e.g., 2) to move camera closer
    // ADJUST: Increase y-value (e.g., 5) to move camera higher
    // ADJUST: Increase fov (e.g., 45) for wider view, decrease (e.g., 25) for more zoom
  },
  [AnimationState.WING_FOCUS]: {
    // WING FOCUS: Medium shot focusing on wing area
    // Note: Wings are along X-axis in both Blender and Three.js
    position: [-3, 0, 2], // 3 units left, 2 units up, 2 units back
    target: [-2, 0, 0], // Looking at left wing area
    fov: 25, // More zoomed in than overview
    // ADJUST: Change x-value to [-4, 2, 2] to move further left for wing view
    // ADJUST: Change z-value to [x, y, 3] to move camera further from wing
    // ADJUST: Change target to [-1, 0, 0] to look at different wing area
  },
  [AnimationState.SENSOR_DETAIL]: {
    // SENSOR DETAIL: Close-up shot of sensor area
    position: [-2.5, 1, 1], // Close to wing surface
    target: [-2, 0, 0], // Looking closely at sensor area
    fov: 20, // Most zoomed in view
    // ADJUST: Change z-value to [x, y, 1.5] to move slightly further back
    // ADJUST: Change z-value to [x, y, 0.5] to get extremely close
    // ADJUST: Decrease fov to 15 for even tighter close-up
  },
}

interface AircraftModelProps {
  animationState: AnimationState
  onClick: () => void
}

// Aircraft Model Component
const AircraftModel: React.FC<AircraftModelProps> = ({ animationState, onClick }) => {
  const meshRef = useRef<THREE.Group>(null)
  const [modelLoaded, setModelLoaded] = useState(false)

  useFrame(state => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.05
    }
  })

  const handleModelLoad = (_object: THREE.Group) => {
    setModelLoaded(true)
    console.log('Aircraft model loaded successfully')
  }

  return (
    <group ref={meshRef} onClick={onClick} onPointerOver={() => {}} onPointerOut={() => {}}>
      {/* Actual Aircraft Model */}
      <OBJModel
        objUrl="/models/aircraft.obj"
        mtlUrl="/models/aircraft.mtl"
        // MODEL SCALE: Controls overall size of the aircraft
        scale={0.072}
        // ADJUST SCALE:
        // - Too small? Increase to 0.1 or 0.15
        // - Too large? Decrease to 0.02 or 0.01
        // - Rule: smaller scale = smaller model, larger scale = bigger model

        // MODEL POSITION: [x, y, z] offset from center
        position={[0.0, 0.8, 0.0]}
        // ADJUST POSITION:
        // - Move right: [1, 0, 0] or [2, 0, 0]
        // - Move left: [-1, 0, 0] or [-2, 0, 0]
        // - Move up: [0, 1, 0] or [0, 2, 0]
        // - Move down: [0, -1, 0] or [0, -2, 0]
        // - Move forward: [0, 0, -1] or [0, 0, -2]
        // - Move back: [0, 0, 1] or [0, 0, 2]

        // MODEL ROTATION: [x, y, z] rotation in radians
        // BLENDER TO THREE.JS CONVERSION: Blender uses Z-up, Three.js uses Y-up
        rotation={[-0.8, -0.15, -0.2]} // {pitch, yaw, roll {positive = clockwise, negative = counter-clockwise}}
        //  To show sideway view of aircraft: {[-0.717, -1.5, -0.2]}
        //
        // ADJUST ROTATION FROM BLENDER COORDINATE SYSTEM:
        // - Default conversion: [-Math.PI/2, 0, 0] (rotates -90° around X-axis)
        // - If aircraft points wrong direction: [-Math.PI/2, Math.PI, 0] (adds 180° Y rotation)
        // - If aircraft is upside down: [Math.PI/2, 0, 0] (rotates +90° around X-axis)
        // - Fine-tune heading: [-Math.PI/2, Math.PI/4, 0] (adds 45° Y rotation)
        //
        // BLENDER COORDINATE REFERENCE:
        // - Aircraft nose should point along +Y in Blender
        // - Wings should extend along ±X in Blender
        // - Up should be +Z in Blender

        onLoad={handleModelLoad}
      />

      {/* Pressure visualization overlay */}
      {modelLoaded &&
        (animationState === AnimationState.WING_FOCUS ||
          animationState === AnimationState.SENSOR_DETAIL) && (
          <PressureVisualization
            visible={true}
            intensity={animationState === AnimationState.SENSOR_DETAIL ? 1.0 : 0.5}
          />
        )}

      {/* Sensor dots for detail view */}
      {modelLoaded && animationState === AnimationState.SENSOR_DETAIL && (
        <SensorDots visible={true} />
      )}
    </group>
  )
}

// Camera Controller Component
const CameraController: React.FC<{ animationState: AnimationState }> = ({ animationState }) => {
  const { camera } = useThree()
  const targetPosition = CAMERA_POSITIONS[animationState]

  useFrame(() => {
    // Smooth camera transitions
    // CAMERA SMOOTHING: Controls how fast camera moves between positions
    camera.position.lerp(new THREE.Vector3(...targetPosition.position), 0.05)
    // ADJUST SMOOTHING:
    // - Slower transitions: change 0.05 to 0.02 or 0.01
    // - Faster transitions: change 0.05 to 0.1 or 0.15

    camera.lookAt(new THREE.Vector3(...targetPosition.target))

    if ('fov' in camera && camera instanceof THREE.PerspectiveCamera) {
      // FOV SMOOTHING: Controls how fast zoom changes
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetPosition.fov, 0.05)
      // ADJUST FOV SMOOTHING: Same as camera smoothing above
      camera.updateProjectionMatrix()
    }
  })

  return null
}

// Main Aircraft Animation Component
export const AircraftAnimation: React.FC = () => {
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.OVERVIEW)
  const [isLoading, setIsLoading] = useState(true)
  const [showCoordinateSystem, setShowCoordinateSystem] = useState(true) // Toggle for debugging

  const handleClick = () => {
    // Cycle through animation states
    switch (animationState) {
      case AnimationState.OVERVIEW:
        setAnimationState(AnimationState.WING_FOCUS)
        break
      case AnimationState.WING_FOCUS:
        setAnimationState(AnimationState.SENSOR_DETAIL)
        break
      case AnimationState.SENSOR_DETAIL:
        setAnimationState(AnimationState.OVERVIEW)
        break
    }
  }

  return (
    <div className="relative w-full h-full">
      <Canvas shadows className="cursor-pointer" onCreated={() => setIsLoading(false)}>
        <PerspectiveCamera makeDefault position={[0, 3, 15]} fov={35} />
        <CameraController animationState={animationState} />

        {/* COORDINATE SYSTEM VISUALIZATION */}
        {showCoordinateSystem && (
          <>
            {/* Axes Helper: Red=X, Green=Y, Blue=Z */}
            <axesHelper args={[2]} />

            {/* Grid Helper: Shows XZ plane (ground plane) */}
            <gridHelper args={[10, 10, 0x444444, 0x222222]} position={[0, 0, 0]} />

            {/* Additional coordinate reference markers */}
            {/* X-axis markers (Red) */}
            <mesh position={[1, 0, 0]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="red" />
            </mesh>
            <mesh position={[2, 0, 0]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="red" />
            </mesh>

            {/* Y-axis markers (Green) */}
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="green" />
            </mesh>
            <mesh position={[0, 2, 0]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="green" />
            </mesh>

            {/* Z-axis markers (Blue) */}
            <mesh position={[0, 0, 1]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="blue" />
            </mesh>
            <mesh position={[0, 0, 2]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="blue" />
            </mesh>
          </>
        )}

        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Aircraft Model */}
        <Suspense fallback={null}>
          <AircraftModel animationState={animationState} onClick={handleClick} />
        </Suspense>

        {/* Controls (disabled to prevent user interaction) */}
        <OrbitControls enabled={false} enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="text-hyve-text/60 text-sm">Loading 3D Model...</div>
        </div>
      )}

      {/* Coordinate System Toggle */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => setShowCoordinateSystem(!showCoordinateSystem)}
          className="bg-black/50 text-white px-3 py-1 rounded text-xs hover:bg-black/70 transition-colors"
        >
          {showCoordinateSystem ? 'Hide' : 'Show'} Coordinates
        </button>
      </div>

      {/* Coordinate System Legend */}
      {showCoordinateSystem && (
        <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded text-xs">
          <div className="font-semibold mb-2">Coordinate System:</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>X-axis (Left ← → Right)</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Y-axis (Down ↓ ↑ Up)</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Z-axis (Far ← → Near)</span>
          </div>
          <div className="text-xs text-gray-300 mt-2">
            <div>Origin (0,0,0) = Center</div>
            <div>Grid squares = 1 unit each</div>
          </div>
        </div>
      )}

      {/* Interaction hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-xs text-hyve-text/40">
          {animationState === AnimationState.OVERVIEW && 'Click to explore sensor technology'}
          {animationState === AnimationState.WING_FOCUS && 'Click to view pressure visualization'}
          {animationState === AnimationState.SENSOR_DETAIL && 'Click to return to overview'}
        </p>
      </motion.div>
    </div>
  )
}
