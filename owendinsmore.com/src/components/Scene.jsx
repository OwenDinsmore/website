// src/components/Scene.jsx
import { Plane } from './Airplane'

export default function Scene() {
  return (
    <>
      <Plane />
      
      {/* Expanded terrain with simple height variation */}
      <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2000, 2000, 100, 100]} />
        <meshStandardMaterial color="#3a8c3a" />
      </mesh>
      
      {/* Water plane (blue) */}
      <mesh position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5000, 5000]} />
        <meshStandardMaterial color="#3a81a8" transparent opacity={0.8} />
      </mesh>
    </>
  )
}