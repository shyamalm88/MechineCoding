function throttle(fn, delay) {
  let lastRun = 0; // Timestamp of the last actual execution
  let timer = null; // Stores the pending trailing timeout

  // Always store the latest context and arguments.
  // These are updated on EVERY invocation so that the
  // trailing execution uses the most recent call.
  let lastArgs = null;
  let lastThis = null;

  return function (...args) {
    const now = Date.now();

    // Save the latest invocation details.
    // Even if a timer is already scheduled, these values
    // continue to get updated.
    lastArgs = args;
    lastThis = this;

    // ============================
    // LEADING EDGE
    // ============================
    // If enough time has passed since the last execution,
    // invoke immediately.
    if (now - lastRun >= delay) {
      fn.apply(lastThis, lastArgs);
      lastRun = now;
    }

    // ============================
    // TRAILING EDGE
    // ============================
    // We're still inside the throttle window.
    // Schedule ONE execution at the end of the window
    // only if one isn't already pending.
    else if (!timer) {
      timer = setTimeout(
        () => {
          // Execute with the LATEST context and arguments,
          // not the ones that existed when the timer
          // was originally created.
          fn.apply(lastThis, lastArgs);

          // Record this trailing execution as the latest run.
          lastRun = Date.now();

          // Clear the timer so a future trailing call
          // can be scheduled.
          timer = null;
        },
        // Wait only for the remaining time in the current
        // throttle window.
        delay - (now - lastRun),
      );
    }
  };
}
