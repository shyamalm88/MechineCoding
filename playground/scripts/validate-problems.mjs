#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REQUIRED_FIELDS = ['id', 'title', 'category', 'difficulty']
const ENTRY_FILENAME = 'Solution.jsx'

/**
 * Pure comparison of a registry against what's on disk. Filesystem access is
 * injected so this is directly unit-testable.
 */
export function collectProblemErrors({ registry, folders, hasMarkdown }) {
  const errors = []
  // Two sets on purpose: `claimed` is every id the registry mentions at all,
  // `validated` is only those that passed field validation. The orphan check
  // below uses `claimed`, so an entry rejected for a missing field doesn't ALSO
  // get its folder reported as an orphan -- one fault, one error message.
  const claimed = new Set()
  const validated = new Set()
  const folderSet = new Set(folders)

  for (const entry of registry) {
    const { id } = entry
    if (id) claimed.add(id)

    const missingFields = REQUIRED_FIELDS.filter((field) => !entry[field])
    if (missingFields.length > 0) {
      errors.push(
        `Registry entry "${id ?? '<no id>'}" is missing required field(s): ` +
          missingFields.join(', '),
      )
      continue
    }

    if (validated.has(id)) {
      errors.push(`Duplicate registry id: ${id}`)
      continue
    }
    validated.add(id)

    if (!folderSet.has(id)) {
      errors.push(`Problem "${id}" is in the registry but has no folder on disk`)
      continue
    }

    // Solution.jsx is optional: conceptual problems are description-only and
    // render no preview. problem.md is always required.
    if (!hasMarkdown(id)) errors.push(`Problem "${id}" is missing problem.md`)
  }

  for (const folder of folders) {
    if (!claimed.has(folder)) {
      errors.push(`Folder "${folder}" exists but is not in the registry`)
    }
  }

  return errors
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url))
  const problemsDir = join(here, '..', 'src', 'problems')

  const registry = JSON.parse(readFileSync(join(problemsDir, 'index.json'), 'utf8'))
  const folders = readdirSync(problemsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  const errors = collectProblemErrors({
    registry,
    folders,
    hasMarkdown: (id) => existsSync(join(problemsDir, id, 'problem.md')),
  })

  if (errors.length > 0) {
    console.error('Problem validation failed:')
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
  }

  console.log(`Problem validation passed (${registry.length} problems).`)
}

// Only run main() when executed directly, so importing this module in tests
// doesn't touch the filesystem or call process.exit().
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
