// src/components/Terrain.jsx
import { useMemo } from 'react'
import { PlaneGeometry } from 'three'

export function Terrain() {
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(1000, 1000, 50, 50)
    const vertices = geo.attributes.position.array
    
    // Add some basic terrain variation
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 1] = Math.sin(vertices[i] / 20) * Math.cos(vertices[i + 2] / 20) * 5
    }
    
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh 
      geometry={geometry} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -10, 0]}
    >
      <meshStandardMaterial 
        color="#458745" 
        wireframe={false}
        roughness={1}
      />
    </mesh>
  )
}