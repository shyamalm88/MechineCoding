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
