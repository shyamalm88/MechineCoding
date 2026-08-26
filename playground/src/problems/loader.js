import registry from './index.json'
import { groupSourcesByProblem, ENTRY_FILENAME } from '../lib/sources.js'
import { scopeCss } from '../lib/scopeCss.js'

// Vite statically analyses these globs at build time, so every problem folder
// is bundled without a hand-maintained import list. The same Solution.jsx is
// globbed twice -- once as a module to render, once as raw text to display --
// which is what guarantees the Code tab shows exactly the code that ran.
const componentModules = import.meta.glob('./*/Solution.jsx', { eager: true })

const sourceTexts = import.meta.glob('./*/*.{jsx,js,css}', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const markdownTexts = import.meta.glob('./*/problem.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const sourcesByProblem = groupSourcesByProblem(sourceTexts)

export function listProblems() {
  return registry
}

/**
 * Join a registry entry with its on-disk content. Throws loudly on a mismatch
 * rather than rendering an empty workspace -- same fail-loud convention as
 * tools/md-site/build.py.
 */
export function loadProblem(id) {
  const entry = registry.find((problem) => problem.id === id)
  if (!entry) throw new Error(`Unknown problem id: ${id}`)

  const module = componentModules[`./${id}/${ENTRY_FILENAME}`]
  if (!module?.default) {
    throw new Error(`Problem "${id}" is missing a default export in ${ENTRY_FILENAME}`)
  }

  const markdown = markdownTexts[`./${id}/problem.md`]
  if (markdown === undefined) {
    throw new Error(`Problem "${id}" is missing problem.md`)
  }

  const files = sourcesByProblem[id]
  if (!files?.length) {
    throw new Error(`Problem "${id}" has no source files`)
  }

  // Concatenate this problem's stylesheets and confine every rule to its own
  // preview subtree. Injected by PreviewPane rather than imported for its side
  // effect, so one problem's `* { margin: 0 }` can't restyle the app shell.
  const css = files
    .filter((file) => file.name.endsWith('.css'))
    .map((file) => scopeCss(file.code, id))
    .join('\n')

  return { ...entry, Component: module.default, markdown, files, css }
}
