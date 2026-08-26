import { test } from 'node:test'
import assert from 'node:assert/strict'
import { collectProblemErrors } from './validate-problems.mjs'

const VALID_ENTRY = {
  id: 'debounce',
  title: 'Debounce',
  category: 'JavaScript',
  difficulty: 'Medium',
}

const ALL_PRESENT = { hasSolution: () => true, hasMarkdown: () => true }

test('no errors when every entry has matching files on disk', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    ...ALL_PRESENT,
  })
  assert.deepEqual(errors, [])
})

test('reports a registry entry with no folder on disk', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: [],
    hasSolution: () => false,
    hasMarkdown: () => false,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /debounce.*no folder/i)
})

test('reports a folder missing Solution.jsx', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    hasSolution: () => false,
    hasMarkdown: () => true,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /Solution\.jsx/)
})

test('reports a folder missing problem.md', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    hasSolution: () => true,
    hasMarkdown: () => false,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /problem\.md/)
})

test('reports an orphan folder missing from the registry', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce', 'orphaned'],
    ...ALL_PRESENT,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /orphaned.*not in the registry/i)
})

test('reports a duplicate id', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY, VALID_ENTRY],
    folders: ['debounce'],
    ...ALL_PRESENT,
  })
  assert.ok(errors.some((error) => /duplicate/i.test(error)))
})

test('reports an entry missing a required metadata field', () => {
  const { difficulty, ...withoutDifficulty } = VALID_ENTRY
  const errors = collectProblemErrors({
    registry: [withoutDifficulty],
    folders: ['debounce'],
    ...ALL_PRESENT,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /difficulty/)
})
