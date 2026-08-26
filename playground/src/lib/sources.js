/** The file in each problem folder whose default export gets previewed. */
export const ENTRY_FILENAME = 'Solution.jsx'

/**
 * Turn a flat `import.meta.glob` result keyed by path:
 *   { './star-rating/Solution.jsx': '<source>' }
 * into per-problem ordered file lists:
 *   { 'star-rating': [{ name: 'Solution.jsx', code: '<source>' }] }
 *
 * The entry file is listed first so the Code tab opens on the component
 * itself rather than on a stylesheet; everything else follows alphabetically.
 */
export function groupSourcesByProblem(globResult) {
  const grouped = {}

  for (const [path, code] of Object.entries(globResult)) {
    // './<problem-id>/<file>' -> ['', '<problem-id>', '<file>']
    const segments = path.split('/')
    if (segments.length !== 3) continue

    const [, problemId, name] = segments
    if (!grouped[problemId]) grouped[problemId] = []
    grouped[problemId].push({ name, code })
  }

  for (const files of Object.values(grouped)) {
    files.sort((a, b) => {
      if (a.name === ENTRY_FILENAME) return -1
      if (b.name === ENTRY_FILENAME) return 1
      return a.name.localeCompare(b.name)
    })
  }

  return grouped
}
