import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
	  { find: /^leaflet$/, replacement: resolve(__dirname, 'src', 'shims', 'leaflet.js') },
      { find: /^leaflet-draw$/, replacement: resolve(__dirname, 'src', 'shims', 'leaflet-draw.js') },
    ],
  },
  plugins: [react(), tailwindcss()],
})
