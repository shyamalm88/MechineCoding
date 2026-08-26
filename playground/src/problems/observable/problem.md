# Observable (a minimal RxJS)

## Observable vs Promise

| | Promise | Observable |
|---|---|---|
| Values | **One** | **Many** (a stream) |
| Execution | **Eager** — starts at construction | **Lazy** — starts on `subscribe` |
| Cancellable | **No** | **Yes** — `unsubscribe()` |
| Reusable | Same result to every `.then` | Each subscribe runs the producer again |

Laziness is the property people underestimate. `new Promise(fn)` runs `fn`
immediately; `new Observable(fn)` stores it and runs it per subscription. That
is what makes an observable a *recipe* rather than a *result*.

## Teardown must propagate

```js
map(fn) {
  return new Observable(obs => {
    const sub = this.subscribe({ ... })
    return () => sub.unsubscribe()   // ← without this, the source leaks
  })
}
```

Each operator returns a new Observable wrapping the previous one, so
unsubscribing at the end of the chain must cascade all the way to the source and
clear its interval/listener. Omitting the teardown is the classic bug: the chain
stops emitting to you but the underlying timer keeps running forever.

## Guard against post-completion emissions

Once `complete()` or `error()` has fired, further `next()` calls must be
ignored. A producer that keeps pushing after completion violates the contract
and causes very confusing downstream behaviour — hence the `active` flag.

## Where this is genuinely better than promises

- Anything with **multiple values over time**: WebSocket messages, DOM events,
  polling.
- Anything needing **cancellation**: a typeahead where a new keystroke must
  abandon the in-flight search (`switchMap` is exactly this).
- Time-based composition: `debounceTime`, `throttleTime`, `retryWhen` — awkward
  to express with promises, one operator here.

## The trade-off

RxJS has a large surface area and a real learning curve, and for a single async
value a promise is simpler and more idiomatic. Signals (Solid, Angular, Vue) are
a lighter-weight answer to much of the same problem, which is worth mentioning.
