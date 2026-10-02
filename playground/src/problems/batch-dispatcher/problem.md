# Batch API dispatcher

Collect individual items and send them together as **one** batch, instead of one
request per item.

## Two flush triggers

`batchDispatcher({ batchSize, batchDelay, dispatchFn })` flushes when **either**:

1. **Size** — the queue reaches `batchSize`: flush immediately. This bounds
   memory.
2. **Time** — `batchDelay` ms pass with no new item: flush the tail. Every
   `enqueue` resets the timer, so it behaves like a debounce.

```js
clearTimeout(timer)                  // KEY: one pending timer, never several
timer = setTimeout(flush, batchDelay)
```

Without that `clearTimeout`, enqueueing 4 items creates 4 timers and `flush()`
fires 4 times — the first sends the batch, the other three send an empty one.

## Real-world uses

- **Analytics events** — one `POST /events` with 100 events, not 100 POSTs.
- **Log shipping** — flush every 500ms or every 50 logs.
- **DataLoader-style** — `createUserLoader` uses `batchDelay: 0` so everything
  enqueued in one tick goes out as a single `WHERE id IN (...)` query. This is
  how it solves the N+1 problem.

## The detail that matters

```js
const batch = queue
queue = []            // reset BEFORE dispatching
dispatchFn(batch)
```

Reset the queue first: if `dispatchFn` throws, or enqueues synchronously, new
items start the next batch instead of mutating the one in flight.

## Always expose `flushNow()`

Call it on `beforeunload` (or `SIGTERM` on a server) so the last partial batch
is not lost.

## Traps

- Cap the batch size: `?ids=` with 10,000 entries exceeds URL limits.
- One failed dispatch loses the whole batch unless you re-queue or retry it.
- In the DataLoader variant each caller needs its own promise resolved with its
  own row, and the batch function must return results in key order.
