# Async utilities: retry, timeout, cancellable task

## Retry with a delay — `promiseRetry(fn, retries = 3, delay = 100)`

Recursion instead of a loop: `attempt(n)` runs `fn()`; on success it resolves the
outer promise, on failure it either rejects (no attempts left) or waits `delay`
ms and calls `attempt(n + 1)`. `retries` is the **total** number of attempts, and
the final rejection carries the last error.

The delay here is fixed. Two upgrades worth naming:

- **Exponential backoff** — `delay * factor ** attempt`: 100ms, 200ms, 400ms…
- **Jitter** — without randomisation, every client that failed during an outage
  retries at exactly the same moment and knocks the recovering server straight
  back over (the *thundering herd*).

Also worth saying: **only retry idempotent operations**. Retrying a payment
because the response timed out can charge twice, and you cannot tell a lost
request from a lost response.

## Timeout — `promiseWithTimeout(promise, timeout)`

```js
Promise.race([promise, timeoutPromise])
```

The essential caveat: **the loser keeps running.** `race` does not cancel
anything — the original request completes, its response is just ignored. For a
real cancellation you need `AbortController`:

```js
fetch(url, { signal: controller.signal })
controller.abort()
```

## Cancellable task — `cancellableAsyncTask(signal)`

Promises have no cancellation in the language; cancellation is wired through an
`AbortSignal`. Inside the promise constructor:

1. If `signal.aborted` is already true, reject immediately.
2. Start the work (here a 1s `setTimeout`).
3. On the signal's `abort` event, clear the timer and reject with an
   `AbortError`.

## Traps

- Retrying non-idempotent requests.
- Unbounded retries with no cap or circuit breaker.
- Retrying a 4xx — the request is wrong; repeating it will not help.
- The timeout helper never clears its timer, so a fast promise leaves a pending
  timer behind until it fires.
