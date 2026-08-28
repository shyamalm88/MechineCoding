# Context API performance pitfalls

## The short answer

**Every component consuming a context re-renders when that context's value
changes** — and `React.memo` cannot stop it, because context is not a prop.

That is fine for a theme that changes twice a session. It is a problem for state
that changes on every keystroke with 200 consumers.

## Pitfall 1: a new object on every render

```jsx
// ✗ the value is a NEW object identity each time the provider renders
<UserContext.Provider value={{ user, setUser }}>
```

React compares the context value with `Object.is`. A fresh object literal is
never equal to the previous one, so **every consumer re-renders whenever the
provider's parent re-renders** — even if `user` never changed.

```jsx
// ✓ stable identity
const value = useMemo(() => ({ user, setUser }), [user])
<UserContext.Provider value={value}>
```

This one line is the single most impactful context fix, and it is missing from a
lot of real code.

## Pitfall 2: one context holding unrelated state

```jsx
<AppContext.Provider value={{ theme, user, cart }}>
```

Toggling the theme now re-renders every component that only cares about the
cart. Split by **how often each value changes**:

```jsx
<ThemeContext.Provider>      {/* changes rarely */}
  <UserContext.Provider>     {/* changes occasionally */}
    <CartContext.Provider>   {/* changes constantly */}
```

Consumers subscribe to only what they need, so a cart update no longer disturbs
the theme consumers.

## Pitfall 3: mixing state and dispatch

`dispatch` from `useReducer` is **stable forever**; state changes constantly. A
component that only dispatches — a button — has no reason to re-render when
state changes.

```jsx
<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>   {/* never changes */}
```

Now the "Add to cart" button never re-renders on cart updates, while the cart
badge does. This is a standard and very effective pattern.

## Why Context is not a state manager

Context is a **dependency-injection mechanism** — a way to pass a value down
without threading props. It deliberately has **no selector support**: you cannot
subscribe to one field of the value.

```jsx
const { theme } = useContext(AppContext)   // re-renders on ANY change to the value
```

A real store lets each component subscribe to a slice:

```js
const theme = useStore(s => s.theme)       // re-renders only when theme changes
```

That is the fundamental capability Context lacks, and why Zustand/Redux
Toolkit/Jotai still exist alongside it.

## Choosing

| Value | Fits Context? |
|---|---|
| Theme, locale, feature flags | ✓ ideal |
| Authenticated user | ✓ |
| Form state, cart, live data | ✗ use a store with selectors |
| Anything changing many times per second | ✗ |

## The composition escape hatch

Before reaching for Context at all, check whether the prop drilling is real. Two
or three levels is usually better solved by passing the element instead of the
data:

```jsx
<Layout sidebar={<Sidebar user={user} />} />
```

`Layout` never sees `user`, and the drilling disappears — no context, no
re-render fan-out.

## How to answer this out loud

"Every consumer re-renders when the context value changes, and memo can't stop
it. The three fixes I'd apply are: memoise the provider value so it isn't a new
object each render, split contexts by update frequency so unrelated state
doesn't fan out, and separate state from dispatch since dispatch is stable. And
I'd be clear that Context is dependency injection, not a state manager — it has
no selectors, so for high-frequency state with many consumers I'd use a store."

## Follow-ups to expect

- *Does `React.memo` help a consumer?* No — memo compares props; context bypasses
  props entirely.
- *What is `useContextSelector`?* A proposed/userland API adding selector
  support; libraries emulate it with subscriptions.
- *How would you profile this?* DevTools Profiler shows "why did this render" —
  context changes are listed explicitly.
