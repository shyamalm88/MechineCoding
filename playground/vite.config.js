import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds into ../playground-build/, which is committed and linked from the
// root hub page -- same source/output split as Theory/ -> theory-notes/.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../playground-build',
    emptyOutDir: true,
  },
})
