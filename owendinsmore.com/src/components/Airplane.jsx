// src/components/Airplane.jsx
import { useRef, Suspense, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useKeyboardControls } from '../utils/useKeyboardControls'
import { Vector3, MathUtils, Quaternion, Euler } from 'three'

// Simple placeholder component to render while model is loading
function SimpleAirplane() {
  return (
    <>
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
    </>
  )
}

// Model component that loads the GLB
function JetModel() {
  const { scene } = useGLTF('/models/Jet_Lowpoly.glb')
  return <primitive object={scene} />
}

export function Plane() {
  const planeRef = useRef()
  const controls = useKeyboardControls()
  const { gl, camera } = useThree()
  
  // Track state for adjustable flight parameters
  const [speed, setSpeed] = useState(0.5)
  const [pitchInput, setPitchInput] = useState(0)
  const [rollInput, setRollInput] = useState(0)
  const [yawInput, setYawInput] = useState(0)
  
  // Camera orbiting state
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouseX, setLastMouseX] = useState(0)
  const [lastMouseY, setLastMouseY] = useState(0)
  const [cameraAngleHorizontal, setCameraAngleHorizontal] = useState(0)
  const [cameraAngleVertical, setCameraAngleVertical] = useState(0.5) // Start slightly elevated
  const [cameraDistance, setCameraDistance] = useState(25)
  
  // Flight parameters
  const ROTATION_SPEED = 0.03
  const MIN_SPEED = 0.2
  const MAX_SPEED = 1.5
  const SPEED_CHANGE_RATE = 0.02
  const SMOOTHING_FACTOR = 0.08 // Lower = smoother but slower response

  // Set up event listeners for mouse control of camera
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 0) { // Left mouse button
        setIsDragging(true)
        setLastMouseX(e.clientX)
        setLastMouseY(e.clientY)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - lastMouseX
        const deltaY = e.clientY - lastMouseY
        
        // Horizontal orbit (left/right)
        setCameraAngleHorizontal(prev => {
          return MathUtils.euclideanModulo(prev - deltaX * 0.005, Math.PI * 2)
        })
        
        // Vertical orbit (up/down) with limits - INVERTED
        setCameraAngleVertical(prev => {
          return MathUtils.clamp(prev + deltaY * 0.005, -0.8, 1.2) // Changed sign for inversion
        })
        
        setLastMouseX(e.clientX)
        setLastMouseY(e.clientY)
      }
    }

    const handleWheel = (e) => {
      // Zoom with mouse wheel
      setCameraDistance(prev => {
        return MathUtils.clamp(prev + e.deltaY * 0.05, 8, 50)
      })
    }

    // Add event listeners
    const canvas = gl.domElement
    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('wheel', handleWheel)

    return () => {
      // Clean up
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [gl, isDragging, lastMouseX, lastMouseY])

  useFrame((state, delta) => {
    if (!planeRef.current) return

    const plane = planeRef.current

    // Handle speed changes with smoother acceleration
    if (controls.speedUp) {
      setSpeed(prev => Math.min(MAX_SPEED, prev + SPEED_CHANGE_RATE * delta * 60))
    }
    if (controls.speedDown) {
      setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_CHANGE_RATE * delta * 60))
    }

    // Gather control inputs for this frame
    // INVERTED ROLL: Changed the sign of the roll input
    setPitchInput(controls.up ? 1 : controls.down ? -1 : 0) // Inverted pitch
    setRollInput(controls.left ? -1 : controls.right ? 1 : 0) // Inverted roll
    setYawInput(controls.yawLeft ? 1 : controls.yawRight ? -1 : 0)

    // Apply control inputs to the aircraft
    // Pitch control - relative to current roll orientation
    if (pitchInput !== 0) {
      // Create a rotation around the aircraft's local X axis (pitch)
      const pitchDelta = pitchInput * ROTATION_SPEED
      plane.rotateX(pitchDelta)
    }
    
    // Roll control - no auto-leveling
    if (rollInput !== 0) {
      // Apply roll directly around local Z axis
      const rollDelta = rollInput * ROTATION_SPEED
      plane.rotateZ(rollDelta)
    }
    // Auto-leveling removed to maintain roll position
    
    // Yaw control - around local Y axis
    if (yawInput !== 0) {
      const yawDelta = yawInput * ROTATION_SPEED
      plane.rotateY(yawDelta)
    }

    // Move forward in the direction the plane is facing
    const direction = plane.getWorldDirection(new Vector3())
    plane.position.addScaledVector(direction, speed * delta * 60)

    // Update camera position based on orbit angles - uses spherical coordinates
    const horizontalDistance = cameraDistance * Math.cos(cameraAngleVertical)
    const cameraOffset = new Vector3(
      horizontalDistance * Math.sin(cameraAngleHorizontal),
      cameraDistance * Math.sin(cameraAngleVertical),
      horizontalDistance * Math.cos(cameraAngleHorizontal)
    )
    
    // The camera rotates around the plane, but doesn't rotate with the plane
    state.camera.position.copy(plane.position).add(cameraOffset)
    state.camera.lookAt(plane.position)
    
    // Ensure camera up vector stays aligned with world up
    state.camera.up.set(0, 1, 0)
  })

  return (
    <group ref={planeRef} position={[0, 20, 0]} rotation={[0, Math.PI, 0]} scale={2}>
      <Suspense fallback={<SimpleAirplane />}>
        <JetModel />
      </Suspense>
    </group>
  )
}

// Preload the model
useGLTF.preload('/models/Jet_Lowpoly.glb')