import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Baseball Coach',
        short_name: 'BaseballCoach',
        description: 'Learn baseball plays with Coach!',
        theme_color: '#1e4d2b',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/baseball-favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  base: '/sandbox/baseball-coach/',
  server: { port: 5174 }
})
