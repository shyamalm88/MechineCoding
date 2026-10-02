// ---- promiseCoalescing.js ----
/**
 * ============================================================================
 * PROBLEM: Promise Coalescing (Request Deduplication)
 * ============================================================================
 * If multiple parts of an application request the same resource (URL) simultaneously,
 * we want to make only one network request and share the result.
 *
 * ============================================================================
 * INTUITION: Map Cache
 * ============================================================================
 * 1. Check a `Map` to see if a request for this URL is already pending.
 * 2. If yes, return the existing promise.
 * 3. If no, start the request, store the promise in the Map.
 * 4. IMPORTANT: When the promise settles (success or fail), remove it from the Map
 *    so future requests fetch fresh data.
 */
const pendingRequests = new Map();

function coalescedFetch(url) {
  if (pendingRequests.has(url)) {
    console.log(`[Cache Hit] Returning existing promise for: ${url}`);
    return pendingRequests.get(url); // Return the existing promise
  }

  console.log(`[Network] Fetching: ${url}`);
  const fetchPromise = fetch(url).finally(() => {
    pendingRequests.delete(url); // Clean up after completion
  });

  pendingRequests.set(url, fetchPromise);
  return fetchPromise;
}

// ---- latestOnlyExecutor.js ----
/**
 * ============================================================================
 * PROBLEM: Last Resolved Promise (SwitchMap / TakeLatest)
 * ============================================================================
 * Implement a higher-order function that wraps an async function.
 * When the wrapped function is called multiple times, only the result of the
 * latest call should be returned (resolved). Previous calls that are still
 * pending should be ignored (or rejected, depending on spec, but usually ignored).
 *
 * This is common in UI search inputs (Auto-complete) where you only care
 * about the result of the latest keystroke query.
 *
 * ============================================================================
 * INTUITION: Request ID / Counter
 * ============================================================================
 * 1. Maintain a `latestId` counter in the closure.
 * 2. Every time the wrapper is called:
 *    - Increment `latestId`.
 *    - Capture the current id in a local variable `id`.
 *    - Call the original async function.
 * 3. When the promise resolves/rejects:
 *    - Compare `id` with `latestId`.
 *    - If `id === latestId`, this is the latest request. Resolve/Reject.
 *    - If `id !== latestId`, a newer request has started. Ignore this result.
 */

function createLatestFetcher(fn) {
  let latestId = 0;

  return async function (...args) {
    latestId += 1;
    const currentId = latestId;

    try {
      const value = await fn(...args);

      if (currentId === latestId) {
        return value;
      }
    } catch (err) {
      if (currentId === latestId) {
        throw err;
      }
    }
  };
}

export { coalescedFetch, createLatestFetcher }
