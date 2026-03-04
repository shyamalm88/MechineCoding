/**
 * ============================================================================
 * PROBLEM: Throttle with Leading and Trailing options
 * ============================================================================
 * Implement a throttle function that:
 * 1. Limits how often a function can fire.
 * 2. Supports 'leading': Run immediately on first call.
 * 3. Supports 'trailing': Run at the end of the wait period if called during wait.
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * Throttling guarantees a function is executed at most once per specified period.
 *
 * VISUALIZATION:
 * Time: 0ms (Call) -> 100ms (Call) -> 200ms (Call) -> 300ms
 * Delay: 250ms
 *
 * 1. Leading: true, Trailing: false
 *    - 0ms: Execute immediately. Cooldown until 250ms.
 *    - 100ms: Ignored (in cooldown).
 *    - 200ms: Ignored (in cooldown).
 *    - 300ms: Execute immediately (cooldown over).
 *
 * 2. Leading: false, Trailing: true
 *    - 0ms: Schedule execution for 250ms.
 *    - 100ms: Update arguments for scheduled call.
 *    - 200ms: Update arguments.
 *    - 250ms: Execute with args from 200ms. Cooldown over.
 *
 * 3. Leading: true, Trailing: true
 *    - 0ms: Execute immediately. Cooldown until 250ms.
 *    - 100ms: Schedule trailing execution for 250ms.
 *    - 200ms: Update arguments.
 *    - 250ms: Execute trailing (args from 200ms). Reset cooldown.
 *
 * FLOW:
 * 1. Calculate `remaining` time in the cooldown window.
 * 2. If `remaining <= 0`:
 *    - We are allowed to run (time expired or first run).
 *    - Execute immediately.
 *    - Reset timer (if any).
 * 3. If `remaining > 0`:
 *    - We are in cooldown.
 *    - If `trailing` is enabled and no timer exists, schedule one.
 *    - The timer will fire after `remaining` ms.
 */
function throttle(fn, delay, { leading = true, trailing = true } = {}) {
  let lastCallTime = 0;
  let timer = null;
  let lastArgs = null;
  let lastThis = null;

  function throttled(...args) {
    const now = Date.now();

    // If no last execution and leading is disabled,
    // we shouldn't run now. We pretend the "last execution" happened right now
    // so that the math (remaining = delay - elapsed) forces a wait.
    if (!lastCallTime && leading === false) {
      lastCallTime = now;
    }

    const remaining = delay - (now - lastCallTime);

    lastArgs = args;
    lastThis = this;

    // 1. EXECUTE IMMEDIATELY
    // Run if:
    // - We are outside the cooldown window (remaining <= 0)
    // - OR system time moved backwards (remaining > delay)
    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      lastCallTime = now;
      fn.apply(lastThis, lastArgs);
    }
    // 2. SCHEDULE TRAILING
    // If we are inside the cooldown window and trailing is enabled:
    else if (!timer && trailing !== false) {
      timer = setTimeout(() => {
        // Execute with the latest arguments captured from the closure
        lastCallTime = leading === false ? 0 : Date.now();
        timer = null;
        fn.apply(lastThis, lastArgs);
      }, remaining);
    }
  }

  throttled.cancel = () => {
    clearTimeout(timer);
    timer = null;
    lastCallTime = 0;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}
