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

## Cancellable task — `cancellable(promise, signal)`

Promises have no cancellation in the language; cancellation is wired through an
`AbortSignal`. Wrap the promise in a new one:

1. If `signal.aborted` is already true, reject immediately with `signal.reason`.
2. On the signal's `abort` event (`{ once: true }`), reject with `signal.reason`.
3. Forward the original promise's result, then remove the listener so it
   doesn't leak.

The wrapper only stops *waiting* — it cannot stop the underlying work. Pass the
same signal into `fetch` (or clear your own timer) to really cancel it.

## Traps

- Retrying non-idempotent requests.
- Unbounded retries with no cap or circuit breaker.
- Retrying a 4xx — the request is wrong; repeating it will not help.
- The timeout helper never clears its timer, so a fast promise leaves a pending
  timer behind until it fires.
