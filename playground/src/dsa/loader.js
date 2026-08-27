import registry from './index.json'
import { groupSourcesByProblem } from '../lib/sources.js'

/**
 * DSA collection loader.
 *
 * Mirrors problems/loader.js, but DSA entries are algorithm implementations:
 * there is no Solution.jsx and nothing to preview, so every problem renders as
 * a description plus its source in the Code tab.
 */
export const COLLECTION = { id: 'dsa', brand: 'DSA' }

const sourceTexts = import.meta.glob('./*/*.js', {
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

export function loadProblem(id) {
  const entry = registry.find((problem) => problem.id === id)
  if (!entry) throw new Error(`Unknown problem id: ${id}`)

  const markdown = markdownTexts[`./${id}/problem.md`]
  if (markdown === undefined) throw new Error(`Problem "${id}" is missing problem.md`)

  const files = sourcesByProblem[id] ?? []
  if (files.length === 0) throw new Error(`Problem "${id}" has no source file`)

  return { ...entry, Component: null, markdown, files, css: '' }
}
