import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: './extension',

    rollupOptions: {
      input: ['src/main.js'],
      output: {
        entryFileNames: 'build/bundle.js',
        assetFileNames: 'build/bundle.css',
      }
    },
  }
})
