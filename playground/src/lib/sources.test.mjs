import { test } from 'node:test'
import assert from 'node:assert/strict'
import { groupSourcesByProblem, ENTRY_FILENAME } from './sources.js'

test('ENTRY_FILENAME is Solution.jsx', () => {
  assert.equal(ENTRY_FILENAME, 'Solution.jsx')
})

test('groups files under their problem id', () => {
  const grouped = groupSourcesByProblem({
    './star-rating/Solution.jsx': 'jsx source',
    './star-rating/styles.css': 'css source',
    './debounce/Solution.jsx': 'demo source',
  })

  assert.deepEqual(Object.keys(grouped).sort(), ['debounce', 'star-rating'])
  assert.equal(grouped['star-rating'].length, 2)
  assert.equal(grouped.debounce.length, 1)
})

test('each file carries its name and contents', () => {
  const grouped = groupSourcesByProblem({
    './debounce/Solution.jsx': 'demo source',
  })

  assert.deepEqual(grouped.debounce[0], {
    name: 'Solution.jsx',
    code: 'demo source',
  })
})

test('Solution.jsx sorts first regardless of glob order', () => {
  const grouped = groupSourcesByProblem({
    './debounce/debounce.js': 'util',
    './debounce/Solution.jsx': 'demo',
  })

  assert.deepEqual(
    grouped.debounce.map((file) => file.name),
    ['Solution.jsx', 'debounce.js'],
  )
})

test('remaining files sort alphabetically after the entry file', () => {
  const grouped = groupSourcesByProblem({
    './x/styles.css': 'c',
    './x/helpers.js': 'b',
    './x/Solution.jsx': 'a',
  })

  assert.deepEqual(
    grouped.x.map((file) => file.name),
    ['Solution.jsx', 'helpers.js', 'styles.css'],
  )
})

test('ignores paths that are not two segments deep', () => {
  const grouped = groupSourcesByProblem({
    './loose.js': 'not in a problem folder',
    './x/Solution.jsx': 'kept',
  })

  assert.deepEqual(Object.keys(grouped), ['x'])
})

test('returns an empty object for an empty glob result', () => {
  assert.deepEqual(groupSourcesByProblem({}), {})
})
