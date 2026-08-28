# Custom hooks — design patterns and rules

## The short answer

A custom hook is **any function starting with `use` that calls other hooks**.
It exists to share *stateful logic* between components — not state itself.

```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn(o => !o), [])
  return [on, toggle]
}
```

Two components calling `useToggle()` get **two completely independent states**.
That is the key distinction from context or a store, and it is a common
misunderstanding.

## The rules, and why they exist

1. **Only call hooks at the top level** — never inside conditions, loops or
   nested functions.
2. **Only call them from React functions** — components or other hooks.

The reason is that React identifies hooks **by call order**, not by name. Each
component holds an ordered list of state cells, and a cursor that resets before
every render:

```
render 1:  useState → cell[0]   useEffect → cell[1]   useMemo → cell[2]
render 2:  useState → cell[0]   useEffect → cell[1]   useMemo → cell[2]
```

Put a hook behind an `if` and the indices shift on the render where the
condition flips:

```jsx
if (isLoggedIn) useState(user)   // ✗ present sometimes
useState(theme)                  // now reads the WRONG cell
```

Hence the runtime error *"Rendered fewer hooks than expected"*. It is not
arbitrary strictness — it falls directly out of the array-and-cursor design.

## Patterns worth knowing

**Return a tuple when order is natural, an object when there are many values:**

```js
const [isOpen, toggle] = useToggle()              // tuple: caller names them
const { data, error, isLoading } = useFetch(url)  // object: self-documenting
```

Tuples let the caller rename freely (`const [isModalOpen, toggleModal]`), which
is why `useState` uses one. Objects are better past two or three values.

**Common shapes:** `useDebounce`, `useLocalStorage`, `usePrevious`,
`useMediaQuery`, `useIntersectionObserver`, `useOnClickOutside`.

## Making them safe

**Always clean up.** A hook used by 20 components leaks 20 times:

```js
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)      // ← not optional
}, [])
```

**Abort in-flight requests**, so a resolved fetch cannot set state after the
consumer unmounted or the input changed.

**Keep returned identities stable** with `useCallback`/`useMemo` — otherwise
every consumer's dependency arrays change on every render, which quietly
defeats their memoisation:

```js
return { data, refetch }                              // ✗ new object each render
return useMemo(() => ({ data, refetch }), [data, refetch])   // ✓
```

## Worked example

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)     // cancels the previous timer on each change
  }, [value, delay])

  return debounced
}
```

The cleanup is what makes it a debounce: each new `value` cancels the pending
timer, so only the final value after the pause survives.

## Traps

- **`use` is not decorative.** The linter relies on the prefix to enforce the
  rules. Naming a hook `getUser()` disables that checking; naming a plain
  function `useThing()` produces spurious warnings.
- **Extracting for its own sake.** A "custom hook" that wraps one `useState` and
  is used once is indirection, not abstraction.
- **Hidden coupling.** A hook that reads context makes every consumer depend on
  that provider existing — document it.

## How to answer this out loud

"A custom hook is a function starting with `use` that calls other hooks, and it
shares stateful *logic*, not state — each caller gets its own instance. The
rules about call order exist because React tracks hooks positionally with a
cursor that resets each render, so a conditional hook shifts every later index.
The things I'd stress in a review are cleanup, aborting in-flight work, and
returning stable identities so consumers' dependency arrays don't change every
render."

## Follow-ups to expect

- *How do you test one?* `renderHook` from Testing Library, or a tiny host
  component.
- *Can a hook be async?* No — hooks run during render. It can *start* async work
  in an effect and expose the state.
- *How do you share state rather than logic?* Context or a store; a hook alone
  gives each caller its own.
