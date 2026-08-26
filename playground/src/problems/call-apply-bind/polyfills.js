/**
 * call / apply / bind, implemented from scratch.
 *
 * The shared trick: to make a function run with a chosen `this`, temporarily
 * make it a PROPERTY of that object and invoke it as a method -- because
 * `obj.fn()` sets `this` to `obj`. A Symbol key avoids clobbering anything.
 */

Function.prototype.myCall = function (thisArg, ...args) {
  const context = thisArg ?? globalThis
  const key = Symbol('fn')
  context[key] = this
  const result = context[key](...args)
  delete context[key] // clean up so we don't mutate the caller's object
  return result
}

Function.prototype.myApply = function (thisArg, argsArray = []) {
  // Identical to call, except arguments arrive as an array.
  return this.myCall(thisArg, ...argsArray)
}

Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const fn = this
  function bound(...callArgs) {
    // If called with `new`, `this` is a fresh instance and must win over
    // thisArg -- that is what makes a bound function still constructible.
    const isNew = this instanceof bound
    return fn.apply(isNew ? this : thisArg, [...boundArgs, ...callArgs])
  }
  // Preserve the prototype chain so `new bound()` produces the right instance.
  bound.prototype = Object.create(fn.prototype ?? null)
  return bound
}
