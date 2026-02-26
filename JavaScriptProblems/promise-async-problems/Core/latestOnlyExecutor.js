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

const fetchData = async (query) => {
  const delay = Math.random() * 1000;
  await new Promise((r) => setTimeout(r, delay));
  return `Result for ${query} (delay: ${delay.toFixed(0)}ms)`;
};

const latestFetch = createLatestFetcher(fetchData);

latestFetch("a").then(console.log);
latestFetch("ab").then(console.log);
latestFetch("abc").then(console.log);
// Only "abc" result will be used
