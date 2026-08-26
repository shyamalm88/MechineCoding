/**
 * Postpone calling `fn` until `delay` ms have passed since the last call to
 * the returned wrapper. A burst of calls collapses into one invocation.
 */
export function debounce(fn, delay) {
  let timeoutId

  // A regular function (not an arrow) so `this` stays dynamic and can be
  // forwarded to fn -- otherwise obj.debounced() would lose its receiver.
  return function debounced(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}
