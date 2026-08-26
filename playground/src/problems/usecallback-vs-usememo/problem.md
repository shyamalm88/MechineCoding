# Difference between useCallback and useMemo

## The mechanical difference

```js
useMemo(() => computeValue(a, b), [a, b])   // memoises the RESULT
useCallback(fn, [a, b])                      // memoises the FUNCTION
```

They are the same primitive:

```js
useCallback(fn, deps) === useMemo(() => fn, deps)
```

`useCallback` exists purely as sugar for the very common case of memoising a
function identity.

## What they are actually for

Both exist to preserve **referential identity** across renders — not to make
computation faster. A new function or object literal every render is a *new
reference*, which breaks:

- `React.memo` on a child (props compare unequal → it re-renders anyway)
- `useEffect` dependency arrays (effect re-runs every render)
- `useMemo` in a descendant that depends on the value

## When they are pointless

```js
const handleClick = useCallback(() => setOpen(true), [])   // child isn't memoised
<button onClick={handleClick}>                              // DOM element -- no benefit
```

Passing a memoised callback to a plain DOM element buys nothing: `<button>` does
not re-render based on prop identity. And memoising has a real cost — the
dependency array is compared every render, and the closure is retained.

The rule: memoise when the identity is **consumed** by something that compares
it. Otherwise it is noise that makes the code harder to read.

## Note on the React Compiler

The React Compiler auto-memoises, which will make most manual `useMemo`/
`useCallback` unnecessary. Knowing *why* they existed still matters — it is what
the compiler is automating.
