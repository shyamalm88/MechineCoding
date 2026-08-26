/**
 * Structural equality.
 *
 * Object.is handles the two cases === gets wrong: NaN (=== itself is false)
 * and +0/-0 (=== each other but are distinguishable).
 */
export function deepEqual(a, b, seen = new WeakMap()) {
  if (Object.is(a, b)) return true

  if (a === null || b === null) return false
  if (typeof a !== 'object' || typeof b !== 'object') return false
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false

  // Cycle guard: if we're already comparing this pair, assume equal --
  // any real difference is found elsewhere in the traversal.
  if (seen.get(a) === b) return true
  seen.set(a, b)

  if (a instanceof Date) return a.getTime() === b.getTime()
  if (a instanceof RegExp) return a.source === b.source && a.flags === b.flags

  if (a instanceof Map) {
    if (a.size !== b.size) return false
    for (const [k, v] of a) {
      if (!b.has(k) || !deepEqual(v, b.get(k), seen)) return false
    }
    return true
  }

  if (a instanceof Set) {
    if (a.size !== b.size) return false
    for (const v of a) if (!b.has(v)) return false
    return true
  }

  const keysA = Reflect.ownKeys(a)
  const keysB = Reflect.ownKeys(b)
  if (keysA.length !== keysB.length) return false

  return keysA.every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key], seen),
  )
}
