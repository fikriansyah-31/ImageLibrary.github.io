import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Determine the base URL based on the GitHub Pages URL
const base =
  process.env.NODE_ENV === 'production'
    ? '/imagelibrary.github.io/' // Use the repository name as the base
    : '/';

// https://vitejs.dev/config/
export default defineConfig({
  base, // Set the base URL
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
