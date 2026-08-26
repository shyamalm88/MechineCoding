/** Flatten a nested array to the given depth. */
export function flatten(arr, depth = 1) {
  return depth < 1
    ? arr.slice()
    : arr.reduce(
        (acc, item) =>
          acc.concat(Array.isArray(item) ? flatten(item, depth - 1) : item),
        [],
      )
}

/** Iterative version -- no recursion, so no stack overflow on deep input. */
export function flattenIterative(arr) {
  const stack = [...arr]
  const out = []
  while (stack.length) {
    const item = stack.pop()
    if (Array.isArray(item)) stack.push(...item)
    else out.push(item)
  }
  return out.reverse() // popping reverses order, so restore it
}

/** Nested object -> flat "a.b.c" key/value pairs. */
export function flattenObject(obj, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    // Arrays and null are typeof 'object' too -- only recurse into plain objects.
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, path, out)
    } else {
      out[path] = value
    }
  }
  return out
}
