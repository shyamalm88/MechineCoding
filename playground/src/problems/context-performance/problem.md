# Context API performance pitfalls

## The core problem

**Every consumer re-renders when the context value changes** — `React.memo`
cannot stop it, because context is not a prop.

## Pitfall 1: a new object every render

```js
// ✗ new object identity on every provider render
<Ctx.Provider value={{ user, setUser }}>

// ✓ stable identity
const value = useMemo(() => ({ user, setUser }), [user])
<Ctx.Provider value={value}>
```

Without the memo, *every* consumer re-renders whenever the provider's parent
re-renders — even if `user` never changed.

## Pitfall 2: one context holding unrelated state

A context carrying `{ theme, user, cart }` re-renders cart consumers when the
theme toggles. **Split by update frequency**:

```js
<ThemeCtx.Provider>      {/* changes rarely */}
  <UserCtx.Provider>     {/* changes occasionally */}
    <CartCtx.Provider>   {/* changes constantly */}
```

## Pitfall 3: mixing state and dispatch

`dispatch` is stable forever; state changes constantly. Components that only
dispatch (a button) should not re-render when state changes. Use two contexts —
`StateContext` and `DispatchContext` — and consumers subscribe to only what they
need.

## When Context is the wrong tool

Context is a **dependency-injection mechanism**, not a state manager. It has no
selector support: you cannot subscribe to one field of the value. For
high-frequency state with many consumers, a store with selectors (Zustand,
Redux Toolkit, Jotai) lets each component re-render only when its slice changes.

Rule of thumb: Context is great for theme, locale, auth user, and feature flags.
It is a poor fit for anything updating many times per second.
