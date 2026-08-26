/**
 * Three related fixes for async race conditions.
 */

/**
 * 1. Coalescing: N identical concurrent calls share ONE in-flight request.
 */
export function coalesce(fn, keyFn = (...a) => JSON.stringify(a)) {
  const inFlight = new Map()
  return function coalesced(...args) {
    const key = keyFn(...args)
    if (inFlight.has(key)) return inFlight.get(key)

    const promise = fn.apply(this, args).finally(() => inFlight.delete(key))
    inFlight.set(key, promise)
    return promise
  }
}

/**
 * 2. Latest-only: an older response can NEVER overwrite a newer one.
 *
 * The classic search bug: type "a" then "ab"; the "a" request is slower and
 * lands last, so the user sees results for a query they already replaced.
 */
export function latestOnly(fn) {
  let ticket = 0
  return function latest(...args) {
    const mine = ++ticket
    return fn.apply(this, args).then(
      (value) => {
        if (mine !== ticket) throw Object.assign(new Error('stale'), { stale: true })
        return value
      },
      (error) => {
        if (mine !== ticket) throw Object.assign(new Error('stale'), { stale: true })
        throw error
      },
    )
  }
}

/**
 * 3. Abortable: actually cancel the previous request rather than ignore it.
 */
export function abortable(fn) {
  let controller = null
  return function run(...args) {
    controller?.abort()
    controller = new AbortController()
    return fn(...args, controller.signal)
  }
}
