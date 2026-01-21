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

// ============================================================================
// TEST DATA & USAGE EXAMPLE
// ============================================================================

// Mocking fetch for demonstration purposes (since we aren't in a browser)
if (typeof fetch === "undefined") {
  global.fetch = (url) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Response from ${url}`);
      }, 500);
    });
}

// Scenario: Two components request the same data at the same time.
console.log("--- Batch 1: Simultaneous Requests ---");
const req1 = coalescedFetch("/api/user/1");
const req2 = coalescedFetch("/api/user/1");

Promise.all([req1, req2]).then(([res1, res2]) => {
  console.log("Batch 1 Result 1:", res1);
  console.log("Batch 1 Result 2:", res2);
  console.log("Are promises same reference?", req1 === req2); // true

  // Scenario: Request again after the first batch has finished.
  // The cache should be cleared by .finally(), so this triggers a new fetch.
  setTimeout(() => {
    console.log("\n--- Batch 2: Sequential Request ---");
    coalescedFetch("/api/user/1").then((res3) => {
      console.log("Batch 2 Result:", res3);
    });
  }, 1000);
});
