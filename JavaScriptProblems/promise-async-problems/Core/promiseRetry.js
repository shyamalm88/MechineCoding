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
    // Helper function to handle the recursion
    const attempt = (currentAttempt) => {
      // Wrap fn() in Promise.resolve to handle both async and sync return values safely
      Promise.resolve(fn())
        .then((data) => {
          // Success! Resolve the outer promise immediately.
          resolve(data);
        })
        .catch((err) => {
          // Failure! Check if we should retry.
          // If we've hit the limit (currentAttempt >= retries), reject with the last error
          if (currentAttempt >= retries) {
            reject(err);
            return;
          }

          // Retries remaining. Schedule the next attempt.
          setTimeout(() => {
            attempt(currentAttempt + 1);
          }, delay);
        });
    };

    // Start the first attempt
    attempt(1);
  });
};

// ============================================================================
// TEST CASES
// ============================================================================

// Mock function that fails 2 times then succeeds
let callCount = 0;
const unstableApi = () => {
  return new Promise((resolve, reject) => {
    callCount++;
    if (callCount < 3) {
      reject("Network Error");
    } else {
      resolve("Success Data");
    }
  });
};

console.log("Starting Retry Test...");
promiseRetry(unstableApi, 5, 500)
  .then((data) => console.log("Final Result:", data)) // Expected: Success Data
  .catch((err) => console.error("Final Error:", err));
