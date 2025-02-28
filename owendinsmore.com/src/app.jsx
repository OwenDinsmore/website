// src/App.jsx
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import Scene from './components/Scene'
import { useState, useEffect } from 'react'

function ControlsOverlay() {
  const [showControls, setShowControls] = useState(true)
  
  // Hide controls after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 10000)
    
    // Show controls when pressing H
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'h') {
        setShowControls(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  if (!showControls) return null
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Controls (press H to toggle)</div>
      <div style={{ marginBottom: '5px', textDecoration: 'underline' }}>Flight Controls:</div>
      <div>W/S: Pitch up/down (W=up, S=down)</div>
      <div>A/D: Roll left/right (A=left, D=right)</div>
      <div>Q/E: Yaw left/right (Q=left, E=right)</div>
      <div>Shift/Ctrl: Speed up/down (Shift=up, Ctrl=down)</div>
      <div style={{ marginTop: '10px', marginBottom: '5px', textDecoration: 'underline' }}>Camera Controls:</div>
      <div>Left Mouse Button + Drag: Orbit camera</div>
      <div>Mouse Wheel: Zoom in/out</div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ControlsOverlay />
      <Canvas
        camera={{
          position: [0, 10, 20],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
      >
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Scene />
      </Canvas>
    </div>
  )
}