/**
 * ============================================================================
 * PROBLEM: Typeahead / Autocomplete Search with Stale-Request Cancellation
 * ============================================================================
 * Classic frontend system-design question (Meta, Uber, Adobe, Google).
 *
 * Build a search box controller that:
 * 1. Debounces keystrokes (don't fire a request on every character).
 * 2. Fires an API call per query.
 * 3. NEVER lets a slow, stale response overwrite the result of a newer query
 *    — i.e. handles out-of-order network responses (race conditions).
 * 4. Cancels the in-flight request for the previous query when a new one
 *    is issued (via AbortController), so the server work is actually
 *    abandoned, not just ignored client-side.
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * Two different bugs show up if you naively call `fetch` on every keystroke:
 *
 *  - "Out of order responses": type "re" then "react". The request for "re"
 *    is slow and resolves AFTER the request for "react" — if you blindly
 *    render whatever resolves last, the UI shows results for "re" while the
 *    input says "react".
 *
 *  - "Wasted/duplicate requests": every keystroke fires a network call,
 *    most of which are immediately superseded.
 *
 * ALGORITHM
 * - Debounce: delay firing the request until the user pauses typing.
 * - Request token: increment a counter (or store the query string) before
 *   each request; when a response arrives, only use it if it's still the
 *   "latest" request issued. Stale responses are silently dropped.
 * - AbortController: store the controller for the in-flight request; calling
 *   `.abort()` on a new keystroke cancels the previous fetch entirely.
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * User types "r" -> "re" -> "react" quickly (within debounce window each time)
 *  - Only the FINAL debounced call ("react") actually fires.
 * User types "cat" (request takes 500ms), then "dog" (request takes 50ms):
 *  - "dog" request is issued, "cat" request is aborted.
 *  - "dog" resolves first (and is latest) -> renders "dog" results.
 *  - "cat" fetch is aborted -> its `.then` never runs (or rejects w/ AbortError,
 *    which we swallow).
 */
class TypeaheadSearch {
  constructor(fetchSuggestions, { delay = 300 } = {}) {
    this.fetchSuggestions = fetchSuggestions; // (query, signal) => Promise<string[]>
    this.delay = delay;
    this.timerId = null;
    this.controller = null;
    this.latestQuery = null;
  }

  /**
   * Call on every keystroke. `onResult` is invoked once with the results
   * for the most recent query — guaranteed never to fire for a stale query.
   */
  search(query, onResult, onError = () => {}) {
    this.latestQuery = query;

    // Debounce: reset the timer on every keystroke
    clearTimeout(this.timerId);

    if (query === "") {
      this.#cancelInFlight();
      onResult([]);
      return;
    }

    this.timerId = setTimeout(() => {
      this.#fire(query, onResult, onError);
    }, this.delay);
  }

  #cancelInFlight() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  async #fire(query, onResult, onError) {
    this.#cancelInFlight();
    const controller = new AbortController();
    this.controller = controller;

    try {
      const results = await this.fetchSuggestions(query, controller.signal);

      // Drop the response if a newer query has been issued since.
      if (query !== this.latestQuery) return;

      onResult(results);
    } catch (err) {
      if (err.name === "AbortError") return; // expected — superseded request
      onError(err);
    }
  }
}

// ============================================================================
// TEST CASES — mock fetch with controllable latency + AbortController support
// ============================================================================
function mockFetchSuggestions(query, signal) {
  const latency = { cat: 500, dog: 50, react: 100 }[query] ?? 100;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve([`${query}-result-1`, `${query}-result-2`]);
    }, latency);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      const err = new Error("aborted");
      err.name = "AbortError";
      reject(err);
    });
  });
}

console.log("=== Typeahead Search Tests ===\n");

const typeahead = new TypeaheadSearch(mockFetchSuggestions, { delay: 0 });

// Simulate fast typing — only the last call ("react") should ever resolve,
// because each new `search()` resets the debounce timer.
typeahead.search("r", (r) => console.log("UNEXPECTED (r):", r));
typeahead.search("re", (r) => console.log("UNEXPECTED (re):", r));
typeahead.search("react", (r) => console.log('"react" results:', r));

// Race-condition scenario: slow "cat" fired first, fast "dog" fired right
// after — "dog" must win and "cat" must be aborted.
setTimeout(() => {
  console.log("\n--- race condition test ---");
  typeahead.search("cat", (r) => console.log("UNEXPECTED (cat):", r));
  setTimeout(() => {
    typeahead.search("dog", (r) => console.log('"dog" results:', r));
  }, 10);
}, 200);

module.exports = { TypeaheadSearch };
