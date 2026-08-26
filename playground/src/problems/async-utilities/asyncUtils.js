/** Pause an async flow. */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Retry with exponential backoff and jitter.
 * Jitter matters: without it, N clients that failed together all retry at the
 * same instant, hammering a recovering server ("thundering herd").
 */
export async function retry(fn, { attempts = 3, baseDelay = 100, factor = 2 } = {}) {
  let lastError
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn(attempt)
    } catch (error) {
      lastError = error
      if (attempt === attempts - 1) break
      const backoff = baseDelay * factor ** attempt
      await sleep(backoff * (0.5 + Math.random() * 0.5)) // full-ish jitter
    }
  }
  throw lastError
}

/** Reject if `promise` has not settled within `ms`. */
export function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)),
  ])
}

/**
 * A promise you can abandon.
 *
 * Nothing can truly cancel a promise -- the underlying work keeps running.
 * What cancel() does is guarantee the consumer's handlers never fire.
 */
export function cancellable(promise) {
  let cancelled = false
  const wrapped = new Promise((resolve, reject) => {
    promise.then(
      (v) => !cancelled && resolve(v),
      (e) => !cancelled && reject(e),
    )
  })
  return { promise: wrapped, cancel: () => { cancelled = true } }
}

/** setInterval that returns a clear function instead of an opaque id. */
export function setCancellableInterval(fn, ms) {
  const id = setInterval(fn, ms)
  return () => clearInterval(id)
}
