/**
 * Polyfill: Promise.prototype.finally
 *
 * `.finally(onFinally)` runs `onFinally` regardless of whether the promise
 * fulfilled or rejected, WITHOUT changing the outcome (the resolved value
 * or rejection reason passes through untouched) — unless `onFinally` itself
 * throws or returns a rejected promise, which overrides the result.
 */
Promise.prototype.myFinally = function (onFinally) {
  return this.then(
    (value) => Promise.resolve(onFinally()).then(() => value),
    (reason) => Promise.resolve(onFinally()).then(() => Promise.reject(reason)),
  );
};

// ============================================================================
// TEST CASES
// ============================================================================
Promise.resolve("ok")
  .myFinally(() => console.log("finally (resolve case)"))
  .then((v) => console.log("value:", v));
// finally (resolve case)
// value: ok

Promise.reject("err")
  .myFinally(() => console.log("finally (reject case)"))
  .catch((e) => console.log("error:", e));
// finally (reject case)
// error: err
