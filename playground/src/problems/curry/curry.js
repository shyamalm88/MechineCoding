/**
 * Transform f(a, b, c) into f(a)(b)(c) — and any mix such as f(a, b)(c).
 *
 * Collect arguments until at least `fn.length` have arrived, then invoke.
 */
export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args)
    // Not enough yet: return a function that keeps collecting.
    return (...rest) => curried.apply(this, [...args, ...rest])
  }
}

/**
 * Infinite currying: add(1)(2)(3)... accumulates until the result is coerced
 * to a primitive, at which point toString/valueOf returns the sum.
 */
export function infiniteAdd(a) {
  const next = (b) => infiniteAdd(a + b)
  next.valueOf = () => a
  next.toString = () => String(a)
  return next
}
