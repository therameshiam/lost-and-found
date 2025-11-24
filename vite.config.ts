import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Using './' makes the app path-agnostic.
  // It allows it to work on user.github.io/repo/ OR user.github.io/ regardless of the folder name.
  base: './', 
})