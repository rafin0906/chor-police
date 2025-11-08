import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000' // for local dev
    }
  },
  define: {
    __API_BASE_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://chor-police-backend.onrender.com'
        : ''
    ),
  },
  plugins: [react(), tailwindcss()],
})
