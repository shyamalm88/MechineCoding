# Analytics module: batch events with flush on size or time

Sending one HTTP request per tracked event is wasteful. Batch them, and flush on
**whichever comes first**: a size threshold or a time limit.

`new Analytics(batchSize = 5, flushInterval = 3000, maxQueueSize = 500)`

## Why both triggers

- **Size only** — a user who triggers 2 events then leaves never sends them.
- **Time only** — a burst of 500 events still waits out the interval, then sends
  one enormous request.

Together they bound both request count and worst-case latency. Here the time
trigger is a `setInterval` that calls `flush()`, and `track()` flushes as soon as
`queue.length >= batchSize`.

## Drain the queue before sending

```js
const payload = this.queue.splice(0)   // drain atomically, BEFORE the async fetch
```

Events tracked while the request is in flight land in the *next* batch, and the
same events are never sent twice.

## Failure handling

If the `fetch` fails, the payload is put back with `unshift` so it is retried on
the next flush. That would grow the queue forever during a long outage, so
`_enforceCap()` drops the **oldest** events once `maxQueueSize` is exceeded.

## The production concern: page unload

A pending batch is lost when the tab closes, and `fetch` in an `unload` handler
is routinely cancelled. The `beforeunload` handler calls `flush(true)`, which
uses:

```js
navigator.sendBeacon("/analytics", body)   // queued by the browser, survives teardown
```

`fetch(..., { keepalive: true })` is the fallback and lets a request outlive the
page in modern browsers.

## Clean up

`destroy()` clears the interval and removes the `beforeunload` listener — call it
on teardown (HMR, SPA unmount) or each instance leaks a timer.

## Follow-ups

- Retry with backoff rather than on the next tick.
- Restart-vs-keep the timer: a debounced flush lets a steady trickle delay the
  batch forever, which is why this uses a fixed interval.
- Deduplicate or sample high-frequency events.
