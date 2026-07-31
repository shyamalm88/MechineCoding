/**
 * ============================================================================
 * PROBLEM: Debounce with Leading and Trailing options
 * ============================================================================
 * Implement a debounce function that allows execution on the leading edge,
 * trailing edge, or both.
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * Standard debounce waits for a pause in events.
 * - Leading: Execute immediately on the first call, then wait.
 * - Trailing: Execute after the delay period has passed without new calls.
 *
 * FLOW:
 * 1. Capture `this` and `args` for the latest call.
 * 2. Determine if we should call immediately (`callNow`):
 *    - True if `leading` is on AND no timer is currently running.
 * 3. Clear existing timer (standard debounce behavior: extend wait).
 * 4. Set new timer:
 *    - On timeout, check if we should fire the trailing edge.
 *    - We fire trailing if enabled AND we didn't just fire the leading edge
 *      for this specific sequence (captured via closure).
 * 5. If `callNow` is true, execute immediately.
 */
const debounce = (fn, delay, { leading = false, trailing = true } = {}) => {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;

  return function (...args) {
    lastArgs = args;
    lastThis = this;

    const callNow = leading && !timer;

    clearTimeout(timer);

    timer = setTimeout(() => {
      if (trailing && !callNow) {
        fn.apply(lastThis, lastArgs);
      }

      timer = null;
      lastArgs = null;
      lastThis = null;
    }, delay);

    if (callNow) {
      fn.apply(lastThis, lastArgs);
    }
  };
};
