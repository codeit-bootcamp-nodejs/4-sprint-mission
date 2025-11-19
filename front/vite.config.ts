import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/product': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/post': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/comment': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/like': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/notification': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})

