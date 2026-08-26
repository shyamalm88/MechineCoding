# EventEmitter / pub-sub pattern

`on`, `once`, `off`, `emit` — decoupling publishers from subscribers.

## Design decisions worth defending

**`Map<string, Set<handler>>`.** A `Set` deduplicates automatically (registering
the same handler twice really does mean once) and gives O(1) delete. An array
requires `indexOf` + `splice`.

**`on` returns an unsubscribe function.** Requiring `off(event, handler)` forces
the caller to keep the exact reference — and the single most common bug is
passing a *different* arrow function to `off` than to `on`, so nothing is ever
removed:

```js
bus.on('x', () => f())
bus.off('x', () => f())   // different function — silently does nothing
```

## The bug almost everyone writes

```js
emit(event, ...args) {
  for (const h of this.listeners.get(event)) h(...args)   // ✗
}
```

If a handler unsubscribes itself (which `once` does by definition), you are
mutating the collection mid-iteration — handlers get skipped. **Copy before
iterating**: `[...set]`.

Related: `once` must remove the wrapper **before** invoking the handler, so a
throwing handler still leaves the emitter clean.

## Memory leaks

Every `on` without a matching `off` is a leak, and it also pins whatever the
handler closes over. Deleting the event key when its `Set` empties stops the
`Map` growing forever in an app with many short-lived event names.

## Follow-ups

- **Wildcards** — `on('*')` for logging.
- **Error isolation** — one throwing handler currently aborts the rest;
  wrapping each in `try/catch` is usually better.
- **Async** — should `emit` await handlers? Node's does not.
- `EventTarget` is the browser-native equivalent and supports
  `{ signal }` for automatic cleanup via `AbortController`.
