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

// ============================================================================
// TEST CASES
// ============================================================================
let callCount = 0;
const init = once(() => {
  callCount++;
  console.log("running init");
  return "initialized";
});

console.log(init()); // "running init" -> "initialized"
console.log(init()); // (nothing logged) -> "initialized"
console.log(init()); // (nothing logged) -> "initialized"
console.log("fn called", callCount, "time(s)"); // 1

// Works with arguments too — only the FIRST call's args are used
const add = once((a, b) => a + b);
console.log(add(2, 3)); // 5
console.log(add(100, 100)); // 5 — ignored, cached result returned

module.exports = { once };
