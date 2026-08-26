/**
 * Memoise an async function.
 *
 * Cache the PROMISE, not the resolved value -- that way concurrent callers
 * share one in-flight request instead of each starting their own.
 */
export function memoizeAsync(fn, { keyFn = (...a) => JSON.stringify(a), ttlMs, cacheRejections = false } = {}) {
  const cache = new Map()

  return function memoized(...args) {
    const key = keyFn(...args)
    const hit = cache.get(key)

    if (hit && (!ttlMs || Date.now() < hit.expiresAt)) return hit.promise
    if (hit) cache.delete(key)

    const promise = fn.apply(this, args)
    cache.set(key, { promise, expiresAt: ttlMs ? Date.now() + ttlMs : Infinity })

    if (!cacheRejections) {
      // A cached rejection poisons the key forever -- one network blip and
      // every future call fails instantly. Evict on failure by default.
      promise.catch(() => { if (cache.get(key)?.promise === promise) cache.delete(key) })
    }
    return promise
  }
}
