# Batch API dispatcher (DataLoader)

Collect individual requests made in the same tick and issue **one** combined
call, routing results back to each caller.

## The problem it solves: N+1

A list renders 50 rows, each independently asking for its author:

```
GET /users/1 … GET /users/50      →  50 round trips
GET /users?ids=1,2,…,50           →  1
```

Crucially the *components stay unaware of each other*. Each calls
`loader.load(id)` and gets a promise; the loader does the coalescing. That is
what makes it composable — no lifting data fetching up the tree.

## Microtask, not timer

```js
queueMicrotask(flush)   // batches everything queued in the current tick
```

A microtask fires after the current synchronous work completes but **before**
the next macrotask or paint — so every `load()` from one render pass batches
together, with no artificial delay. `setTimeout(flush, 0)` would also work but
adds a real delay and can span unrelated work.

This is exactly what Facebook's DataLoader does, and why it is described as
"per-tick" batching.

## The contract that bites people

`batchFn(keys)` **must return an array of the same length, in the same order**
as the keys. A batch function that filters out missing rows silently shifts
every result and each caller gets someone else's data.

Defensive implementations assert `results.length === keys.length` — a genuinely
worthwhile check.

## Caching and its hazard

Returning the same promise for a repeated key dedupes both in-flight and
completed requests (ids 1 and 2 in the demo are requested twice, fetched once).

But that cache is **permanent** — the loader must be short-lived, typically
per-request on a server, or you serve stale data forever. Long-lived clients
need `clear(key)` after mutations.

## Traps

- Reset the queue **before** dispatching, so a `load()` triggered by a resolved
  promise starts the next batch instead of mutating the in-flight one.
- Cap the batch size: `?ids=` with 10,000 entries exceeds URL limits.
- One failure rejects every caller in the batch. Per-key errors need the batch
  function to return error objects positionally rather than throwing.
