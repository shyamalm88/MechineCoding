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

// ─── Usage ───────────────────────────────────────────────────────────────────

const double = (x) => x * 2;
const increment = (x) => x + 1;
const square = (x) => x * x;

const transform = compose(square, increment, double);
// Right-to-left: double runs first, then increment, then square
console.log(transform(3)); // double(3)=6 -> increment(6)=7 -> square(7)=49

console.log(transform(3) === square(increment(double(3)))); // true

// Edge cases
console.log(compose()(1, 2, 3)); // [ 1, 2, 3 ] — no functions: forwards all args, changes nothing
console.log(compose(double)(5)); // 10 — single function: returned as-is, no wrapping

// Key talking points:
// 1. compose = right-to-left, pipe = left-to-right — same reduce, different
//    argument order in the inner call (a(b(...args)) vs b(a(...args)))
// 2. Each composed function must return exactly what the next one (going
//    left) expects as input — a broken link anywhere in the chain silently
//    passes the wrong shape of data forward, no type-checking in between
// 3. The identity edge case (0 functions) is an easy place to lose
//    arguments if you forget the rest/spread parameter — see comment above
