import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextHash } from './hashState.js'

test('sets a key on an empty hash', () => {
  assert.equal(nextHash('', 'cat', 'Greedy', 'All'), '#cat=Greedy')
})

test('keeps existing keys when setting another', () => {
  assert.equal(nextHash('#cat=Greedy', 'diff', 'Hard', 'All'), '#cat=Greedy&diff=Hard')
})

test('overwrites a key already present', () => {
  assert.equal(nextHash('#cat=Greedy', 'cat', 'Graphs', 'All'), '#cat=Graphs')
})

test('drops a key set back to its default', () => {
  assert.equal(nextHash('#cat=Greedy&diff=Hard', 'diff', 'All', 'All'), '#cat=Greedy')
})

test('returns an empty string once the last key is dropped', () => {
  assert.equal(nextHash('#cat=Greedy', 'cat', 'All', 'All'), '')
})

test('treats empty string and null as "not set"', () => {
  assert.equal(nextHash('#q=abc', 'q', '', ''), '')
  assert.equal(nextHash('#p=candy', 'p', null, null), '')
})

test('tolerates a hash with no leading #', () => {
  assert.equal(nextHash('cat=Greedy', 'diff', 'Easy', 'All'), '#cat=Greedy&diff=Easy')
})

test('encodes values that need it', () => {
  assert.equal(nextHash('', 'cat', 'Arrays & Hashing', 'All'), '#cat=Arrays+%26+Hashing')
  assert.equal(
    new URLSearchParams(nextHash('', 'cat', 'Arrays & Hashing', 'All').slice(1)).get('cat'),
    'Arrays & Hashing',
  )
})

test('a non-default value survives a round trip', () => {
  const hash = nextHash(nextHash('', 'cat', 'Greedy', 'All'), 'p', 'candy', null)
  const params = new URLSearchParams(hash.slice(1))
  assert.equal(params.get('cat'), 'Greedy')
  assert.equal(params.get('p'), 'candy')
})
