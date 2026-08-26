# measureFunctionPerformance for sync and async functions

Wrap any function so it reports how long it took — without the caller needing
to know whether it is synchronous or asynchronous.

## Use performance.now(), not Date.now()

- `Date.now()` is wall-clock: it has millisecond resolution and can **jump**
  backwards or forwards (NTP correction, DST, user changing the clock).
- `performance.now()` is **monotonic** and sub-millisecond.

A negative duration from `Date.now()` arithmetic is a real thing that happens.

## Handling both sync and async

Naively adding `await` works — awaiting a non-promise resolves immediately —
but it **forces the sync path to become async**, so a synchronous caller now
gets a promise back. That is a behaviour change, not just a timing detail.

The fix is to detect a thenable and branch:

```js
if (result && typeof result.then === 'function') return result.then(...)
return finish('returned', result)
```

Checking `typeof result.then === 'function'` rather than `instanceof Promise`
also catches custom thenables and promises from another realm (an iframe),
where `instanceof` fails.

## Don't lose errors

`try/catch` covers the synchronous throw; the rejection handler covers the async
one. A wrapper that only measures the happy path silently reports nothing for
the case you most want to investigate.

## Traps

- Timing a single run of a fast function is noise. Real benchmarking needs many
  iterations and a median, plus a warm-up for JIT.
- `performance.now()` resolution is deliberately coarsened in browsers
  (~100µs, more with cross-origin isolation disabled) as a Spectre mitigation.
- `console.time`/`timeEnd` is the quick equivalent, but it cannot return the
  value programmatically.
