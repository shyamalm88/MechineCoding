/**
 * Search-suggestion cache: bounded, LRU-evicted, with in-flight deduplication.
 *
 * Two problems it solves beyond a plain object:
 *  1. unbounded growth -- every query a user ever typed stays forever
 *  2. duplicate requests -- the same query fired twice before the first
 *     resolves should share one request, not make two
 */
export function createSuggestionCache(fetcher, { max = 20 } = {}) {
  const cache = new Map()    // query -> results  (insertion order = recency)
  const inFlight = new Map() // query -> promise

  let hits = 0
  let misses = 0

  async function get(query) {
    if (cache.has(query)) {
      hits++
      const value = cache.get(query)
      cache.delete(query)      // refresh recency
      cache.set(query, value)
      return value
    }

    // Dedupe concurrent identical queries.
    if (inFlight.has(query)) return inFlight.get(query)

    misses++
    const promise = fetcher(query)
      .then((results) => {
        cache.set(query, results)
        if (cache.size > max) cache.delete(cache.keys().next().value) // evict LRU
        return results
      })
      .finally(() => inFlight.delete(query))

    inFlight.set(query, promise)
    return promise
  }

  return { get, stats: () => ({ hits, misses, size: cache.size }), keys: () => [...cache.keys()] }
}
