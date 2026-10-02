# Priority async task scheduler

Run queued async tasks highest-priority-first, with a concurrency cap.

## Sorted queue now, heap later

`PriorityExecutorConcurrent(limit)` keeps `queue` as a plain array and re-sorts
it on every `add`, highest priority number first:

```js
this.queue.push({ runTask, priority })
this.queue.sort((a, b) => b.priority - a.priority)
```

That is O(n log n) per insert — fine for interview-sized queues. For a queue
that is both written and drained continuously, a **binary heap** gives O(log n)
for both insert and extract:

| Structure | Insert | Extract-max |
|---|---|---|
| Sorted array | O(n) | O(1) |
| Unsorted array | O(1) | O(n) |
| **Binary heap** | **O(log n)** | **O(log n)** |

## Stability

A heap is **not stable** — equal priorities come out in arbitrary order — so a
heap needs a sequence-number tiebreaker to keep equal priorities FIFO.
`Array.prototype.sort` is guaranteed stable in modern engines, so the sorted
array gets FIFO ties for free.

## Draining

```js
while (running < limit && queue.length > 0) { queue.shift().runTask() }
```

Each task's `finally` calls `_drain()` again, so a freed slot is immediately
refilled by whatever is now highest-priority — including tasks added *after* the
currently running ones started.

## Priority does not preempt

A point the demo is built to make explicit: **priority orders the queue, not
the running set.** If a slot is free when a task is submitted, it starts
immediately regardless of how unimportant it is — a later high-priority task
cannot evict it.

Preemption would require the ability to suspend a running task, which
JavaScript does not offer for ordinary async functions. Cooperative
cancellation (an `AbortSignal` the task checks) is the closest equivalent.

## Starvation

A steady stream of high-priority work means low-priority tasks never run. The
standard mitigation is **ageing**: gradually improve a task's effective priority
the longer it waits. Worth naming even if you do not implement it.

## Related

This is essentially what React's scheduler does with lane priorities, and what
`requestIdleCallback` approximates for background work.
