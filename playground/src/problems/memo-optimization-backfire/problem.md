# React.memo, useMemo, and when optimization backfires

## The short answer

Memoisation is **not free**. Every `useMemo`/`useCallback` costs a dependency-
array comparison on every render plus retained memory; every `React.memo` costs
a shallow prop comparison on every render.

When the work you skip is cheaper than the bookkeeping, you have made the app
slower and the code harder to read.

## The three ways it backfires

### 1. Memoising something trivial

```js
const total = useMemo(() => price * quantity, [price, quantity])
```

The multiplication is one CPU instruction. The memo allocates an array,
compares two values, and retains a closure — strictly more work, every render.

### 2. Memo that never hits

The most common failure, and the reason so much `React.memo` in real codebases
does nothing:

```jsx
const Row = React.memo(RowImpl)

<Row
  item={item}
  style={{ margin: 4 }}              // new object each render
  onSelect={() => pick(item.id)}     // new function each render
/>
```

The shallow compare fails every time. You pay for the comparison and skip
nothing. **`React.memo` only works if *every* prop is referentially stable** —
it is all-or-nothing.

### 3. Memoising around a changing value

```jsx
const value = useMemo(() => ({ user, theme }), [user, theme])
```

If `user` is itself recreated by its parent each render, the memo never hits and
you have added a layer of indirection that hides the real problem one level up.

## When memoisation genuinely pays

- The computation is **actually expensive** — sorting/filtering thousands of
  items, parsing, building a large Map.
- The value feeds a **dependency array** where identity changes cause cascading
  effects or refetches.
- A **large memoised subtree** re-renders often because of an unrelated parent
  update.

## Measure, don't guess

"This felt slow" is not evidence. The React DevTools **Profiler** shows which
components re-rendered, why, and how long each commit took.

Very often the flame graph reveals the real cause is something else entirely:

- an **unstable context value** re-rendering every consumer
- an **unkeyed list** remounting rows
- **10,000 rows** that should be virtualised
- state living too high in the tree, so unrelated updates cascade

Adding `memo` to a component whose parent re-renders for one of those reasons
treats the symptom, not the cause.

## The cheaper fix people forget

Composition often beats memoisation entirely. An element passed as `children` is
created by the *parent*, so its reference is stable when the intermediate
component re-renders:

```jsx
function Layout({ children }) {
  const [open, setOpen] = useState(false)   // toggling does NOT re-render children
  return <aside>{children}</aside>
}
```

No `memo`, no `useCallback`, no dependency arrays — and it is more readable.

## The order to work in

1. **Profile** and find what actually re-renders and why.
2. **Restructure** — move state down, lift content into `children`, split
   context.
3. **Reduce work** — virtualise long lists, fix O(n²) logic.
4. **Only then memoise**, and verify with the profiler that it helped.

## How to answer this out loud

"Memoisation trades memory and a per-render comparison for skipped work, so it
only wins when the skipped work is genuinely expensive. The most common failure
I see is `React.memo` with an inline object or arrow function prop — the shallow
compare fails every render, so you pay the cost and skip nothing. Before
memoising I'd profile, because the real cause is often an unstable context value
or an unkeyed list, and composition with `children` frequently fixes it without
any memo at all."

## Follow-ups to expect

- *Does the React Compiler remove the need for this?* Largely — but knowing why
  identity matters is what lets you reason about where it bails out (mutation,
  impure render).
- *Is `useMemo` guaranteed?* No; React may discard the cache, so never depend on
  it for correctness.
- *How do you memoise a list?* Stable item references plus `memo` on the row —
  or virtualise, which is usually the bigger win.
