import { useFrame } from '@react-three/fiber'
import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Vertex shader for pressure visualization
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader for animated pressure gradient
const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec3 colorLow;
  uniform vec3 colorMid;
  uniform vec3 colorHigh;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Noise function for organic pressure patterns
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
           
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }
  
  void main() {
    // Create flowing pressure patterns
    vec3 noisePos = vPosition + vec3(time * 0.2, 0.0, time * 0.1);
    float pressure = snoise(noisePos * 2.0) * 0.5 + 0.5;
    
    // Add secondary wave pattern
    float wave = sin(vUv.x * 10.0 - time * 2.0) * 0.5 + 0.5;
    pressure = mix(pressure, wave, 0.3);
    
    // Create color gradient based on pressure
    vec3 color;
    if (pressure < 0.5) {
      color = mix(colorLow, colorMid, pressure * 2.0);
    } else {
      color = mix(colorMid, colorHigh, (pressure - 0.5) * 2.0);
    }
    
    // Apply intensity
    color *= intensity;
    
    // Add slight transparency variation
    float alpha = 0.8 + pressure * 0.2;
    
    gl_FragColor = vec4(color, alpha);
  }
`

interface PressureVisualizationProps {
  intensity?: number
  visible?: boolean
}

export const PressureVisualization: React.FC<PressureVisualizationProps> = ({
  intensity = 1.0,
  visible = true,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Define pressure gradient colors
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      intensity: { value: intensity },
      colorLow: { value: new THREE.Color(0x0066ff) }, // Blue (low pressure)
      colorMid: { value: new THREE.Color(0x00ff88) }, // Green (medium pressure)
      colorHigh: { value: new THREE.Color(0xff6600) }, // Orange (high pressure)
    }),
    [intensity]
  )

  // Animate the pressure visualization
  useFrame(state => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
      materialRef.current.uniforms.intensity.value = visible ? intensity : 0
    }
  })

  return (
    // PRESSURE VISUALIZATION POSITIONING:
    // UPDATED FOR BLENDER COORDINATE SYSTEM CONVERSION
    // position: [x, y, z] - where the pressure overlay appears
    // rotation: [x, y, z] - orientation of the pressure plane
    <mesh position={[-2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={visible}>
      {/* ADJUST PRESSURE OVERLAY POSITION (BLENDER CONVERTED):
          - Wings are along X-axis: [-2, 0.01, 0] = left wing, [2, 0.01, 0] = right wing
          - Adjust height above wing surface: change y-value [-2, 0.05, 0] (higher) or [-2, 0.001, 0] (lower)
          - Move along wing span: change x-value [-3, 0.01, 0] (further out) or [-1, 0.01, 0] (closer to fuselage)
          - Move along fuselage: change z-value [-2, 0.01, 1] (toward tail) or [-2, 0.01, -1] (toward nose)
          
          PRESSURE PLANE SIZE:
          - planeGeometry args: [width, height, segments_x, segments_y]
          - Current: [2, 1.5] = 2 units wide, 1.5 units tall (adjusted for aircraft scale)
          - Make larger: [3, 2] or smaller: [1.5, 1]
      */}
      <planeGeometry args={[2, 1.5, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Sensor dots component for detailed view
export const SensorDots: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(state => {
    if (groupRef.current && visible) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          // Pulsing effect for sensors
          const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + i * 0.5) * 0.2
          child.scale.setScalar(scale)
        }
      })
    }
  })

  const sensorPositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const rows = 6 // Reduced for better proportion
    const cols = 8 // Reduced for better proportion

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Adjusted spacing for Blender coordinate conversion
        const x = (j - cols / 2) * 0.15 // Along wing span (X-axis)
        const z = (i - rows / 2) * 0.2 // Along fuselage (Z-axis)
        positions.push([x, 0, z])
      }
    }

    return positions
  }, [])

  return (
    // SENSOR DOTS POSITIONING:
    // UPDATED FOR BLENDER COORDINATE SYSTEM CONVERSION
    // position: [x, y, z] - where the sensor grid appears
    <group ref={groupRef} position={[-2, 0.05, 0]} visible={visible}>
      {/* ADJUST SENSOR GRID POSITION (BLENDER CONVERTED):
          - Wings are along X-axis: [-2, 0.05, 0] = left wing, [2, 0.05, 0] = right wing
          - Adjust height above wing surface: change y-value [-2, 0.1, 0] (higher) or [-2, 0.02, 0] (lower)
          - Move along wing span: change x-value [-3, 0.05, 0] (further out) or [-1, 0.05, 0] (closer to fuselage)
          - Move along fuselage: change z-value [-2, 0.05, 1] (toward tail) or [-2, 0.05, -1] (toward nose)
          
          SENSOR GRID DENSITY:
          - Current: 6 rows × 8 columns = 48 sensors (adjusted for scale)
          - More sensors: increase rows/cols (e.g., rows = 8, cols = 10)
          - Fewer sensors: decrease rows/cols (e.g., rows = 4, cols = 6)
          
          SENSOR SPACING:
          - X-direction (wing span): 0.15 units between sensors
          - Z-direction (fuselage): 0.2 units between sensors
          - Closer together: reduce to 0.1 and 0.15
          - Further apart: increase to 0.2 and 0.25
      */}
      {sensorPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.01, 8, 8]} />
          {/* SENSOR DOT SIZE:
              - Current: radius 0.01 (adjusted for aircraft scale)
              - Larger dots: change to 0.015 or 0.02
              - Smaller dots: change to 0.008 or 0.005
          */}
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}
