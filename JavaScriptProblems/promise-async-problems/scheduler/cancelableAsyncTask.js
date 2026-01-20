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

const controller = new AbortController();

cancellableAsyncTask(controller.signal)
  .then(console.log)
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("Cancelled");
    }
  });

setTimeout(() => controller.abort(), 300);

// Test Case 2: Successful completion
const controller2 = new AbortController();
cancellableAsyncTask(controller2.signal)
  .then((res) => console.log("Success:", res))
  .catch((err) => console.error("Error:", err));
// Expected: Success: done (after 1s)
