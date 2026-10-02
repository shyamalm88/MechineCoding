// ---- customSetInterval.js ----
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

// ---- customSetTimeout.js ----
/**
 * ============================================================================
 * PROBLEM: Custom setTimeout using requestAnimationFrame
 * ============================================================================
 * Implement a function that mimics `setTimeout` but uses `requestAnimationFrame`.
 *
 * Why?
 * 1. `requestAnimationFrame` (rAF) is paused when the tab is inactive, saving
 *    resources (battery/CPU).
 * 2. It synchronizes with the browser's repaint cycle (typically 60fps).
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * 1. rAF runs once. To mimic a timer, we need a loop.
 * 2. However, unlike `setInterval`, `setTimeout` only runs ONCE after the delay.
 * 3. We capture a `start` timestamp.
 * 4. In every frame, we check `currentTimestamp - start`.
 * 5. If `elapsed >= delay`:
 *    - Execute callback.
 *    - Stop looping (do not request another frame).
 * 6. If `elapsed < delay`:
 *    - Request next frame.
 */
function customSetTimeout(callback, delay) {
  let start = null;
  let rafId;

  function loop(timestamp) {
    // Initialize start time on first frame
    if (start === null) start = timestamp;

    const elapsed = timestamp - start;

    if (elapsed >= delay) {
      callback();
      return; // Stop scheduling (run once)
    }

    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);

  return function clear() {
    cancelAnimationFrame(rafId);
  };
}

// ---- runInIdle.js ----
/**
 * ============================================================================
 * PROBLEM: Run Tasks During Browser Idle Time
 * ============================================================================
 * Implement a function that executes a queue of tasks using `requestIdleCallback`.
 * This ensures that non-critical background tasks do not interfere with
 * high-priority work like animations and user input.
 *
 * `requestIdleCallback` queues a function to be called during a browser's
 * idle periods. The function receives a `deadline` object which can be used
 * to check how much time is left for execution.
 *
 * ============================================================================
 * INTUITION: Cooperative Scheduling
 * ============================================================================
 * 1. We have a queue of `tasks` (functions) to execute.
 * 2. We schedule a `process` function to run via `requestIdleCallback`.
 * 3. Inside `process`, we get a `deadline` object.
 * 4. We run tasks from the queue as long as `deadline.timeRemaining() > 0`
 *    and there are tasks left. This is "cooperative" because we are yielding
 *    back to the main thread before the deadline is exceeded.
 * 5. If tasks still remain after the idle period ends, we schedule another
 *    call to `process` for the next idle period.
 * 6. This continues until the task queue is empty.
 */
function runInIdle(tasks) {
  /**
   * The core processing function that runs tasks.
   * @param {IdleDeadline} deadline - An object with timeRemaining() and didTimeout.
   */
  const process = (deadline) => {
    // Loop while there's time left in the idle period and we have tasks.
    while (deadline.timeRemaining() > 0 && tasks.length > 0) {
      const task = tasks.shift();
      console.log(`Executing task: ${task.name || "anonymous"}`);
      task(); // Execute one task.
    }

    // If there are still tasks left, schedule the next batch.
    if (tasks.length > 0) {
      console.log("Idle time expired, scheduling next batch.");
      requestIdleCallback(process); // Schedule remaining for next idle period.
    } else {
      console.log("All tasks completed.");
    }
  };

  // Kick off the first idle callback.
  requestIdleCallback(process);
}

export { customSetInterval, customSetTimeout, runInIdle }
