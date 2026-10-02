# Custom timers: setInterval, setTimeout, and idle work

## Why rebuild the timers on `requestAnimationFrame`?

1. rAF **pauses in background tabs**, saving battery and CPU.
2. It lines up with the browser's repaint cycle (~60fps), so DOM updates in the
   callback do not thrash layout.

## customSetInterval

rAF fires once per frame (~16ms), far more often than the delay, so the loop
tracks time itself using the timestamp rAF passes in:

```js
if (timestamp - start >= delay) { callback(); start = timestamp }
rafId = requestAnimationFrame(loop)
```

Resetting `start = timestamp` (rather than `start += delay`) avoids a burst of
catch-up callbacks after the tab was inactive. The function returns `clear()`,
which calls `cancelAnimationFrame`.

## customSetTimeout

Same loop, but it runs the callback **once** and stops requesting frames when
`elapsed >= delay`.

Both are browser-only (no rAF in Node) and accurate only to a frame.

## runInIdle

Run non-urgent work only in the gaps between frames:

```js
while (deadline.timeRemaining() > 0 && tasks.length > 0) tasks.shift()()
if (tasks.length > 0) requestIdleCallback(process)
```

Running everything in one loop blocks the main thread and freezes the page.
Chunking against `timeRemaining()` keeps interaction smooth — this is the idea
behind React's scheduler for low-priority work. This version consumes the
`tasks` array it is given.

Note `requestIdleCallback` is unsupported in Safari, so a `setTimeout` fallback
is required. Pass `{ timeout }` if the work must eventually run even on a busy
page, or it can be starved indefinitely.
