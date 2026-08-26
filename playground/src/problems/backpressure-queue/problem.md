# Async queue with backpressure

A concurrency limiter caps how many tasks *run*. It does nothing about how many
are **waiting** — push a million and you have a million closures in memory.

Backpressure fixes that by making the **producer** wait.

## Two gates

```
push() ──[admission gate: queue.length < maxQueueSize]──▶ queue
queue  ──[execution gate: running < concurrency]───────▶ running
```

When the admission gate is closed, `push()` returns a promise that stays pending
until space frees up. A producer that `await`s it is naturally throttled — no
callbacks, no polling, no unbounded buffer.

## Why this matters

Reading a 10GB file and pushing every line into an unbounded queue exhausts
memory long before the workers catch up. This is the same idea as TCP flow
control, Node streams' `writable.write()` returning `false`, and RxJS
backpressure strategies.

**The signal you have the concept:** unbounded queueing is not "no
backpressure", it is *deferred failure* — you converted a slowdown into an
out-of-memory crash.

## The implementation detail

Admit a parked producer at the moment a task leaves the queue for execution,
not when it finishes:

```js
const task = this.queue.shift()
this.waitingProducers.shift()?.()   // a queue slot just opened
```

Waking on completion instead means the queue never refills while tasks are
running, and throughput collapses to the concurrency limit.

## Alternatives when you cannot slow the producer

- **Drop newest** — reject on a full queue (a load shedder / rate limiter).
- **Drop oldest** — a ring buffer; right for telemetry where recency wins.
- **Sample** — keep every Nth item.

Choosing is a product decision: for logs, dropping is fine; for payments, the
producer must wait.
