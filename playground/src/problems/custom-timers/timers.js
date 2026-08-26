/**
 * Timer utilities built from primitives.
 */

/** setInterval implemented with recursive setTimeout. */
export function customSetInterval(callback, delay) {
  let timerId = null
  let cancelled = false

  const tick = () => {
    if (cancelled) return
    callback()
    // Schedule the NEXT run only after this one finishes, so a slow callback
    // can never overlap itself -- which real setInterval permits.
    if (!cancelled) timerId = setTimeout(tick, delay)
  }

  timerId = setTimeout(tick, delay)
  return () => { cancelled = true; clearTimeout(timerId) }
}

/** setTimeout that survives long delays and corrects for drift. */
export function accurateTimeout(callback, delay) {
  const start = performance.now()
  let timerId = null
  let cancelled = false

  const check = () => {
    if (cancelled) return
    const elapsed = performance.now() - start
    const remaining = delay - elapsed
    // Re-measure instead of trusting the timer: browsers throttle background
    // tabs to ~1/sec, so a single long setTimeout can fire very late.
    if (remaining <= 0) return callback()
    timerId = setTimeout(check, Math.min(remaining, 500))
  }

  timerId = setTimeout(check, Math.min(delay, 500))
  return () => { cancelled = true; clearTimeout(timerId) }
}

/** Run work only while the browser is idle, in chunks. */
export function runInIdle(items, worker, { onDone } = {}) {
  let index = 0
  const idle = globalThis.requestIdleCallback ?? ((cb) => setTimeout(() => cb({ timeRemaining: () => 8 }), 1))

  const step = (deadline) => {
    // Yield as soon as the frame budget is nearly spent, so input stays smooth.
    while (index < items.length && deadline.timeRemaining() > 1) {
      worker(items[index++])
    }
    if (index < items.length) idle(step)
    else onDone?.()
  }
  idle(step)
  return () => { index = items.length }
}
