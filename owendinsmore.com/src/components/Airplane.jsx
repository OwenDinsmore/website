// src/components/Airplane.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '../utils/useKeyboardControls'
import { Vector3 } from 'three'

export function Plane() {
  const planeRef = useRef()
  const controls = useKeyboardControls()
  
  // Flight parameters
  const ROTATION_SPEED = 0.02
  const FORWARD_SPEED = 0.5
  const MAX_PITCH = Math.PI / 4

  useFrame((state, delta) => {
    if (!planeRef.current) return

    const plane = planeRef.current

    // Apply rotation based on keyboard input
    if (controls.left) plane.rotation.y += ROTATION_SPEED
    if (controls.right) plane.rotation.y -= ROTATION_SPEED
    if (controls.up) {
      plane.rotation.x = Math.max(-MAX_PITCH, plane.rotation.x - ROTATION_SPEED)
    }
    if (controls.down) {
      plane.rotation.x = Math.min(MAX_PITCH, plane.rotation.x + ROTATION_SPEED)
    }
    if (controls.rollLeft) plane.rotation.z += ROTATION_SPEED
    if (controls.rollRight) plane.rotation.z -= ROTATION_SPEED

    // Move forward in the direction the plane is facing
    const direction = plane.getWorldDirection(new Vector3())
    plane.position.addScaledVector(direction, FORWARD_SPEED)

    // Update camera position to follow the plane
    const cameraOffset = new THREE.Vector3(0, 5, -15)
    cameraOffset.applyQuaternion(plane.quaternion)
    state.camera.position.copy(plane.position).add(cameraOffset)
    state.camera.lookAt(plane.position)
  })

  return (
    <group ref={planeRef} position={[0, 20, 0]}>
      {/* Airplane body */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.8, 4, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      
      {/* Wings */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.2, 1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Tail */}
      <mesh position={[-1.5, 0.5, 0]}>
        <boxGeometry args={[1, 1, 0.2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </group>
  )
}