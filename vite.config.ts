import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Support both GitHub Pages (subpath) and Render (root path) deployments
// Set VITE_BASE_PATH in CI for GitHub Pages: '/StockInformationWebsiteFrontend/'
// Leave unset (defaults to '/') for Render and local dev
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});