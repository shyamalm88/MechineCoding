# React 19: use(), Actions, useOptimistic

> Reflects React 19 as released. APIs in this space have moved quickly — verify
> against the current docs before relying on details.

## `use()` — read a promise or context conditionally

```js
const data = use(fetchPromise)      // suspends until it resolves
const theme = use(ThemeContext)     // like useContext...
```

The rule-breaker: **`use()` may be called conditionally and inside loops**,
unlike every other hook. It is not a hook in the call-order sense.

The trap: the promise must be **created outside render** (or cached), or every
render makes a new one and it never settles — an infinite suspense loop. In
practice the promise comes from a framework/cache, not from calling `fetch()`
inline.

## Actions

An async function passed to `<form action={...}>`. React manages pending state,
errors, and sequencing for you.

```jsx
<form action={async (formData) => { await save(formData.get('name')) }}>
```

Supporting hooks:

- **`useActionState(fn, initial)`** → `[state, action, isPending]` — the result
  and pending flag of the last invocation.
- **`useFormStatus()`** — read the parent form's pending state from a *child*
  (e.g. a submit button) without prop drilling. Must be inside the `<form>`.

## `useOptimistic`

```js
const [optimisticTodos, addOptimistic] = useOptimistic(todos, (state, next) => [...state, next])
```

Show the result immediately, and React automatically **reverts** if the action
fails or when the real data arrives. Previously this meant hand-rolled rollback
logic.

## Smaller changes that matter

- **`ref` is a regular prop** for function components — `forwardRef` is no longer
  needed for the common case.
- **Ref callbacks may return a cleanup function.**
- **Document metadata** (`<title>`, `<meta>`, `<link>`) can be rendered anywhere
  and React hoists it into `<head>` — no more Helmet for simple cases.
- **`<Context>` as a provider** — `<ThemeContext value={x}>` instead of
  `<ThemeContext.Provider value={x}>`.
- **Improved hydration error messages**, showing a diff rather than a bare
  warning.
- `useDeferredValue` accepts an initial value.

## The React Compiler

Shipping separately from 19. It auto-memoises, so most manual `useMemo`,
`useCallback` and `React.memo` become unnecessary — the compiler infers where
memoisation is safe and beneficial.

The interview point: it does **not** make the underlying concepts obsolete.
Understanding *why* referential identity matters is what lets you reason about
what the compiler is doing, and recognise the cases (mutation, impure render)
where it must bail out.

## How to answer this out loud

"The headline additions are `use()`, Actions, and `useOptimistic`. `use()` reads
a promise or context and can be called conditionally, which no other hook can —
the trap is that the promise must be created outside render or it never settles.
Actions let you pass an async function to a form's `action` and React manages
pending state and errors, with `useActionState` for the result and
`useFormStatus` so a child submit button can read the parent form's state.
`useOptimistic` shows the change immediately and reverts automatically on
failure. Beyond that, `ref` is a normal prop so `forwardRef` isn't needed, ref
callbacks can return cleanups, and document metadata hoists into `<head>`."

## Follow-ups to expect

- *What does the React Compiler change?* It auto-memoises, so most manual
  `useMemo`/`useCallback` become unnecessary — but understanding referential
  identity is exactly what it automates.
- *Why can `use()` be conditional?* It is not tracked by the call-order
  mechanism the other hooks rely on.
- *Is `useFormStatus` usable anywhere?* No — it must be inside the `<form>` whose
  status it reads.
