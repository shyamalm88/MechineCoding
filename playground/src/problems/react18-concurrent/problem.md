# React 18 concurrent features — useTransition and useDeferredValue

Both mark work as **non-urgent** so React can interrupt it to keep input
responsive. They differ in what you control.

## useTransition — you own the state update

```js
const [isPending, startTransition] = useTransition()

function onChange(e) {
  setQuery(e.target.value)                      // urgent: the input must feel instant
  startTransition(() => setResults(filter(e.target.value)))  // non-urgent
}
```

You get `isPending` for a loading affordance. Use it when you can wrap the
setter yourself.

## useDeferredValue — you only have the value

```js
const deferredQuery = useDeferredValue(query)
const results = useMemo(() => filter(deferredQuery), [deferredQuery])
```

React keeps the previous value while re-rendering with the new one in the
background. Use it when the value arrives as a **prop** and you cannot reach the
`setState` call.

## The mechanism

Typing stays at 60fps because the expensive re-render is interruptible: each new
keystroke is urgent, so React abandons the in-progress non-urgent render and
starts over with the latest input. Without this, every keystroke queues a full
blocking render.

## Traps

- Neither makes the work **faster** — the filtering costs the same. They change
  *scheduling*, so the main thread stays free for input. If the render is slow
  because of an O(n²) algorithm, fix the algorithm.
- Not for network data — that is Suspense's job.
- `useDeferredValue` renders the component twice (old value, then new), so the
  render itself must be cheap or memoised.
