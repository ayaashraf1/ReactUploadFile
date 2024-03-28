import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),viteCommonjs()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
    tsConfigPath: './tsconfig.json'
  }
})
