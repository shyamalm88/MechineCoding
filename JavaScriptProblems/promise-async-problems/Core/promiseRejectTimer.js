/**
 * ============================================================================
 * PROBLEM: Promise Timeout (Reject after N ms)
 * ============================================================================
 * Create a function that takes a Promise and a duration.
 * - If the promise resolves/rejects within the duration, return that result.
 * - If the promise takes longer than the duration, reject with a "Timeout" error.
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * We want to race two things against each other:
 * 1. The actual operation (User's Promise).
 * 2. A timer that rejects after X milliseconds.
 *
 * `Promise.race([p1, p2])` is perfect for this. It settles as soon as the
 * FIRST promise settles.
 *
 * CRITICAL:
 * Even if the user's promise wins, the timer (setTimeout) is still running in
 * the background (event loop). We must clear it to prevent open handles,
 * especially in Node.js or tests.
 */
async function promiseTimeout(fn, duration = 5000) {
  let timeoutId;

  // Create a promise that forces a rejection after 'duration'
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Promise timed out"));
    }, duration);
  });

  try {
    // Race the user's promise against the timeout
    return await Promise.race([fn(), timeoutPromise]);
  } finally {
    // Clean up the timer regardless of who won (success or timeout)
    clearTimeout(timeoutId);
  }
}
