/**
 * DataLoader-style batching: collect individual requests made in the same
 * tick (or window) and issue ONE combined call, routing results back to the
 * individual callers.
 */
export function createBatchLoader(batchFn, { maxBatchSize = 25, windowMs = 0 } = {}) {
  let queue = []       // [{ key, resolve, reject }]
  let scheduled = false
  const cache = new Map()

  const flush = () => {
    const batch = queue
    queue = []
    scheduled = false
    if (batch.length === 0) return

    batchFn(batch.map((b) => b.key)).then(
      (results) => {
        // The contract: results must be the SAME LENGTH and SAME ORDER as keys.
        batch.forEach((b, i) => b.resolve(results[i]))
      },
      (error) => batch.forEach((b) => b.reject(error)),
    )
  }

  const schedule = () => {
    if (scheduled) return
    scheduled = true
    // windowMs 0 ⇒ microtask: batches everything queued in the current tick,
    // which is what DataLoader does. A timer widens the window across ticks.
    if (windowMs > 0) setTimeout(flush, windowMs)
    else queueMicrotask(flush)
  }

  return {
    load(key) {
      if (cache.has(key)) return cache.get(key)      // dedupe identical keys
      const promise = new Promise((resolve, reject) => {
        queue.push({ key, resolve, reject })
        if (queue.length >= maxBatchSize) flush()
        else schedule()
      })
      cache.set(key, promise)
      return promise
    },
    clear: () => cache.clear(),
  }
}
