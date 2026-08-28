# Difference between useCallback and useMemo

## The short answer

```js
useMemo(() => computeValue(a, b), [a, b])   // memoises the RESULT of calling it
useCallback(fn, [a, b])                      // memoises the FUNCTION itself
```

They are the same primitive. `useCallback` is literally sugar:

```js
useCallback(fn, deps)  ===  useMemo(() => fn, deps)
```

`useMemo` calls your function and caches what it returns. `useCallback` caches
the function without calling it.

## What they are actually for

Not "making things faster". They exist to preserve **referential identity**
across renders.

Every render creates new objects and functions:

```jsx
function Parent() {
  const handleClick = () => doThing()      // NEW function every render
  const config = { mode: 'dark' }          // NEW object every render
  return <Child onClick={handleClick} config={config} />
}
```

`handleClick` does the same thing each time, but it is a **different reference**.
That matters to anything that compares references:

- `React.memo` on the child — props compare unequal, so it re-renders anyway
- a `useEffect` dependency array — the effect re-runs every render
- a `useMemo` downstream that depends on the value

## Worked example: the effect that never stops

```jsx
function Search({ onResults }) {
  useEffect(() => {
    fetchResults().then(onResults)
  }, [onResults])          // onResults is a new function every parent render
}
```

Parent re-renders → new `onResults` → dependency changed → effect re-runs →
sets state → parent re-renders → … an infinite fetch loop.

`useCallback` in the parent fixes it by making the reference stable.

## When they are pointless

```jsx
const handleClick = useCallback(() => setOpen(true), [])
return <button onClick={handleClick}>Open</button>
```

`<button>` is a DOM element. It does not re-render based on prop identity, so
this buys **nothing** — and costs a dependency-array comparison on every render
plus a retained closure.

Same for cheap values:

```js
const total = useMemo(() => a + b, [a, b])   // slower than just: a + b
```

The memo bookkeeping exceeds the addition.

**The rule: memoise when the identity is *consumed* by something that compares
it.** Otherwise it is noise that makes the code harder to read.

## The trap: partial memoisation

```jsx
const handleClick = useCallback(() => select(id), [id])
<Row onClick={handleClick} style={{ margin: 4 }} />   // ✗ style is still new
```

`React.memo` does a shallow compare of **all** props. One unstable prop and the
comparison fails, so the `useCallback` achieved nothing. Memoisation is
all-or-nothing per component.

## Dependency arrays must be honest

```jsx
const search = useCallback(() => fetch(query), [])   // ✗ query is missing
```

The closure captures the first render's `query` forever — a stale closure. The
exhaustive-deps lint rule exists to catch exactly this; silencing it is how
memoisation turns into a bug rather than an optimisation.

## The React Compiler

The React Compiler auto-memoises, which will make most manual `useMemo` and
`useCallback` unnecessary. That does **not** make the concept obsolete for
interviews — understanding *why* referential identity matters is precisely what
the compiler automates, and you still need it to reason about what it is doing
and where it bails out.

## How to answer this out loud

"They're the same mechanism — `useCallback(fn, deps)` is `useMemo(() => fn,
deps)`. `useMemo` caches a computed value, `useCallback` caches a function
reference. Neither is really about speed; they're about referential stability,
so that `React.memo` can skip a render or an effect's dependency array doesn't
change every time. The mistake is memoising by default: if nothing compares the
identity, you've added cost and noise for nothing."

## Follow-ups to expect

- *When is `useMemo` about performance?* When the computation itself is
  genuinely expensive — sorting thousands of rows, not adding two numbers.
- *Is `useMemo` a guarantee?* No — React may discard the cache. Never rely on it
  for correctness, only optimisation.
- *How do you decide?* Profile. React DevTools shows which components re-render
  and why.
