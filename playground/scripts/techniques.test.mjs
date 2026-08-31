import { test } from 'node:test'
import assert from 'node:assert/strict'
import { detectTechniques } from './techniques.mjs'

test('picks up an explicit BFS mention', () => {
  assert.deepEqual(detectTechniques('INTUITION: Multi-Source BFS'), ['BFS'])
})

test('picks up the spelled-out form', () => {
  assert.deepEqual(detectTechniques('a breadth-first sweep'), ['BFS'])
  assert.deepEqual(detectTechniques('depth first walk'), ['DFS'])
})

test('a problem can carry several tags', () => {
  const tags = detectTechniques('Run DFS, then a topological sort of the result')
  assert.deepEqual(tags, ['DFS', 'Topological Sort'])
})

test('tag order is stable regardless of mention order', () => {
  assert.deepEqual(
    detectTechniques('topological sort after DFS'),
    detectTechniques('DFS then topological sort'),
  )
})

test('"binary search tree" is not the binary-search technique', () => {
  assert.deepEqual(detectTechniques('Search in a Binary Search Tree'), [])
  assert.deepEqual(detectTechniques('use binary search on the answer'), ['Binary Search'])
})

test('does not fire on substrings of unrelated words', () => {
  assert.deepEqual(detectTechniques('the debris field'), [])   // not DFS
  assert.deepEqual(detectTechniques('retries and retrieval'), []) // not Trie
})

test('returns an empty array when nothing matches', () => {
  assert.deepEqual(detectTechniques('just a loop over the array'), [])
})

test('detects heap via priority queue', () => {
  assert.deepEqual(detectTechniques('push onto the priority queue'), ['Heap'])
})
