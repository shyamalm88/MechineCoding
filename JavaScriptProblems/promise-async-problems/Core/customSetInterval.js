/**
 * ============================================================================
 * PROBLEM: Custom setInterval using requestAnimationFrame
 * ============================================================================
 * Implement a function that mimics `setInterval` but uses `requestAnimationFrame`.
 *
 * Why use this over standard setInterval?
 * 1. Performance: `requestAnimationFrame` (rAF) pauses when the user navigates
 *    to another tab, saving battery and CPU. Standard `setInterval` keeps running
 *    in the background (though modern browsers throttle it).
 * 2. Smoothness: It aligns with the browser's repaint cycle (usually 60fps),
 *    preventing layout thrashing if the callback involves DOM updates.
 *
 * ============================================================================
 * INTUITION: Recursive rAF Loop + Time Delta
 * ============================================================================
 * 1. `requestAnimationFrame` runs only once. To make it repeat, we need to call
 *    it recursively within the callback.
 * 2. We need to track time manually because rAF runs ~60 times a second (every 16ms),
 *    which is likely faster than our desired `delay`.
 * 3. rAF passes a `timestamp` (high-precision float) to its callback.
 * 4. We store a `start` timestamp.
 * 5. In each frame, check: `currentTimestamp - start >= delay`.
 * 6. If true:
 *    - Execute the user's callback.
 *    - Reset `start` to the current timestamp.
 * 7. Return a `clear` function that calls `cancelAnimationFrame` to stop the loop.
 */

/**
 * @param {Function} callback - Function to execute repeatedly
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - A function to clear the interval
 */
function customSetInterval(callback, delay) {
  let start = null;
  let rafId;

  function loop(timestamp) {
    // Initialize start time on the first frame
    if (!start) start = timestamp;

    if (timestamp - start >= delay) {
      callback();
      // Reset start time.
      // Note: To avoid drift, one might use `start += delay`, but `start = timestamp`
      // is safer if the tab was inactive for a long time (prevents a burst of callbacks).
      start = timestamp;
    }

    // Schedule the next check
    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);

  return function clear() {
    cancelAnimationFrame(rafId);
  };
}

// ============================================================================
// TEST CASES
// ============================================================================
// Note: This code must run in a browser environment because it depends on
// `requestAnimationFrame`. It will not work in standard Node.js.

/*
console.log("Starting custom interval (1000ms)...");

let count = 0;
const clearFn = customSetInterval(() => {
  count++;
  console.log(`[${new Date().toISOString()}] Tick ${count}`);

  if (count >= 5) {
    console.log("Clearing interval...");
    clearFn();
  }
}, 1000);
*/
