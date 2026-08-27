#!/usr/bin/env node
/**
 * Convert DSA/<Category>/<Importance>/<file>.js into the playground's problem
 * format under src/dsa/.
 *
 * Category and importance come free from the path. Difficulty is not recorded
 * anywhere in the sources, so it comes from scripts/dsa-difficulty.json --
 * anything unlisted falls back to Medium and is reported so the list can be
 * completed rather than silently guessed.
 *
 * Each source file is one giant JSDoc header (problem statement, intuition,
 * dry run) followed by the implementation and console.log tests. The header
 * becomes problem.md; the remainder becomes the code shown in the Code tab.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = join(here, '..', '..', 'DSA')
const DEST = join(here, '..', 'src', 'dsa')
const DIFFICULTY = JSON.parse(readFileSync(join(here, 'dsa-difficulty.json'), 'utf8'))

const IGNORED_DIRS = new Set(['google-2025'])
const CATEGORY_LABEL = {
  'Arrays&Hashset': 'Arrays & Hashing',
  BinarySearch: 'Binary Search',
  DP: 'Dynamic Programming',
  Graph: 'Graphs',
  Heap: 'Heap',
  Stack: 'Stack',
  String: 'Strings',
  'Two-Pointer': 'Two Pointers',
  intervals: 'Intervals',
  matrix: 'Matrix',
  queue: 'Queue & Deque',
  'recursion & backtracking': 'Recursion & Backtracking',
  'sliding-window': 'Sliding Window',
  tree: 'Trees & BST',
  LinkedList: 'Linked List',
  MonotonicStack: 'Monotonic Stack',
}
const IMPORTANCE_LABEL = { core: 'Core', IMP: 'IMP', VVIMP: 'VVIMP', Optional: 'Optional', optional: 'Optional' }

function collect(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) collect(full, acc)
    // Underscore-prefixed files are shared helpers, not problems.
    else if (entry.name.endsWith('.js') && !entry.name.startsWith('_')) acc.push(full)
  }
  return acc
}

/** Split the leading /** ... *\/ block from the code that follows it. */
function splitHeader(source) {
  const trimmed = source.trimStart()
  if (!trimmed.startsWith('/**')) return { header: '', code: source.trim() }
  const end = trimmed.indexOf('*/')
  if (end === -1) return { header: '', code: source.trim() }
  return {
    header: trimmed.slice(3, end),
    code: trimmed.slice(end + 2).trim(),
  }
}

/** Turn a JSDoc comment body into markdown. */
function headerToMarkdown(header, title) {
  const lines = header
    .split('\n')
    .map((line) => line.replace(/^\s*\*ualsehjkl?/, '').replace(/^\s*\* ?/, ''))
    // The sources use long ==== / ---- rules as visual separators; they become
    // markdown setext headings (turning the line above into an <h1>) if kept.
    .filter((line) => !/^[=\-_]{6,}\s*$/.test(line))

  const body = []
  let inCode = false
  for (let line of lines) {
    // "PROBLEM:", "INTUITION:" etc. become headings.
    const label = line.match(/^([A-Z][A-Z0-9 &/()#-]{2,30}):\s*(.*)$/)
    if (label && !inCode) {
      const [, key, rest] = label
      if (key === 'PROBLEM') { if (rest.trim()) body.push(`> ${rest.trim()}`, '') ; continue }
      body.push('', `## ${key.charAt(0) + key.slice(1).toLowerCase()}`, '')
      if (rest.trim()) body.push(rest.trim())
      continue
    }
    body.push(line)
  }

  // Indented blocks (examples, dry runs, ASCII diagrams) become fenced code so
  // markdown does not mangle the alignment.
  const out = []
  let buffer = []
  const flush = () => {
    if (!buffer.length) return
    while (buffer.length && !buffer[buffer.length - 1].trim()) buffer.pop()
    if (buffer.length) out.push('```text', ...buffer, '```', '')
    buffer = []
  }
  for (const line of body) {
    if (/^\s{2,}\S/.test(line)) buffer.push(line)
    else { flush(); out.push(line) }
  }
  flush()

  return `# ${title}\n\n${out.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}

function slugify(name) {
  return name
    .replace(/\.js$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

const files = collect(SRC)
// Wipe only the generated problem DIRECTORIES, never the whole folder --
// src/dsa/loader.js is hand-written and lives here too. (Same scoped-deletion
// rule as tools/md-site/build.py, which clears notes/ and assets/ but leaves
// a hand-authored README.md alone.)
mkdirSync(DEST, { recursive: true })
for (const entry of readdirSync(DEST, { withFileTypes: true })) {
  if (entry.isDirectory()) rmSync(join(DEST, entry.name), { recursive: true })
}

const registry = []
const seen = new Set()
const missingDifficulty = []

for (const file of files) {
  const rel = file.slice(SRC.length + 1)
  const parts = rel.split('/')
  if (parts.length < 3) continue // top-level helper scripts

  const [categoryDir, importanceDir] = parts
  const category = CATEGORY_LABEL[categoryDir] ?? categoryDir
  const importance = IMPORTANCE_LABEL[importanceDir] ?? importanceDir

  const source = readFileSync(file, 'utf8')
  const { header, code } = splitHeader(source)
  const titleMatch = header.match(/PROBLEM:\s*(.+)/)
  const rawTitle = (titleMatch ? titleMatch[1] : basename(file, '.js')).trim()

  // With 226 rows in one sidebar, "(LeetCode #200)" in every title destroys
  // scannability. Keep the number as a compact suffix and drop the decoration
  // and trailing editorial notes ("— ONE transaction", "⭐ HARD").
  const lc = rawTitle.match(/#(\d+)/)?.[1]
  const title =
    rawTitle
      .replace(/\s*\((?:LeetCode|Leetcode|LC)\s*#\d+[^)]*\)/, '')
      .replace(/\s*[—–-]\s*(ONE|UNLIMITED|AT MOST|Classic)[^|]*$/i, '')
      .replace(/\s*⭐?\s*(HARD|EASY|MEDIUM)\s*$/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim() + (lc ? ` #${lc}` : '')

  let id = slugify(basename(file))
  while (seen.has(id)) id = `${id}-2`
  seen.add(id)

  // Resolve by LeetCode number first -- it is stable, whereas titles carry
  // suffixes like "⭐ HARD" or "— ONE transaction".
  const lcNumber = lc
  const difficulty =
    (lcNumber && DIFFICULTY.__byNumber[lcNumber]) ??
    DIFFICULTY.__byTitle[rawTitle] ??
    (lcNumber ? 'Medium' : null)
  if (!difficulty) missingDifficulty.push(rawTitle)

  const dir = join(DEST, id)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'problem.md'), headerToMarkdown(header, rawTitle))
  writeFileSync(join(dir, basename(file)), code + '\n')

  registry.push({ id, title, category, difficulty: difficulty ?? 'Medium', importance })
}

registry.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
writeFileSync(join(DEST, 'index.json'), JSON.stringify(registry, null, 2) + '\n')

console.log(`migrated ${registry.length} DSA problems`)
console.log(`categories: ${new Set(registry.map((r) => r.category)).size}`)
if (missingDifficulty.length) {
  console.log(`\n${missingDifficulty.length} without an explicit difficulty (defaulted to Medium):`)
  missingDifficulty.slice(0, 10).forEach((t) => console.log('   ' + t))
  if (missingDifficulty.length > 10) console.log(`   … and ${missingDifficulty.length - 10} more`)
}
