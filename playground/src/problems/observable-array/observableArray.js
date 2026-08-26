/**
 * Fire a callback whenever an element is pushed onto an array.
 *
 * Two approaches, both worth knowing.
 */

/** 1. Proxy -- intercepts ALL mutations, including arr[i] = x and length. */
export function observableProxy(target, onChange) {
  return new Proxy(target, {
    set(obj, prop, value) {
      const isIndex = typeof prop === 'string' && String(Number(prop)) === prop
      obj[prop] = value
      // `length` also fires on push; only report real element writes.
      if (isIndex) onChange({ type: 'set', index: Number(prop), value })
      return true // must return true or strict mode throws
    },
    deleteProperty(obj, prop) {
      delete obj[prop]
      onChange({ type: 'delete', index: Number(prop) })
      return true
    },
  })
}

/** 2. Method patching -- narrower, but does not intercept arr[i] = x. */
export function observableMethods(target, onChange) {
  const patched = ['push', 'pop', 'shift', 'unshift', 'splice']
  for (const name of patched) {
    Object.defineProperty(target, name, {
      configurable: true,
      enumerable: false, // keep it off for..in / Object.keys
      value(...args) {
        const result = Array.prototype[name].apply(this, args)
        onChange({ type: name, args, length: this.length })
        return result
      },
    })
  }
  return target
}
