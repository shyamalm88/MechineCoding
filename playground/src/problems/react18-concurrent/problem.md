# React 18 concurrent features — useTransition and useDeferredValue

## The short answer

Both let you mark work as **non-urgent**, so React can interrupt it to keep the
UI responsive. They differ only in *what you have access to*:

- **`useTransition`** — you own the `setState` call, so you can wrap it.
- **`useDeferredValue`** — you only have a value (usually a prop), so you defer
  the value instead.

## The problem: typing feels laggy

```jsx
function Search() {
  const [query, setQuery] = useState('')
  const results = filterHugeList(query)     // 200ms of work
  return <><input value={query} onChange={e => setQuery(e.target.value)} /> …</>
}
```

Every keystroke triggers a 200ms render. The input cannot repaint until that
render finishes, so typing visibly stutters — even though the *input* is cheap
and only the results list is expensive.

The insight: these are **two different priorities** sharing one render. Showing
the typed character is urgent. Updating the results is not.

## useTransition

```jsx
const [isPending, startTransition] = useTransition()

function onChange(e) {
  setQuery(e.target.value)                                    // urgent
  startTransition(() => setResults(filter(e.target.value)))   // non-urgent
}
```

React renders the urgent update immediately, then works on the transition. If
another keystroke arrives mid-render, React **throws the in-progress work away**
and restarts with the newer input — so you never queue up five stale renders.

`isPending` is free loading state for a spinner or dimmed list.

## useDeferredValue

When the value arrives as a prop you cannot wrap the setter:

```jsx
function Results({ query }) {            // query is a prop; no setState here
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => filter(deferredQuery), [deferredQuery])
  return <List items={results} />
}
```

React keeps rendering with the **previous** value while it prepares the new one
in the background. You can detect the lag and dim the stale content:

```jsx
const isStale = query !== deferredQuery
<div style={{ opacity: isStale ? 0.6 : 1 }}>
```

## What they do NOT do

**They do not make anything faster.** The filtering costs exactly the same. What
changes is *scheduling* — the expensive render becomes interruptible, so the
main thread stays free to paint keystrokes.

If your render is slow because of an O(n²) algorithm or 10,000 unvirtualised
rows, these hooks will not save you. Fix the algorithm or virtualise the list;
transitions are for work that is legitimately expensive.

They are also **not for data fetching** — that is Suspense's job. Marking a fetch
as a transition does not make it load sooner.

## The cost of useDeferredValue

The component renders **twice** — once with the old value, once with the new.
The render itself must therefore be cheap or memoised, or you have doubled the
work you were trying to schedule around. That is why the `useMemo` in the
example is not optional.

## Choosing

| You have | Use |
|---|---|
| The `setState` call | `useTransition` |
| Only a value / prop | `useDeferredValue` |
| Need a pending flag | `useTransition` (`isPending`) |
| Want to show stale-but-visible content | `useDeferredValue` |

## How to answer this out loud

"Both mark work as non-urgent so React can interrupt it and keep input
responsive. `useTransition` wraps the state update itself and gives you an
`isPending` flag; `useDeferredValue` is for when you only receive a value as a
prop — React keeps rendering the old one until the new render is ready. The key
point is they don't make the work faster, they change its priority, so they're
the wrong tool if the render is slow for algorithmic reasons."

## Follow-ups to expect

- *How is this different from debouncing?* Debounce delays *starting* the work
  by a fixed time. Transitions start immediately but yield to urgent updates, so
  results appear sooner and never lag behind the input.
- *What made this possible?* Fiber — rendering had to become interruptible.
- *Does it work with Suspense?* Yes: inside a transition, React keeps showing
  the old UI instead of replacing it with a fallback.
