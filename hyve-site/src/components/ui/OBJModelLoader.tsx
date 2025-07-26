import { useLoader } from '@react-three/fiber'
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

interface OBJModelProps {
  objUrl: string
  mtlUrl?: string
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  onLoad?: (object: THREE.Group) => void
  materialOverride?: THREE.Material
}

interface OBJWithMaterialsProps extends OBJModelProps {
  mtlUrl: string
}

// Component for loading OBJ with MTL materials
const OBJWithMaterials: React.FC<OBJWithMaterialsProps> = ({
  objUrl,
  mtlUrl,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onLoad,
}) => {
  const materials = useLoader(MTLLoader, mtlUrl)
  const obj = useLoader(OBJLoader, objUrl, loader => {
    materials.preload()
    loader.setMaterials(materials)
  })
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (obj) {
      // Center the model
      const box = new THREE.Box3().setFromObject(obj)
      const center = box.getCenter(new THREE.Vector3())
      obj.position.sub(center)

      // Apply materials and shadows
      obj.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      if (onLoad) {
        onLoad(obj)
      }
    }
  }, [obj, onLoad])

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={obj} />
    </group>
  )
}

// Component for loading OBJ without materials
const OBJWithoutMaterials: React.FC<Omit<OBJModelProps, 'mtlUrl'>> = ({
  objUrl,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onLoad,
  materialOverride,
}) => {
  const obj = useLoader(OBJLoader, objUrl)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (obj) {
      // Apply material override if provided
      if (materialOverride) {
        obj.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.material = materialOverride
            child.castShadow = true
            child.receiveShadow = true
          }
        })
      }

      // Center the model
      const box = new THREE.Box3().setFromObject(obj)
      const center = box.getCenter(new THREE.Vector3())
      obj.position.sub(center)

      if (onLoad) {
        onLoad(obj)
      }
    }
  }, [obj, materialOverride, onLoad])

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={obj} />
    </group>
  )
}

// Main OBJModel component that chooses the appropriate loader
export const OBJModel: React.FC<OBJModelProps> = props => {
  if (props.mtlUrl) {
    return <OBJWithMaterials {...props} mtlUrl={props.mtlUrl} />
  } else {
    return <OBJWithoutMaterials {...props} />
  }
}

// Example usage instructions for your aircraft model
export const AircraftOBJExample = `
// To use your aircraft OBJ model with MTL materials:

<OBJModel 
  objUrl="/models/aircraft.obj"
  mtlUrl="/models/aircraft.mtl"
  scale={0.01} // Adjust based on your model's size
  position={[0, 0, 0]}
  rotation={[0, Math.PI, 0]} // Adjust orientation
/>

// Or without MTL (with material override):
<OBJModel 
  objUrl="/models/aircraft.obj"
  scale={0.01}
  materialOverride={
    new THREE.MeshStandardMaterial({
      color: "#2D3748",
      metalness: 0.8,
      roughness: 0.2,
    })
  }
/>
`
