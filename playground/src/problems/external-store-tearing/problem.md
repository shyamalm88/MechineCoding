# useSyncExternalStore and tearing

## What tearing is

**Tearing** is when different parts of one render show *different values of the
same state* — the UI is internally inconsistent, as if it were torn between two
versions.

It could not happen before React 18, because rendering was synchronous and
uninterruptible. Concurrent rendering changes that: React may pause mid-render,
let other work run, then resume. If an **external** store mutates during that
pause, components rendered before the pause show the old value and components
after it show the new one.

React's own state is immune — it is versioned per render. Anything outside React
(a Redux store, a global, `window.matchMedia`, a WebSocket cache) is not.

## The API

```js
const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
```

- `subscribe(callback)` → returns an unsubscribe function
- `getSnapshot()` → the current value, synchronously
- `getServerSnapshot()` → the value during SSR (required, or hydration throws)

React re-reads the snapshot at the right moments and, if it changed mid-render,
**restarts the render synchronously** rather than committing a torn tree.

## The rule that trips people up

**`getSnapshot` must return a referentially stable value.**

```js
getSnapshot: () => ({ count: state.count })   // ✗ new object every call
```

React compares snapshots with `Object.is`. A fresh object each call means
"changed" every time → infinite re-render loop, which surfaces as
*"The result of getSnapshot should be cached"*.

Return the store's actual object, or cache the derived value. Selecting a slice
needs `useSyncExternalStoreWithSelector` (with a memoised selector), not an
inline object literal.

## Why not just useState + useEffect?

That pattern is *usually* fine, and it is what every store library did before 18.
Its weaknesses:

- **Tearing** under concurrent rendering.
- The subscription is set up in an effect — **after** paint — so a store change
  between render and effect is missed.
- No server-render story, so hydration can mismatch.

## Where you actually meet it

Rarely in app code — it is a **library primitive**. Redux, Zustand, Jotai and
Apollo all use it internally. Knowing it exists, and why, is the interview
signal; hand-writing one is for when you are building a store.

## How to answer this out loud

"Tearing is when one render shows two different values of the same state,
because concurrent rendering can pause mid-render and an external store mutated
during the pause. React's own state is immune since it's versioned per render;
anything outside React isn't. `useSyncExternalStore` takes subscribe,
getSnapshot and getServerSnapshot, and re-reads the snapshot at the right moments
— if it changed mid-render it restarts synchronously rather than committing a
torn tree. The rule that bites is that getSnapshot must return a referentially
stable value, or you get an infinite loop."

## Follow-ups to expect

- *Would I write this in app code?* Rarely — it is a library primitive. Redux,
  Zustand and Jotai use it internally.
- *Why not `useState` + `useEffect`?* It works most of the time, but can tear,
  misses changes between render and effect, and has no server-render story.
- *How do you select a slice?* `useSyncExternalStoreWithSelector` with a memoised
  selector — an inline object literal will loop.
