# Process many items with only a few calls in flight

Run 500 requests but never more than N concurrently — the standard fix for
rate limits and connection exhaustion.

## The worker-pool pattern

```js
let cursor = 0
async function run() {
  while (cursor < items.length) {
    const i = cursor++          // claim an index
    results[i] = await worker(items[i], i)
  }
}
await Promise.all(Array.from({ length: limit }, run))
```

Start `limit` workers; each pulls the next index and loops until the queue is
empty. `cursor++` is atomic here because JavaScript is single-threaded — no lock
needed, and worth saying explicitly in an interview.

## Why not chunk into batches?

```js
for (const batch of chunk(items, 3)) await Promise.all(batch.map(worker))  // ✗
```

A batch cannot start until its **slowest** member finishes, so with durations
`[50, 20, 40]` two workers sit idle for 30ms. The pool keeps all N busy
continuously — meaningfully faster with variable-latency work.

## Preserve input order

Assign `results[index]`, never `results.push()`. With concurrency the completion
order is arbitrary, and pushing scrambles results relative to input.

## Error handling is a design decision

As written, one rejection fails the whole thing (via `Promise.all`). Often you
want every result regardless — settle each task individually and return
`{status, value|reason}` per item, exactly as `allSettled` does.

The `series` helper here shows that shape for the sequential case.

## Related

- `mapWithLimit(items, 1, fn)` is sequential execution.
- Real-world equivalents: `p-limit`, `p-map`.
- If tasks generate more tasks, you want a proper queue rather than a fixed
  item list.
