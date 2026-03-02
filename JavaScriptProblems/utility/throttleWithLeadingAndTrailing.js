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
 * Throttling creates a "cooldown" period after a function executes.
 *
 * - LEADING: "Fire, then wait."
 *   Good for buttons (click once, ignore subsequent clicks).
 *
 * - TRAILING: "Wait, then fire."
 *   Good for resize events (wait until user stops resizing to calculate layout).
 *
 * - BOTH: "Fire, wait, then fire again if triggered."
 *   Good for search inputs (show immediate feedback, then update periodically).
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

  function invoke() {
    // If leading is disabled, we reset lastCallTime to 0.
    // This ensures the NEXT call starts a new wait window instead of
    // running immediately (which would happen if we set it to Date.now()).
    lastCallTime = leading === false ? 0 : Date.now();
    timer = null;
    fn.apply(lastThis, lastArgs);
  }

  function throttled(...args) {
    const now = Date.now();

    // If no last execution and leading is disabled,
    // treat 'now' as the start of the window (so we wait).
    if (!lastCallTime && leading === false) {
      lastCallTime = now;
    }

    const elapsed = now - lastCallTime;
    const remaining = delay - elapsed;

    lastArgs = args;
    lastThis = this;

    // 1. EXECUTE IMMEDIATELY (Leading edge or window expired)
    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      lastCallTime = now;
      fn.apply(lastThis, lastArgs);
    }
    // 2. SCHEDULE TRAILING (If inside window)
    else if (!timer && trailing !== false) {
      timer = setTimeout(invoke, remaining);
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
