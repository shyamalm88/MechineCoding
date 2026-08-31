import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toggle, summarise, PASSES } from './progress.js'

const problems = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

test('toggling an untracked problem records just that pass', () => {
  assert.deepEqual(toggle({}, 'a', 0), { a: [true, false] })
})

test('toggling the second pass leaves the first alone', () => {
  assert.deepEqual(toggle({ a: [true, false] }, 'a', 1), { a: [true, true] })
})

test('toggling off removes the entry entirely when nothing is left', () => {
  assert.deepEqual(toggle({ a: [true, false] }, 'a', 0), {})
})

test('toggling off keeps the entry when another pass is still ticked', () => {
  assert.deepEqual(toggle({ a: [true, true] }, 'a', 0), { a: [false, true] })
})

test('does not mutate the input map', () => {
  const before = { a: [true, false] }
  toggle(before, 'a', 1)
  assert.deepEqual(before, { a: [true, false] })
})

test('other problems are untouched', () => {
  assert.deepEqual(toggle({ a: [true, true] }, 'b', 0), { a: [true, true], b: [true, false] })
})

test('summarise counts only FULLY revised problems as done', () => {
  const s = summarise({ a: [true, false], b: [true, true] }, problems)
  assert.equal(s.done, 1)
  assert.equal(s.ticks, 3)
  assert.equal(s.total, 3)
  assert.equal(s.totalTicks, 3 * PASSES)
})

test('percent is done/total, not ticks/totalTicks', () => {
  // One of three problems finished = 33%, even though 3 of 6 boxes are ticked.
  assert.equal(summarise({ a: [true, false], b: [true, true] }, problems).percent, 33)
})

test('empty progress is 0%', () => {
  assert.equal(summarise({}, problems).percent, 0)
})

test('all done is 100%', () => {
  const all = { a: [true, true], b: [true, true], c: [true, true] }
  assert.equal(summarise(all, problems).percent, 100)
})

test('an empty problem list does not divide by zero', () => {
  assert.equal(summarise({}, []).percent, 0)
})

test('stale ids in storage do not inflate the count', () => {
  const s = summarise({ deleted: [true, true] }, problems)
  assert.equal(s.done, 0)
  assert.equal(s.ticks, 0)
})
