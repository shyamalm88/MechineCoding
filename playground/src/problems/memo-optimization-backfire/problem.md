# React.memo, useMemo, and when optimization backfires

## Memoisation is not free

Every `useMemo`/`useCallback` costs: storing the value, storing the dependency
array, and comparing that array on **every** render. `React.memo` costs a
shallow prop comparison on every render.

For cheap work, the bookkeeping exceeds the saving.

```js
const total = useMemo(() => a + b, [a, b])   // slower than just: a + b
```

## The most common failure: memo that never hits

```js
const Row = React.memo(RowImpl)

<Row item={item} style={{ margin: 4 }} onSelect={() => pick(item)} />
```

The object literal and arrow function are fresh references every render, so the
shallow compare always fails. You pay for the comparison and get nothing.
`React.memo` only works when **every** prop is referentially stable.

## When memoisation genuinely pays

- The computation is actually expensive (sorting/filtering thousands of items).
- The value feeds a dependency array where identity changes cause cascading work.
- A memoised child subtree is large and re-renders often.

## Measure, don't guess

React DevTools Profiler shows which components re-render and how long each
commit takes. "This felt slow" is not evidence; a flame graph is. Frequently the
real cause is something else entirely — an unstable context value, an unkeyed
list, or rendering 5,000 rows that should be virtualised.

## Looking ahead

The React Compiler automates this analysis, memoising precisely where it helps.
The lesson survives it: **premature memoisation adds cost and noise**, and the
first move is always to profile.
