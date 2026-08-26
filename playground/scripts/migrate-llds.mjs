#!/usr/bin/env node
/**
 * One-shot migration of practice/src/lld/* into playground's problem format.
 *
 * Differences the migration has to reconcile:
 *  - Folder names carry an ordering prefix (lld-012-star-rating) that isn't
 *    wanted as the problem id.
 *  - Solution.jsx files import their stylesheet for its side effect. In the
 *    playground that would inject the CSS globally and leak (these sheets
 *    contain '* {}' and bare 'button {}' rules), so the import is stripped --
 *    the platform injects the CSS scoped instead.
 *  - 12 folders have no problem.md; a stub is written so the loader and
 *    validator have something to work with, flagged for a real description.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = join(here, '..', '..', 'practice', 'src', 'lld')
const DEST = join(here, '..', 'src', 'problems')

// id -> [title, category, difficulty]
const META = {
  'holy-grail': ['Holy Grail Layout', 'Machine Coding', 'Easy'],
  'transfer-list': ['Transfer List', 'Machine Coding', 'Medium'],
  'progress-bars-iv': ['Concurrent Progress Bars', 'Machine Coding', 'Medium'],
  'grid-lights': ['Grid Lights', 'Machine Coding', 'Medium'],
  wordle: ['Wordle', 'Machine Coding', 'Medium'],
  typeahead: ['Typeahead / Autocomplete', 'Machine Coding', 'Medium'],
  'file-explorer': ['File Explorer', 'Machine Coding', 'Medium'],
  'nested-comments': ['Nested Comments', 'Machine Coding', 'Medium'],
  'traffic-light': ['Traffic Light Controller', 'Machine Coding', 'Medium'],
  'promise-progress': ['Promise Progress', 'JavaScript', 'Medium'],
  'infinite-scroll': ['Infinite Scroll', 'Machine Coding', 'Medium'],
  'star-rating-lld': ['Star Rating (LLD)', 'Machine Coding', 'Easy'],
  'circle-collide': ['Circle Collision Detection', 'Machine Coding', 'Medium'],
  carousel: ['Image Carousel', 'Machine Coding', 'Medium'],
  'virtual-list': ['Virtual List', 'Machine Coding', 'Hard'],
  modal: ['Modal / Dialog', 'Machine Coding', 'Medium'],
  'grid-selection': ['Grid Selection', 'Machine Coding', 'Medium'],
  'checkbox-hierarchy': ['Nested Checkboxes', 'Machine Coding', 'Medium'],
  'search-highlighter': ['Search Highlighter', 'Machine Coding', 'Easy'],
  'connect-4': ['Connect 4', 'Machine Coding', 'Medium'],
  'data-table': ['Data Table', 'Machine Coding', 'Medium'],
  'tic-tac-toe-dynamic': ['Tic-Tac-Toe (N x N)', 'Machine Coding', 'Medium'],
  'snake-ladder': ['Snakes and Ladders', 'Machine Coding', 'Medium'],
  'chess-board-knight-shortest-path': ['Knight Shortest Path', 'JavaScript', 'Hard'],
  'chess-board-rook-shortest-path': ['Rook Shortest Path', 'JavaScript', 'Medium'],
  'token-bucket': ['Token Bucket Rate Limiter', 'JavaScript', 'Hard'],
  'calendar-day-view': ['Calendar Day View', 'Machine Coding', 'Hard'],
  'kanban-board': ['Kanban Board', 'Machine Coding', 'Hard'],
  'notification-system': ['Notification System', 'Machine Coding', 'Medium'],
  'poll-widget': ['Poll Widget', 'Machine Coding', 'Easy'],
  'file-explorer-dnd': ['File Explorer with Drag & Drop', 'Machine Coding', 'Hard'],
  'otp-input': ['OTP Input', 'Machine Coding', 'Medium'],
  tabs: ['Tabs', 'Machine Coding', 'Easy'],
  'stepper-wizard': ['Stepper Wizard', 'Machine Coding', 'Medium'],
  'drawing-board': ['Drawing Board', 'Machine Coding', 'Medium'],
  'seat-picker': ['Seat Picker', 'Machine Coding', 'Medium'],
}

// star-rating already exists in the playground as a hand-written seed problem;
// the LLD version is kept under a distinct id rather than overwriting it.
const RENAME = { 'star-rating': 'star-rating-lld' }

const COPY_EXT = /\.(jsx|js|css|md)$/
const STYLE_IMPORT = /^\s*import\s+["']\.\/[^"']*\.css["'];?\s*$/gm

const migrated = []
const stubbed = []

for (const folder of readdirSync(SRC)) {
  const dir = join(SRC, folder)
  if (!statSync(dir).isDirectory()) continue

  const rawId = folder.replace(/^lld-\d+-/, '')
  const id = RENAME[rawId] ?? rawId
  const meta = META[id]
  if (!meta) {
    console.error(`  SKIP ${folder}: no metadata entry for id "${id}"`)
    continue
  }

  const out = join(DEST, id)
  mkdirSync(out, { recursive: true })

  for (const file of readdirSync(dir)) {
    if (!COPY_EXT.test(file)) continue
    let code = readFileSync(join(dir, file), 'utf8')
    // Strip the global stylesheet side-effect import; the platform injects
    // this problem's CSS scoped to its own preview instead.
    if (/\.(jsx|js)$/.test(file)) code = code.replace(STYLE_IMPORT, '')
    writeFileSync(join(out, file), code)
  }

  if (!existsSync(join(out, 'problem.md'))) {
    writeFileSync(
      join(out, 'problem.md'),
      `# ${meta[0]}\n\n> Description not written yet.\n`,
    )
    stubbed.push(id)
  }

  migrated.push({ id, title: meta[0], category: meta[1], difficulty: meta[2] })
}

// Merge into the existing registry, keeping the hand-written seed problems.
const registryPath = join(DEST, 'index.json')
const existing = JSON.parse(readFileSync(registryPath, 'utf8'))
const byId = new Map(existing.map((e) => [e.id, e]))
for (const entry of migrated) byId.set(entry.id, entry)

const merged = [...byId.values()].sort((a, b) => a.title.localeCompare(b.title))
writeFileSync(registryPath, JSON.stringify(merged, null, 2) + '\n')

console.log(`migrated: ${migrated.length}`)
console.log(`registry now has: ${merged.length}`)
console.log(`problem.md stubs needing real descriptions (${stubbed.length}): ${stubbed.join(', ')}`)
