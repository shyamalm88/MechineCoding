# Custom timers: setInterval, accurate timeout, and idle work

## setInterval via recursive setTimeout

```js
const tick = () => { callback(); timerId = setTimeout(tick, delay) }
```

Not merely an academic exercise — it fixes a real defect. Native `setInterval`
schedules by wall clock regardless of how long the callback takes, so a callback
slower than the interval **queues up and overlaps itself**, and the browser fires
them back-to-back trying to catch up.

Recursive `setTimeout` schedules the next run only *after* the current one
finishes, so there is always a full gap. The trade-off: the effective period is
`delay + callbackDuration`, i.e. it drifts rather than overlapping. For most
work that is the better failure mode.

## Long timers are unreliable

`setTimeout(fn, 600000)` will not fire on time if the tab is backgrounded —
browsers throttle background timers to roughly once per second, and mobile
suspends them entirely.

The fix is to **re-measure against a timestamp** and re-arm in short hops:

```js
const remaining = delay - (performance.now() - start)
setTimeout(check, Math.min(remaining, 500))
```

Same principle as the stopwatch: trust the clock, never the timer.

## requestIdleCallback

Run non-urgent work only in the gaps between frames:

```js
while (index < items.length && deadline.timeRemaining() > 1) worker(items[index++])
if (index < items.length) requestIdleCallback(step)
```

Processing 5000 items in one loop blocks the main thread and freezes the page.
Chunking against `timeRemaining()` keeps interaction smooth — this is exactly
what React's scheduler does for low-priority work.

Note `requestIdleCallback` is unsupported in Safari, so a `setTimeout` fallback
is required. Pass `{ timeout }` if the work must eventually run even on a busy
page, or it can be starved indefinitely.

## Clamping

Nested `setTimeout(…, 0)` is clamped to ~4ms after five levels, so it is not a
route to "run this immediately". `queueMicrotask` is, but it does not yield to
rendering — which is the whole point of idle scheduling.
