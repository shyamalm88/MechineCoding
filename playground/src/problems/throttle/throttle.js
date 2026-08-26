/**
 * Limit `fn` to at most one call per `wait` ms.
 *
 * Leading-edge: the first call fires immediately, then further calls are
 * ignored until the window elapses. Contrast with debounce, which waits for
 * activity to STOP.
 */
export function throttle(fn, wait) {
  let lastCall = 0
  let timeoutId = null
  let lastArgs = null

  return function throttled(...args) {
    const now = Date.now()
    const remaining = wait - (now - lastCall)

    if (remaining <= 0) {
      lastCall = now
      fn.apply(this, args)
      return
    }

    // Trailing edge: remember the most recent args so the final call in a
    // burst is not silently dropped.
    lastArgs = args
    if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        fn.apply(this, lastArgs)
      }, remaining)
    }
  }
}
