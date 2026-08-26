# useLayoutEffect vs useEffect

## Timing

```
render ▶ DOM mutated ▶ useLayoutEffect ▶ BROWSER PAINTS ▶ useEffect
                          (blocking)                        (async)
```

`useLayoutEffect` runs **synchronously after DOM mutation but before paint**.
`useEffect` runs after the browser has painted.

## When layout effect is required

When you must measure or mutate the DOM and the user must never see the
intermediate state:

```js
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect()
  setTooltipPosition(height)      // no flicker: happens before paint
}, [])
```

With `useEffect` here, the browser paints the tooltip at position 0, then
repositions it — a visible flash.

## Default to useEffect

`useLayoutEffect` blocks paint. Slow work inside it directly delays the frame,
so it is the wrong home for data fetching, subscriptions, or anything async.
Use it only for synchronous DOM reads/writes that affect what is about to be
painted.

## The SSR warning

> useLayoutEffect does nothing on the server

There is no DOM and no paint during SSR, so it cannot run — meaning markup
rendered on the server will not include its effect, and hydration may mismatch.

The standard workaround:

```js
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
```

## Related

`useInsertionEffect` runs even earlier — before DOM mutations — and exists
specifically for CSS-in-JS libraries injecting styles. Application code should
essentially never need it.
