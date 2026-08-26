# Async utilities: sleep, retry with backoff, timeout, cancellable

## sleep

```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
```

The one-liner everyone should know. Note it cannot be cancelled — the timer
still runs.

## Retry with exponential backoff

Delay grows as `baseDelay * factor ** attempt`: 100ms, 200ms, 400ms…

**Jitter is the part people omit.** Without randomisation, every client that
failed during an outage retries at exactly the same moment and knocks the
recovering server straight back over — the *thundering herd*. Multiplying the
delay by a random factor spreads them out.

Also worth saying: **only retry idempotent operations**. Retrying a payment
because the response timed out can charge twice, and you cannot tell a lost
request from a lost response.

## Timeout

```js
Promise.race([work, rejectAfter(ms)])
```

The essential caveat: **the loser keeps running.** `race` does not cancel
anything — the original request completes, its response is just ignored. For a
real cancellation you need `AbortController`:

```js
fetch(url, { signal: controller.signal })
controller.abort()
```

## "Cancellable" promises

Promises have no cancellation in the language. What this pattern gives you is a
guarantee that **your handlers stop firing** — the underlying work continues.

That is still the fix for the classic React warning about setting state after
unmount: you are not stopping the fetch, you are stopping the callback.

## Traps

- Retrying non-idempotent requests.
- Unbounded retries with no cap or circuit breaker.
- Retrying a 4xx — the request is wrong; repeating it will not help.
- Forgetting `clearTimeout` in a timeout helper leaves a pending timer holding
  a reference.
