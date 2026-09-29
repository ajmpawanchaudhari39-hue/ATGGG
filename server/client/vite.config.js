import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh' // or your standard react plugin

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 Add this line to force relative asset paths
})
