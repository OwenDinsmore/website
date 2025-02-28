// src/utils/useKeyboardControls.js
import { useState, useEffect } from 'react'

export function useKeyboardControls() {
  const [keys, setKeys] = useState({
    // Flight controls
    up: false,        // Pitch down (W)
    down: false,      // Pitch up (S)
    left: false,      // Roll left (A)
    right: false,     // Roll right (D)
    yawLeft: false,   // Yaw left (Q)
    yawRight: false,  // Yaw right (E)
    speedUp: false,   // Increase speed (Shift)
    speedDown: false, // Decrease speed (Ctrl)
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for control keys to avoid browser shortcuts
      if (['w', 's', 'a', 'd', 'q', 'e', 'shift', 'control'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
      
      switch (e.key.toLowerCase()) {
        // Flight controls
        case 'w': setKeys(keys => ({ ...keys, up: true })); break
        case 's': setKeys(keys => ({ ...keys, down: true })); break
        case 'a': setKeys(keys => ({ ...keys, left: true })); break
        case 'd': setKeys(keys => ({ ...keys, right: true })); break
        case 'q': setKeys(keys => ({ ...keys, yawLeft: true })); break
        case 'e': setKeys(keys => ({ ...keys, yawRight: true })); break
        case 'shift': setKeys(keys => ({ ...keys, speedUp: true })); break
        case 'control': setKeys(keys => ({ ...keys, speedDown: true })); break
      }
    }

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        // Flight controls
        case 'w': setKeys(keys => ({ ...keys, up: false })); break
        case 's': setKeys(keys => ({ ...keys, down: false })); break
        case 'a': setKeys(keys => ({ ...keys, left: false })); break
        case 'd': setKeys(keys => ({ ...keys, right: false })); break
        case 'q': setKeys(keys => ({ ...keys, yawLeft: false })); break
        case 'e': setKeys(keys => ({ ...keys, yawRight: false })); break
        case 'shift': setKeys(keys => ({ ...keys, speedUp: false })); break
        case 'control': setKeys(keys => ({ ...keys, speedDown: false })); break
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