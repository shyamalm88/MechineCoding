/**
 * Structural diff of two nested objects.
 *
 * Returns a flat map of "a.b.c" -> { type, from, to } so the result is easy
 * to render and easy to assert on.
 */
const isObject = (v) => v !== null && typeof v === 'object' && !(v instanceof Date)

export function deepDiff(before, after, prefix = '', out = {}) {
  // Union of keys -- iterating only `before` would miss additions, and only
  // `after` would miss deletions.
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])

  for (const key of keys) {
    const path = prefix ? `${prefix}.${key}` : key
    const a = before?.[key]
    const b = after?.[key]

    const inA = before != null && key in before
    const inB = after != null && key in after

    if (!inB) { out[path] = { type: 'removed', from: a }; continue }
    if (!inA) { out[path] = { type: 'added', to: b }; continue }

    if (isObject(a) && isObject(b) && Array.isArray(a) === Array.isArray(b)) {
      deepDiff(a, b, path, out)
      continue
    }

    // Object.is so NaN vs NaN is "unchanged" and +0 vs -0 is a change.
    if (!Object.is(a, b)) {
      if (a instanceof Date && b instanceof Date && a.getTime() === b.getTime()) continue
      out[path] = { type: 'changed', from: a, to: b }
    }
  }
  return out
}
