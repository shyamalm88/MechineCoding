# Suspense and React.lazy code splitting

```js
const Settings = lazy(() => import('./Settings'))

<Suspense fallback={<Skeleton />}>
  <Settings />
</Suspense>
```

`lazy` turns a dynamic `import()` into a component; the bundler emits a separate
chunk, fetched on first render. `Suspense` renders the fallback while it loads.

## How Suspense actually works

A suspending component **throws a promise**. The nearest `Suspense` boundary
catches it, renders the fallback, and retries when the promise resolves. That is
why it composes with error boundaries — both are catch mechanisms, one for
promises, one for errors.

## Boundary placement is a UX decision

One boundary around a whole page means the entire page flashes a skeleton. Many
small boundaries let already-loaded regions stay visible. Too many produces a
"popcorn" effect of independently resolving spinners.

Route-level boundaries plus one around genuinely heavy independent widgets is
the usual balance.

## Traps

- **`lazy` must be called outside the component.** Declaring it inside means a
  new component type every render → remount and refetch every time.
- A failed chunk load (deploy happened, old hashed chunk is gone) throws — pair
  Suspense with an error boundary offering a reload.
- `Suspense` does **not** make data fetching work by itself. It needs a
  Suspense-enabled source (React Query, Relay, RSC, or `use()`); wrapping a
  plain `useEffect` fetch in it does nothing.
- Transitions avoid hiding already-visible content: with `startTransition`,
  React keeps the old UI instead of replacing it with the fallback.
