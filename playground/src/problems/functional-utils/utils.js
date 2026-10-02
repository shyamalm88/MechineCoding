// ---- pipe.js ----
const pipe = (...funcs) => {
  if (funcs.length === 0) return (x) => x;
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(
    (prevFn, nextFn) =>
      (...args) =>
        nextFn(prevFn(...args)),
  );
};

// ---- compose.js ----
/**
 * ============================================================================
 * PROBLEM: Implement `compose` — combine functions right-to-left
 * ============================================================================
 *
 * INTUITION:
 * compose(f, g, h)(x) === f(g(h(x)))
 * Data flows through the RIGHTMOST function first, then each function in
 * turn, ending at the LEFTMOST — the same order as mathematical function
 * composition (f ∘ g ∘ h). This is the Redux/lodash `compose` convention;
 * `pipe` is the mirror-image left-to-right version.
 *
 * ALGORITHM:
 * `reduce` (no seed) walks the functions left-to-right, but each step nests
 * the running accumulator INSIDE a call to the new function — that's what
 * flips the final execution order to right-to-left. For [f, g, h]:
 *   step 1: acc = (...args) => f(g(...args))
 *   step 2: acc = (...args) => [acc from step 1](h(...args))
 *                = (...args) => f(g(h(...args)))
 * `h` — the last function reduced against — ends up as the INNERMOST call,
 * so it's the first one to actually run, on the original arguments.
 *
 * COMPLEXITY:
 * - Building the composed function: O(n), n = funcs.length
 * - Calling it: O(n) — one call per wrapped function
 * ============================================================================
 */
const compose = function (...funcs) {
  // Identity case must forward ALL arguments via `...args`, matching the
  // multi-function path below — `(args) => args` (single param, no rest)
  // would silently drop every argument after the first, e.g.
  // compose()(1, 2, 3) would return just `1` instead of `[1, 2, 3]`.
  if (funcs.length === 0) return (...args) => args;
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
  // Note: the length === 1 guard above is technically redundant --
  // `funcs.reduce(...)` on a single-element array with no seed returns that
  // element unchanged without ever invoking the callback (verified: reduce
  // needs at least 2 elements, or a seed, to call its reducer at all). Kept
  // explicit anyway: it documents the intent and skips building an unused
  // reduce closure for the common single-function case.
};

// ---- groupBy.js ----
/**
 * ============================================================================
 * PROBLEM: Implement lodash `_.groupBy` (and the modern `Object.groupBy`)
 * ============================================================================
 */
function groupBy(array, iteratee) {
  const getKey = (item) =>
    typeof iteratee === "function" ? iteratee(item) : item[iteratee];

  const result = {};

  for (const item of array) {
    const key = getKey(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}


// ---- once.js ----
/**
 * ============================================================================
 * PROBLEM: Implement `once(fn)`
 * ============================================================================
 * Return a wrapped version of `fn` that can only ever run ONCE. The first
 * call invokes `fn` and caches its return value; every subsequent call
 * (with any arguments) returns that same cached value WITHOUT calling `fn`
 * again.
 *
 * Example:
 * const init = once(() => { console.log("init!"); return "done"; });
 * init(); // logs "init!", returns "done"
 * init(); // (nothing logged), returns "done"
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * This is different from memoization: memoization caches one result PER
 * distinct set of arguments, and re-runs `fn` for new argument combos.
 * `once` ignores arguments entirely and guarantees `fn` runs at most one
 * time total — useful for one-time setup/init logic, event handlers that
 * should fire only once, idempotent teardown, etc.
 *
 * A simple boolean flag + cached result is enough; no Map of argument keys
 * needed.
 */
function once(fn) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      result = fn.apply(this, args);
      called = true;
    }
    return result;
  };
}

// ---- chunk.js ----
/**
 * ============================================================================
 * PROBLEM: Implement lodash `_.chunk`
 * ============================================================================
 * Split an array into groups of `size`. The last chunk may be smaller if
 * the array can't be divided evenly.
 *
 * Example:
 * chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * Walk the array in steps of `size`, slicing out one chunk per step.
 * `Array.prototype.slice` already clamps to the array bounds, so the final
 * (possibly shorter) chunk falls out naturally — no special-casing needed.
 */
function chunk(array, size = 1) {
  if (size < 1) return [];

  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export { pipe, compose, groupBy, once, chunk }
