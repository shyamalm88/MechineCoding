/**
 * ============================================================================
 * PROBLEM: Retry with Cancellation
 * ============================================================================
 * Implement a function that retries an async operation upon failure,
 * but stops immediately if an AbortSignal is triggered.
 *
 * ============================================================================
 * INTUITION: Loop + Signal Check
 * ============================================================================
 * 1. We loop up to `retries` times.
 * 2. Before each attempt, we check `signal.aborted`. If true, throw immediately.
 * 3. We pass the `signal` into the task function `fn(signal)` so the task
 *    itself can listen for abort events (e.g., cancel a fetch).
 * 4. If the task fails, we catch the error. If we have retries left, we loop.
 *    If no retries left, we re-throw the error.
 */
async function retryWithCancel(fn, retries, signal) {
  for (let i = 0; i <= retries; i++) {
    if (signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    try {
      return await fn(signal);
    } catch (err) {
      if (i === retries) throw err;
    }
  }
}

// ============================================================================
// TEST DATA & USAGE EXAMPLE
// ============================================================================

const controller = new AbortController();

// A mock task that fails the first 2 times, then succeeds.
// It also respects the abort signal by checking it after async work.
let attempts = 0;
const flakyTask = async (signal) => {
  attempts++;
  console.log(`[Task] Attempt #${attempts} started...`);

  // Simulate async work (e.g., network request)
  await new Promise((r) => setTimeout(r, 100));

  if (signal.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  if (attempts <= 2) {
    throw new Error("Network Glitch");
  }
  return "Success Payload";
};

console.log("--- Test 1: Auto-Retry Success ---");
retryWithCancel(flakyTask, 3, controller.signal)
  .then((res) => console.log("Result:", res))
  .catch((err) => console.error("Error:", err.message));

// Test 2: Cancellation during retry
setTimeout(() => {
  console.log("\n--- Test 2: Cancellation ---");
  const abortCtrl = new AbortController();
  attempts = 0; // Reset for next test

  retryWithCancel(flakyTask, 5, abortCtrl.signal)
    .then((res) => console.log("Result:", res))
    .catch((err) => console.log("Caught Expected Error:", err.message));

  // Abort after 150ms (during the 2nd attempt's wait or execution)
  setTimeout(() => {
    console.log("[System] Aborting...");
    abortCtrl.abort();
  }, 150);
}, 1000);
