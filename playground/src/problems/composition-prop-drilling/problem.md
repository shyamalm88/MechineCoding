# Composition as the answer to prop drilling

Most people jump straight from prop drilling to Context. There is a step in
between that is usually the right one.

## The problem

```jsx
<Page user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Avatar user={user} />
```

`Layout` and `Sidebar` do not use `user`. They are couriers.

## Fix 1: pass the element, not the data

```jsx
<Page>
  <Layout sidebar={<Sidebar><Avatar user={user} /></Sidebar>}>
```

`Layout` now receives an already-rendered node as `children` (or any prop) and
does not know or care what is inside. The drilling disappears because the JSX is
created **where the data already lives**.

This is "components as slots", and it is the same idea as `children` — a prop
that happens to hold JSX.

## The performance side effect

An element passed as `children` is created by the **parent**. When the
intermediate component re-renders, that element object is the *same reference*,
so React bails out of re-rendering the subtree:

```jsx
function Layout({ children }) {
  const [open, setOpen] = useState(false)   // toggling this does NOT re-render children
  return <div>{children}</div>
}
```

That is a genuinely useful optimisation with no `memo` anywhere — and a strong
answer when asked "how do you stop a subtree re-rendering?"

## Fix 2: Context — and when it is actually right

Context suits values that are **broadly needed and rarely change**: theme,
locale, the authenticated user, feature flags.

It is a poor fit for frequently-changing state with many consumers, because
every consumer re-renders and there is no selector support. See the Context
Performance Pitfalls problem.

## Choosing

| Depth | Approach |
|---|---|
| 1–2 levels | Just pass the prop |
| A few levels, one branch | **Composition / slots** |
| Broad + rarely changes | Context |
| Broad + changes often | A store with selectors (Zustand, Redux, Jotai) |

## The compound-component pattern

The polished version of composition, where related components share implicit
state through a private context:

```jsx
<Tabs defaultValue="a">
  <Tabs.List><Tabs.Trigger value="a">One</Tabs.Trigger></Tabs.List>
  <Tabs.Panel value="a">…</Tabs.Panel>
</Tabs>
```

The consumer controls structure and styling; the library owns state and
accessibility. This is how Radix, Headless UI and Reach are built, and it is the
strongest answer to "how would you design a reusable component API?".
