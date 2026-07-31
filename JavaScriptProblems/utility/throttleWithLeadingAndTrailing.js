// Throttle with leading + trailing options

function throttle(fn, delay, { leading = true, trailing = true } = {}) {
  let lastRun = 0; // Timestamp of the last execution
  let timer = null; // Pending trailing timer

  // Always keep the latest invocation details.
  // These are updated on every call so that the
  // trailing execution uses the most recent values.
  let lastArgs = null;
  let lastThis = null;

  return function (...args) {
    const now = Date.now();

    lastArgs = args;
    lastThis = this;

    // Special handling for leading = false.
    // Start the throttle window without executing immediately.
    if (!leading && lastRun === 0) {
      lastRun = now;
    }

    const remaining = delay - (now - lastRun);

    // ============================
    // LEADING EDGE
    // ============================
    if (remaining <= 0) {
      // Cancel any pending trailing execution since
      // we're executing immediately now.
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      fn.apply(lastThis, lastArgs);
      lastRun = now;

      lastArgs = null;
      lastThis = null;
    }

    // ============================
    // TRAILING EDGE
    // ============================
    else if (trailing && !timer) {
      // Schedule exactly one execution at the end
      // of the current throttle window.
      timer = setTimeout(() => {
        fn.apply(lastThis, lastArgs);

        lastRun = Date.now();

        timer = null;
        lastArgs = null;
        lastThis = null;
      }, remaining);
    }
  };
}

// Usage
const onScroll = throttle(() => console.log("scroll"), 300);
const onResize = throttle(() => console.log("resize"), 300, { leading: false }); // trailing only

// Key talking points:
// leading=true  → fires immediately on first call
// trailing=true → fires once more at end of window if called during cooldown
// both false    → useless, nothing fires
