/**
 * ============================================================================
 * PROBLEM: Abortable Promise.all
 * ============================================================================
 * Implement `Promise.all` but with support for an `AbortSignal`.
 * If the signal is aborted, the returned promise should reject immediately,
 * ignoring the results of the pending promises.
 *
 * ============================================================================
 * INTUITION: Event Listener
 * ============================================================================
 * 1. Check `signal.aborted` initially.
 * 2. Add an "abort" event listener to the signal to reject immediately.
 * 3. Run standard `Promise.all`.
 */
function abortablePromiseAll(promises, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error("Aborted"));

    signal?.addEventListener("abort", () => reject(new Error("Aborted")));

    Promise.all(promises).then(resolve, reject);
  });
}

// ============================================================================
// TEST DATA & USAGE EXAMPLE
// ============================================================================

const createSlowPromise = (id, ms) =>
  new Promise((resolve) => setTimeout(() => resolve(id), ms));

const controller = new AbortController();
const tasks = [
  createSlowPromise("Task 1", 1000),
  createSlowPromise("Task 2", 2000),
  createSlowPromise("Task 3", 3000),
];

console.log("Starting tasks...");

abortablePromiseAll(tasks, controller.signal)
  .then((results) => console.log("Success:", results))
  .catch((err) => console.error("Failed:", err.message));

// Abort after 1.5 seconds
setTimeout(() => {
  console.log("Aborting operation...");
  controller.abort();
}, 1500);

// Expected Output:
// Starting tasks...
// Aborting operation...
// Failed: Aborted
