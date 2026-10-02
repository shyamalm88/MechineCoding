# Process many items with only a few calls in flight

Run 500 requests but never more than N concurrently — the standard fix for
rate limits and connection exhaustion.

## The worker-pool pattern

```js
let index = 0
async function worker() {
  while (index < tasks.length) {
    const currentIndex = index++          // claim an index
    results[currentIndex] = await tasks[currentIndex]()
  }
}
await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
```

`executeWithLimit(tasks, limit)` takes an array of task *functions*. It starts `limit` workers; each pulls the next index and loops until the queue is
empty. `cursor++` is atomic here because JavaScript is single-threaded — no lock
needed, and worth saying explicitly in an interview.

## Why not chunk into batches?

```js
for (const batch of chunk(tasks, 3)) await Promise.all(batch.map((t) => t()))  // ✗
```

A batch cannot start until its **slowest** member finishes, so with durations
`[50, 20, 40]` two workers sit idle for 30ms. The pool keeps all N busy
continuously — meaningfully faster with variable-latency work.

## Preserve input order

Assign `results[currentIndex]`, never `results.push()`. With concurrency the completion
order is arbitrary, and pushing scrambles results relative to input.

## Error handling is a design decision

As written, one rejection fails the whole thing (via `Promise.all`). Often you
want every result regardless — wrap each task so it settles individually and
return `{status, value|reason}` per item, exactly as `allSettled` does.

## Related

- `executeWithLimit(tasks, 1)` is sequential execution.
- Real-world equivalents: `p-limit`, `p-map`.
- If tasks generate more tasks, you want a proper queue rather than a fixed
  item list.
