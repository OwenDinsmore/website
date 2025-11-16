import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap', 'gsap/ScrollTrigger']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
