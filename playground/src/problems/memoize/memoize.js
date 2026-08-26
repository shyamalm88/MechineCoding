/**
 * Cache results by argument list.
 *
 * Two caches on purpose:
 *  - a Map keyed by a serialised string for primitive arguments
 *  - a WeakMap chain for object arguments, so cached entries don't pin
 *    objects in memory (a string key would leak them forever)
 */
export function memoize(fn, keyFn) {
  const primitiveCache = new Map()
  const objectCache = new WeakMap()

  return function memoized(...args) {
    if (keyFn) {
      const key = keyFn(...args)
      if (!primitiveCache.has(key)) primitiveCache.set(key, fn.apply(this, args))
      return primitiveCache.get(key)
    }

    // Single object argument: key the WeakMap directly by identity.
    if (args.length === 1 && (typeof args[0] === 'object' && args[0] !== null)) {
      if (!objectCache.has(args[0])) objectCache.set(args[0], fn.apply(this, args))
      return objectCache.get(args[0])
    }

    // Primitives: serialise. JSON.stringify distinguishes 1 from "1" because
    // the latter is quoted -- a plain join() would not.
    const key = JSON.stringify(args)
    if (!primitiveCache.has(key)) primitiveCache.set(key, fn.apply(this, args))
    return primitiveCache.get(key)
  }
}
