# Stale closures — the defining hooks bug

```js
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000)  // always logs 0
  return () => clearInterval(id)
}, [])
```

The interval logs `0` forever, no matter how high `count` climbs.

## Why

Every render creates **new** `count`, `props`, and handler functions. A closure
captures the variables **from the render that created it**. With `[]`, the
effect runs once, so its closure is permanently bound to the *first* render's
`count`.

This is not a React quirk — it is exactly how JavaScript closures work. React
just makes it easy to hit, because "the component re-ran" feels like "my
function got the new value", and it did not.

## The four fixes

**1. Correct dependencies** — re-create the closure when the value changes:

```js
useEffect(() => { ... }, [count])
```

Correct, but it tears down and re-creates the interval every second.

**2. Functional updater** — never read the old value at all:

```js
setCount(c => c + 1)   // React hands you the current value
```

The best fix when you only need to *update* based on the previous value.

**3. A ref as a mutable box:**

```js
const countRef = useRef(count)
countRef.current = count           // updated every render
setInterval(() => console.log(countRef.current), 1000)
```

Refs are the same object across renders, so `.current` is always current. Right
when you must *read* fresh state from a long-lived callback.

**4. `useEffectEvent`** (React's experimental answer) — an "event function" that
always sees the latest props/state without being a dependency.

## Where it bites in real code

- `setInterval` / `setTimeout` inside an effect
- Event listeners registered once with `[]`
- Debounced or throttled callbacks holding old state
- `useCallback(fn, [])` passed to a memoised child
- WebSocket / subscription handlers

## The trap behind the trap

Suppressing the lint rule with `// eslint-disable-next-line react-hooks/exhaustive-deps`
does not fix the bug — it hides the warning that was telling you about it. If
the dependency genuinely should not re-trigger the effect, a ref or
`useEffectEvent` is the honest fix.

## Worked example: the debounced save that never sees your edits

```jsx
const save = useCallback(
  debounce(() => api.save(text), 500),   // captures `text` from THIS render
  [],                                    // created once, frozen forever
)
```

The user types "hello", waits, and the app saves `""` — the value from the first
render. It looks like the save is broken; in fact the closure is doing exactly
what it was told.

## How to answer this out loud

"A stale closure is when a function captures props or state from the render that
created it and keeps seeing those old values. The classic case is an effect with
an empty dependency array setting up an interval — it logs the initial count
forever. It's not a React quirk, it's how JavaScript closures work; React just
makes it easy to hit because 're-rendered' feels like 'my callback got the new
value'. The fixes are correct dependencies, a functional updater if you only
need to *update*, or a ref as a mutable box if you need to *read* fresh state
from a long-lived callback."

## Follow-ups to expect

- *Why not just disable the lint rule?* It is reporting the bug, not causing it.
- *When is a ref the right fix?* When re-creating the effect would be wasteful or
  destructive — tearing down a WebSocket every second, for instance.
- *What is `useEffectEvent`?* React's experimental answer: a function that always
  sees the latest values without being a dependency.
