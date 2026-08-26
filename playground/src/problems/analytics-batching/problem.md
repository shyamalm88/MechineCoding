# Analytics module: batch events with flush on size or time

Sending one HTTP request per tracked event is wasteful. Batch them, and flush on
**whichever comes first**: a size threshold or a time limit.

## Why both triggers

- **Size only** — a user who triggers 2 events then leaves never sends them.
- **Time only** — a burst of 500 events still waits out the interval, then sends
  one enormous request.

Together they bound both request count and worst-case latency.

## The timer detail that matters

Start the timer on the **first event of a batch**, and do not restart it on
subsequent events:

```js
if (this.timer === null) this.timer = setTimeout(() => this.flush('time'), maxWaitMs)
```

Restarting per event (debounce semantics) means a steady trickle of events
delays the flush indefinitely — exactly the starvation you were trying to avoid.

## Swap the queue before sending

```js
const batch = this.queue
this.queue = []      // BEFORE send()
this.send(batch)
```

If `send` is async and an event is tracked while it is in flight, that event
must land in the *next* batch — not be cleared away by a `this.queue = []`
that runs after.

## The production concern: page unload

A pending batch is lost when the tab closes. `fetch` in an `unload` handler is
routinely cancelled. The right tool is:

```js
navigator.sendBeacon('/analytics', JSON.stringify(batch))
```

`sendBeacon` is queued by the browser and survives page teardown. Trigger it on
`visibilitychange` → `hidden`, which is more reliable than `unload` on mobile.

## Follow-ups

- Retry with backoff on failure, and cap the queue so a persistent outage does
  not grow it without bound.
- Deduplicate or sample high-frequency events.
- `keepalive: true` on `fetch` is an alternative to `sendBeacon`.
