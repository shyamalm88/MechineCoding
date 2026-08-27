import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/**
 * One app, two collections.
 *
 * COLLECTION picks which loader `#collection` resolves to. Because App.jsx
 * imports the alias (not both loaders), only the selected collection's
 * import.meta.glob is in the module graph -- so each build bundles just its
 * own problems instead of shipping both.
 *
 *   npm run build      → problems  → ../playground-build
 *   npm run build:dsa  → dsa       → ../dsa-build
 */
const collection = process.env.COLLECTION ?? 'problems'
const outDir = process.env.OUT_DIR ?? '../playground-build'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '#collection': fileURLToPath(new URL(`./src/${collection}/loader.js`, import.meta.url)),
    },
  },
  build: { outDir, emptyOutDir: true },
})
