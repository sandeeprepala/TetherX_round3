import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/patient': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/doctor': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/query': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
})


