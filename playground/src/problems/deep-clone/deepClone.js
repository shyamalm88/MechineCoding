/**
 * Structural deep clone handling the cases JSON round-tripping destroys.
 *
 * The `seen` WeakMap is what makes circular references work: before recursing
 * we record the clone, so revisiting the same source object returns the
 * already-created clone instead of recursing forever.
 */
export function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value // primitives, functions

  if (seen.has(value)) return seen.get(value) // circular reference

  if (value instanceof Date) return new Date(value)
  if (value instanceof RegExp) return new RegExp(value.source, value.flags)

  if (value instanceof Map) {
    const out = new Map()
    seen.set(value, out)
    for (const [k, v] of value) out.set(deepClone(k, seen), deepClone(v, seen))
    return out
  }

  if (value instanceof Set) {
    const out = new Set()
    seen.set(value, out)
    for (const v of value) out.add(deepClone(v, seen))
    return out
  }

  const out = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  seen.set(value, out) // register BEFORE recursing

  // Reflect.ownKeys includes symbols and non-enumerables, which a for..in loop
  // would silently drop.
  for (const key of Reflect.ownKeys(value)) {
    out[key] = deepClone(value[key], seen)
  }
  return out
}
