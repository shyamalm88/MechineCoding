# useLayoutEffect vs useEffect

## The short answer

Both run after render. The difference is **whether the browser has painted yet**:

- **`useLayoutEffect`** runs after the DOM is updated but **before paint**. It
  *blocks* the browser from drawing.
- **`useEffect`** runs **after paint**, asynchronously.

```
render → DOM mutated → useLayoutEffect → 🖼 BROWSER PAINTS → useEffect
                        (blocking)                            (async)
```

Default to `useEffect`. Reach for `useLayoutEffect` only when the user must
never see the intermediate state.

## The problem it solves: visible flicker

Say you position a tooltip by measuring the element it points at:

```jsx
useEffect(() => {
  const { height } = ref.current.getBoundingClientRect()
  setPosition(height + 8)
}, [])
```

Sequence with `useEffect`:

1. render with `position = 0`
2. **browser paints** — the tooltip appears at the top-left corner
3. effect runs, measures, sets position
4. re-render, browser paints again — tooltip jumps into place

The user sees a **flash** of the tooltip in the wrong spot. It is brief but very
noticeable, and it looks like a bug.

With `useLayoutEffect`, steps 3 and 4 happen *before* step 2, so the tooltip is
only ever painted in its correct position.

## When you need it

The pattern is always the same: **measure or mutate the DOM, and the result
affects what is about to be painted.**

- positioning tooltips, popovers, dropdowns relative to a trigger
- reading `scrollHeight` to auto-size a textarea
- restoring scroll position before the user sees the top of the list
- measuring text to decide whether to truncate

## Why not always use it?

Because it **blocks painting**. Whatever you do inside delays the frame:

```jsx
useLayoutEffect(() => {
  fetchData()          // ✗ blocks paint for the whole request
  subscribe()          // ✗ no reason to block
}, [])
```

Data fetching, subscriptions, logging and timers all belong in `useEffect` —
none of them change what is about to be drawn, so making the user wait is pure
cost.

Rule of thumb: if removing the effect would not cause a visual flicker, it does
not need to be a layout effect.

## The SSR warning

> useLayoutEffect does nothing on the server

There is no DOM and no paint during server rendering, so it cannot run. That
means markup rendered on the server will not include its result, and hydration
may mismatch.

The standard workaround:

```js
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
```

Most UI libraries ship exactly this. It silences the warning by using the
appropriate hook per environment — it does not magically make measurement work
on the server, so components that depend on measurement must still render a
sensible default first.

## Cleanup ordering is identical

Both run their cleanup before the next invocation, and on unmount. The only
difference is timing relative to paint — the dependency-array semantics,
cleanup rules and stale-closure hazards are exactly the same.

## Related: useInsertionEffect

Runs even earlier — **before** DOM mutations — and exists specifically for
CSS-in-JS libraries injecting `<style>` tags, so that styles exist before layout
is calculated. Application code should essentially never need it. Knowing it
exists (and that it is library-only) is a good signal.

## How to answer this out loud

"`useLayoutEffect` runs synchronously after the DOM updates but before the
browser paints, so it's for cases where the user must not see an intermediate
state — measuring an element and positioning something based on it. `useEffect`
runs after paint and is the default, because layout effects block the frame. The
practical tell is flicker: if you see content jump on mount, it's usually an
effect that should have been a layout effect."

## Follow-ups to expect

- *Does it hurt performance?* Yes if you do slow work in it — it delays paint.
- *Why the SSR warning?* No DOM, no paint; use the isomorphic wrapper.
- *What about refs?* Refs are attached before both hooks run, so both can read
  `ref.current`.
