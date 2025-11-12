import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use a relative base so built assets are referenced relative to the
  // generated `index.html`. This avoids absolute-root asset URLs like
  // `/assets/...` which can break when deployed to GitHub Pages project
  // sites (they must be relative or match the repo name). Using './'
  // works for both project and user pages.
  base: './',
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