# Stopwatch

Start, pause, resume, lap, reset — with a display that does not drift.

## The bug in almost every first attempt

```js
setInterval(() => setElapsed(e => e + 10), 10)   // ✗ drifts
```

Timers are **not** precise. `setInterval(fn, 10)` fires *at least* 10ms later,
often more under load, and it is clamped to ~4ms minimum (and throttled to once
per second in background tabs). Accumulating that error makes the clock visibly
wrong within a minute.

## The fix: anchor to a timestamp

```js
startRef.current = performance.now() - elapsed   // on start/resume
setElapsed(performance.now() - startRef.current) // on every tick
```

Now each tick **recomputes from the anchor** rather than adding to a running
total, so a late or dropped frame self-corrects. Subtracting the existing
`elapsed` when starting is what makes resume continue rather than restart.

`performance.now()` rather than `Date.now()` because it is monotonic — a system
clock adjustment cannot make the stopwatch jump backwards.

## requestAnimationFrame over setInterval

The display updates at most once per painted frame, so rAF is the natural fit:
it is synchronised to the refresh rate, and it **pauses in background tabs**,
which is exactly what you want (the anchor means the time is still correct when
you return).

## State that must live in a ref

The anchor and the rAF id are not render output — putting them in state would
cause a re-render per frame that changes nothing. `useRef` keeps them mutable
without re-rendering.

## Details worth getting right

- `font-variant-numeric: tabular-nums` stops the display shuffling as digits
  change width — noticeable and cheap to fix.
- Lap times are **deltas** from the previous lap; showing only cumulative totals
  is the common miss.
- Cancel the animation frame in the effect cleanup, or a paused stopwatch keeps
  a loop alive.
