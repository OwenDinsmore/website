import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Changed to Vite's default port
    open: true,
    host: true,
    strictPort: true
  }
})