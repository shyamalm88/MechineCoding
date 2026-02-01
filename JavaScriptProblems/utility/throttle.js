function throttle(fn, delay) {
  let lastRun = 0;     // Timestamp of last execution (leading or trailing)
  let timer = null;   // Timer for scheduled trailing execution

  return function (...args) {
    const now = Date.now();

    // 🔹 LEADING EDGE
    // If enough time has passed since last execution,
    // execute immediately.
    if (now - lastRun >= delay) {
      fn.apply(this, args);
      lastRun = now;
    }

    // 🔹 TRAILING EDGE
    // If we're inside the throttle window and no trailing call is scheduled,
    // schedule ONE execution at the end of the window.
    else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);      // Execute last call (trailing)
        lastRun = Date.now();      // Reset last execution time
        timer = null;              // Clear timer so future trailing calls can be scheduled
      }, delay - (now - lastRun)); // Remaining time in throttle window
    }
  };
}