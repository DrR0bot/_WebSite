# 3D Models Directory

This directory is for storing 3D model files used in the aircraft animation.

## Adding Your Aircraft Model

### Option 1: Using OBJ Files (Current Setup)

1. **Place your aircraft files here:**
   - `aircraft.obj` - The main aircraft model
   - `aircraft.mtl` - Material file (if available)
   - Any texture files referenced by the MTL

2. **File naming convention:**
   - Main model: `aircraft.obj`
   - Wings (if separate): `aircraft-wing-left.obj`, `aircraft-wing-right.obj`
   - Other parts: `aircraft-[part-name].obj`

### Option 2: Converting to GLTF (Recommended)

GLTF/GLB files offer better performance and features:

1. **Convert your OBJ to GLTF using:**
   - [Blender](https://www.blender.org/) (Free, recommended)
   - [Online converter](https://products.aspose.app/3d/conversion/obj-to-gltf)
   - Command line: `obj2gltf -i aircraft.obj -o aircraft.glb`

2. **Place the converted file here:**
   - `aircraft.glb` or `aircraft.gltf`

3. **Update the component to use GLTF:**
   ```tsx
   import { useGLTF } from '@react-three/drei'
   
   const { scene } = useGLTF('/models/aircraft.glb')
   ```

## Model Requirements

- **Scale:** Models should be reasonably sized (not too large or small)
- **Origin:** Centered at (0, 0, 0) for proper rotation
- **Orientation:** Facing positive Z-axis
- **Optimization:** Keep polygon count reasonable for web performance

## Wing Surface Identification

For the sensor visualization to work correctly on your model:

1. **Name your wing meshes appropriately:**
   - Left wing: Include "wing_left" or "wing-left" in the mesh name
   - Right wing: Include "wing_right" or "wing-right" in the mesh name

2. **Or define in code:**
   ```tsx
   // In AircraftAnimation.tsx
   const wingMeshNames = ['Wing_L', 'Wing_R', 'your-wing-names']
   ```

## Troubleshooting

- **Model not loading:** Check browser console for errors
- **Model too large/small:** Adjust the `scale` prop in OBJModel component
- **Wrong orientation:** Adjust the `rotation` prop
- **Performance issues:** Reduce polygon count or use GLTF format 