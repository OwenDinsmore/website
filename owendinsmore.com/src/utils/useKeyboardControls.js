// src/utils/useKeyboardControls.js
import { useState, useEffect } from 'react'

export function useKeyboardControls() {
  const [keys, setKeys] = useState({
    up: false,    // Pitch down (W)
    down: false,  // Pitch up (S)
    left: false,  // Yaw left (A)
    right: false, // Yaw right (D)
    rollLeft: false,  // Roll left (Q)
    rollRight: false, // Roll right (E)
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': setKeys(keys => ({ ...keys, up: true })); break
        case 's': setKeys(keys => ({ ...keys, down: true })); break
        case 'a': setKeys(keys => ({ ...keys, left: true })); break
        case 'd': setKeys(keys => ({ ...keys, right: true })); break
        case 'q': setKeys(keys => ({ ...keys, rollLeft: true })); break
        case 'e': setKeys(keys => ({ ...keys, rollRight: true })); break
      }
    }

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': setKeys(keys => ({ ...keys, up: false })); break
        case 's': setKeys(keys => ({ ...keys, down: false })); break
        case 'a': setKeys(keys => ({ ...keys, left: false })); break
        case 'd': setKeys(keys => ({ ...keys, right: false })); break
        case 'q': setKeys(keys => ({ ...keys, rollLeft: false })); break
        case 'e': setKeys(keys => ({ ...keys, rollRight: false })); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}