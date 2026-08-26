/**
 * A from-scratch JSON.stringify covering the rules people forget.
 */
export function stringify(value, seen = new WeakSet()) {
  // toJSON is honoured before anything else -- this is how Date serialises.
  if (value !== null && typeof value?.toJSON === 'function') {
    return stringify(value.toJSON(), seen)
  }

  if (value === null) return 'null'

  const type = typeof value

  if (type === 'number') return Number.isFinite(value) ? String(value) : 'null' // NaN/Infinity -> null
  if (type === 'boolean') return String(value)
  if (type === 'string') return quote(value)
  if (type === 'bigint') throw new TypeError('Do not know how to serialize a BigInt')

  // undefined, functions and symbols are NOT serialisable: dropped in objects,
  // become null in arrays, and produce undefined at the top level.
  if (type === 'undefined' || type === 'function' || type === 'symbol') return undefined

  if (seen.has(value)) throw new TypeError('Converting circular structure to JSON')
  seen.add(value)

  let out
  if (Array.isArray(value)) {
    // Array holes and unserialisable entries become null to preserve length.
    out = `[${value.map((v) => stringify(v, seen) ?? 'null').join(',')}]`
  } else {
    const parts = []
    for (const [k, v] of Object.entries(value)) {
      const s = stringify(v, seen)
      if (s !== undefined) parts.push(`${quote(k)}:${s}`) // skip unserialisable
    }
    out = `{${parts.join(',')}}`
  }
  seen.delete(value)
  return out
}

const ESCAPES = { '"': '\\"', '\\': '\\\\', '\n': '\\n', '\r': '\\r', '\t': '\\t', '\b': '\\b', '\f': '\\f' }
function quote(str) {
  let result = '"'
  for (const char of str) {
    if (ESCAPES[char]) result += ESCAPES[char]
    else if (char < ' ') result += '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')
    else result += char
  }
  return result + '"'
}
