// src/components/Terrain.jsx

// The simplest possible version
export function Terrain() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[50, 1, 50]} />
      <meshStandardMaterial color="green" />
    </mesh>
  )
}