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
const debounceLeadingTrailing = function (
  fn,
  delay,
  { leading = false, trailing = false } = {},
) {
  let context;
  let lastArgs;
  let timer;

  return function debounced(...args) {
    context = this;
    lastArgs = args;

    // If no timer is active and leading is enabled, this is the start of a new burst.
    let callNow = !timer && leading;

    // Reset timer to extend the delay window (debounce core logic)
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      // Trailing edge execution:
      // Run if trailing is enabled AND this specific timer wasn't created
      // by a call that already executed on the leading edge.
      if (trailing && !callNow) {
        fn.apply(context, lastArgs);
      }
      timer = null;
    }, delay);

    // Leading edge execution
    if (callNow) {
      fn.apply(context, lastArgs);
    }
  };
};
