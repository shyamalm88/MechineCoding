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
 * 1. The function accepts a promise and an `AbortSignal`.
 * 2. Inside the Promise constructor:
 *    - Check `signal.aborted` immediately. If true, reject.
 *    - Listen for 'abort' (once) and forward the promise's result.
 * * 3. If 'abort' fires:
 *    - Reject with signal.reason (AbortError by default).
 * */
function cancellable(promise, signal) {
  return new Promise((resolve, reject) => {
    // 1. Already aborted -> fail fast
    if (signal.aborted) return reject(signal.reason);

    // 2. Listen for abort (once: auto-removed after firing)
    const onAbort = () => reject(signal.reason);
    signal.addEventListener("abort", onAbort, { once: true });

    // 3. Forward original result, then clean up the listener
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", onAbort));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(() => r("done"), ms));

// Test 1: cancelled mid-flight
const c1 = new AbortController();
cancellable(sleep(1000), c1.signal)
  .then(console.log)
  .catch((err) => console.log(err.name === "AbortError" ? "Cancelled" : err));
setTimeout(() => c1.abort(), 300);
// Expected: Cancelled

// Test 2: success
const c2 = new AbortController();
cancellable(sleep(500), c2.signal).then((r) => console.log("Success:", r));
// Expected: Success: done

// Test 3: already aborted
const c3 = new AbortController();
c3.abort();
cancellable(sleep(100), c3.signal).catch((e) => console.log("Pre-aborted:", e.name));
// Expected: Pre-aborted: AbortError

// Test 4: custom reason
const c4 = new AbortController();
cancellable(sleep(1000), c4.signal).catch((e) => console.log("Reason:", e));
c4.abort("user left");
// Expected: Reason: user left
