# React Strict Mode — why effects run twice

## The short answer

In **development only**, `<StrictMode>` deliberately double-invokes things:

- components render **twice**
- every `useEffect` runs **setup → cleanup → setup**
- `useState` initialisers, `useMemo` and reducers are called twice

Production is completely unaffected. This is a **bug-detector**, not a bug.

## Why React does this

### Double render catches impure components

A React component must be a pure function of its props and state. If rendering
mutates something outside itself, doing it twice produces visibly wrong output:

```jsx
let total = 0
function Cart({ items }) {
  items.forEach(i => { total += i.price })   // ✗ mutating outer state in render
  return <p>{total}</p>
}
```

Rendered once this looks fine. Rendered twice the total doubles — and the bug
surfaces **immediately in development**, rather than at some unpredictable
future point when React re-renders for its own reasons (a parent update,
a concurrent retry, an interrupted transition).

### Setup → cleanup → setup catches missing cleanup

React simulates the component being **unmounted and remounted with its state
preserved**. That is not hypothetical: it is exactly what happens with
`<Offscreen>`/Activity, with fast refresh, and when a transition is thrown away
and retried.

An effect that cannot survive that is broken; Strict Mode just makes it obvious
now.

## The bugs it actually finds

```jsx
// ✗ leaks: two subscriptions, no way to remove the first
useEffect(() => {
  socket.connect()
}, [])

// ✓ idempotent
useEffect(() => {
  socket.connect()
  return () => socket.disconnect()
}, [])
```

The same shape applies to `setInterval`, event listeners, observers, and
in-flight fetches — which need an `AbortController` or an ignore flag so a
resolved request cannot set state after the effect was torn down.

## What people do wrong

They delete `<StrictMode>`.

The double-invoke is the **messenger**. If running an effect twice breaks your
app, the app is broken in production too — you have a leak or a duplicated side
effect that will surface eventually, just less reproducibly.

The correct fix is always to make the effect **idempotent by writing its
cleanup**. If you genuinely cannot (a one-off analytics ping, say), a ref guard
is acceptable:

```jsx
const sent = useRef(false)
useEffect(() => {
  if (sent.current) return
  sent.current = true
  trackPageView()
}, [])
```

but reach for that only after concluding cleanup is impossible.

## Not everything is doubled

Only render-phase work and effects. Event handlers, network responses and
`useRef` mutations outside render are not re-run. Console logs from double
renders are also deliberately dimmed in React 18+ so the noise is obvious.

## How to answer this out loud

"Strict Mode double-invokes renders and effects in development to surface
impurity and missing cleanup. The setup-cleanup-setup cycle simulates a
remount with preserved state, which is what actually happens with fast refresh
and concurrent features. So if an effect breaks when run twice, that's a real
bug — usually a subscription or timer with no teardown — and the fix is to write
the cleanup, not to remove Strict Mode."

## Follow-ups to expect

- *Does this happen in production?* No — development only.
- *Why did my API get called twice?* Because the effect has no cleanup to abort
  the first request; that is the bug being reported.
- *What else does Strict Mode warn about?* Legacy string refs, deprecated
  lifecycles, and unsafe `findDOMNode` usage.
