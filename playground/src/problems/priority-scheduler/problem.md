# Priority async task scheduler

Run queued async tasks highest-priority-first, with a concurrency cap.

## Why a heap

| Structure | Insert | Extract-min |
|---|---|---|
| Sorted array | O(n) | O(1) |
| Unsorted array | O(1) | O(n) |
| **Binary heap** | **O(log n)** | **O(log n)** |

For a queue that is both written and drained continuously, the heap wins. A
`sort()` on every insert is O(n log n) per task and the usual first answer.

## Stability: the detail that separates answers

A binary heap is **not stable** — two items with equal priority come out in
arbitrary order. For a scheduler that is wrong: equal-priority tasks should run
FIFO.

The fix is a monotonically increasing sequence number as a tiebreaker:

```js
compare(a, b) { return a.priority - b.priority || a.seq - b.seq }
```

Without it, submitting ten equal-priority jobs gives an unpredictable order,
which is very hard to debug later.

## Draining

```js
while (running < concurrency && heap.size) { ...run task... }
```

Each completion calls `drain()` again, so a freed slot is immediately refilled
by whatever is now highest-priority — including tasks added *after* the
currently running ones started.

`Promise.resolve().then(task)` rather than `task()` ensures a task that throws
synchronously still rejects the returned promise instead of blowing up the
scheduler.

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
