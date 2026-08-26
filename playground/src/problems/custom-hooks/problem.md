# Custom hooks — design patterns and rules

## The rules, and why they exist

1. **Only call hooks at the top level** — never in conditions, loops, or nested
   functions.
2. **Only call them from React functions** — components or other hooks.

The reason is that React identifies hooks **by call order**, not by name. Each
component holds an ordered list of hook state cells; on re-render React walks
them in the same sequence. A conditional hook shifts every subsequent index, so
`useState` returns another hook's state — hence the "Rendered fewer hooks than
expected" error.

## What a custom hook actually is

Any function starting with `use` that calls other hooks. It shares **stateful
logic**, not state — two components calling `useToggle()` get two completely
independent states. This is the key difference from a context or a store.

## Patterns worth knowing

```js
// Return a tuple when order is natural, an object when there are many values
const [isOpen, toggle] = useToggle()
const { data, error, isLoading } = useFetch(url)
```

Common shapes: `useToggle`, `useDebounce`, `useLocalStorage`,
`usePrevious`, `useIntersectionObserver`, `useMediaQuery`.

## Making them safe

- **Always clean up.** Timers, listeners, observers, and subscriptions returned
  from the hook must be torn down, or every consumer leaks.
- **Abort in-flight requests** so a resolved fetch cannot set state after
  unmount.
- **Keep returned identities stable** with `useCallback`/`useMemo`, otherwise
  every consumer's dependency arrays change each render.

## Trap

`use` is not decorative — the linter relies on the prefix to enforce the rules.
Naming a hook `getUser()` disables that checking; naming a plain function
`useThing()` produces spurious warnings.
