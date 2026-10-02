// ---- promiseRetry.js ----
/**
 * ============================================================================
 * PROBLEM: Retry Promise with Delay
 * ============================================================================
 * Implement a utility function that retries a Promise-returning function
 * N times with a specific delay between attempts if it fails.
 *
 * If the function succeeds (resolves), the wrapper should resolve immediately.
 * If it fails (rejects) after N attempts, the wrapper should reject with the
 * last error encountered.
 *
 * ============================================================================
 * INTUITION: Recursive Retry Strategy
 * ============================================================================
 * Instead of a loop (which is tricky with Promises unless using async/await),
 * we can use recursion.
 *
 * 1. Define an internal function `attempt(n)`.
 * 2. Execute the user's function `fn()`.
 * 3. If it resolves, we are done -> resolve outer promise.
 * 4. If it rejects:
 *    a. Check if we have retries left.
 *    b. If no retries left -> reject outer promise.
 *    c. If retries left -> wait for `delay` ms, then call `attempt(n + 1)`.
 *
 * This creates a chain of attempts separated by timeouts.
 */

/**
 * @param {Function} fn - The function to retry (must return a Promise)
 * @param {number} retries - Maximum number of total attempts (default: 3)
 * @param {number} delay - Time in ms to wait before retrying (default: 100)
 * @returns {Promise} - A promise that resolves with fn's result or rejects after retries
 */
const promiseRetry = function (fn, retries = 3, delay = 100) {
  return new Promise((resolve, reject) => {
    const attempt = (currentAttempt) => {
      Promise.resolve(fn())
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          if (currentAttempt >= retries) {
            reject(err);
            return;
          }
          setTimeout(() => {
            attempt(currentAttempt + 1);
          }, delay);
        });
    };

    attempt(1);
  });
};

// ---- promiseWithTimeout.js ----
/**
 * ============================================================================
 * PROBLEM: Promise with Timeout
 * ============================================================================
 * Create a function that takes a promise and a timeout duration.
 * - If the promise resolves/rejects before the timeout, return that result.
 * - If the timeout elapses first, reject with a timeout error.
 *
 * ============================================================================
 * INTUITION: Promise.race
 * ============================================================================
 * `Promise.race` settles as soon as the first promise in the iterable settles.
 * We race the actual operation against a promise that rejects after `timeout` ms.
 */
function promiseWithTimeout(promise, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Operation Timed Out")), timeout);
  });
  return Promise.race([promise, timeoutPromise]);
}

// ---- cancelableAsyncTask.js ----
/**
 * ============================================================================
 * PROBLEM: Cancelable Async Task
 * ============================================================================
 * Create a wrapper for an async operation (Promise) that can be cancelled
 * using an AbortSignal (standard Web API).
 *
 * If the signal is aborted before the promise resolves, the promise should
 * reject immediately with an "AbortError".
 *
 * ============================================================================
 * INTUITION: AbortController Pattern
 * ============================================================================
 * 1. The function accepts an `AbortSignal`.
 * 2. Inside the Promise constructor:
 *    - Check `signal.aborted` immediately. If true, reject.
 *    - Start the async work (e.g., setTimeout, fetch).
 *    - Add an event listener for the 'abort' event on the signal.
 * 3. If 'abort' fires:
 *    - Clean up resources (clearTimeout).
 *    - Reject the promise with a specific error.
 */
function cancellableAsyncTask(signal) {
  return new Promise((resolve, reject) => {
    // 1. Check if already aborted
    if (signal.aborted) {
      return reject(new DOMException("Aborted", "AbortError"));
    }

    // 2. Start operation
    const timeout = setTimeout(() => {
      resolve("done");
    }, 1000);

    // 3. Listen for abort
    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export { promiseRetry, promiseWithTimeout, cancellableAsyncTask }
