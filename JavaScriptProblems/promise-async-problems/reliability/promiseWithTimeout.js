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

// ============================================================================
// TEST DATA & USAGE EXAMPLE
// ============================================================================

const slowTask = new Promise((resolve) => {
  setTimeout(() => resolve("Task Completed"), 1000);
});

// Test 1: Timeout triggers (Limit 500ms, Task takes 1000ms)
promiseWithTimeout(slowTask, 500)
  .then((res) => console.log("Test 1 Success:", res))
  .catch((err) => console.log("Test 1 Failed:", err.message));
// Expected: Test 1 Failed: Operation Timed Out

const fastTask = new Promise((resolve) => {
  setTimeout(() => resolve("Task Completed"), 200);
});

// Test 2: Task completes (Limit 500ms, Task takes 200ms)
promiseWithTimeout(fastTask, 500)
  .then((res) => console.log("Test 2 Success:", res))
  .catch((err) => console.log("Test 2 Failed:", err.message));
// Expected: Test 2 Success: Task Completed
