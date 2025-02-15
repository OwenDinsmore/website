// src/App.jsx
import { Canvas } from '@react-three/fiber'
import { Sky, OrbitControls } from '@react-three/drei'
import Scene from './components/Scene'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
        <OrbitControls /> {/* We'll remove this later when implementing the follow camera */}
      </Canvas>
    </div>
  )
}