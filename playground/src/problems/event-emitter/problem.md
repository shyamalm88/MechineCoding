# EventEmitter / pub-sub pattern

`on`, `once`, `off`, `emit` — decoupling publishers from subscribers.

## Design

```js
this.events = {}            // event name -> array of listeners
```

- **`on(event, listener)`** pushes onto the array (creating it on first use) and
  **returns an unsubscribe function** — the bonus-points detail.
- **`off(event, listener)`** replaces the array with a filtered copy.
- **`emit(event, ...args)`** calls every listener with `listener.apply(this, args)`.
- **`once(event, listener)`** registers a wrapper that runs the listener and then
  removes **itself**.

## Why unsubscribe-from-`on` matters

Requiring `off(event, handler)` forces the caller to keep the exact reference —
and the single most common bug is passing a *different* arrow function to `off`
than to `on`, so nothing is ever removed:

```js
bus.on('x', () => f())
bus.off('x', () => f())   // different function — silently does nothing
```

## The classic mutation bug, and why this version avoids it

Removing a listener while `emit` is iterating the same array makes the loop skip
the next handler. Because `off` builds a **new array with `filter`** instead of
`splice`-ing in place, a `forEach` already running keeps walking the old array —
so `once` can safely remove itself mid-emit.

Using `splice` in `off` would reintroduce the bug; copying (`[...listeners]`)
before iterating is the other standard fix.

## Memory leaks

Every `on` without a matching `off` is a leak, and it also pins whatever the
listener closes over. This version never deletes an event key once created, so an
app with many short-lived event names grows the object forever — delete the key
when its array empties.

## Follow-ups

- **A `Map<string, Set<handler>>`** — a `Set` dedupes and gives O(1) delete.
- **Wildcards** — `on('*')` for logging.
- **Error isolation** — one throwing listener aborts the rest; wrapping each in
  `try/catch` is usually better.
- **`once` that throws** — the wrapper runs the listener *before* removing
  itself, so a throwing listener stays registered; remove first to avoid that.
- **Async** — should `emit` await listeners? Node's does not.
- `EventTarget` is the browser-native equivalent and supports `{ signal }` for
  automatic cleanup via `AbortController`.
