# Suspense and React.lazy code splitting

## The short answer

`React.lazy` turns a dynamic `import()` into a component, so its code ships as a
**separate bundle** loaded on first render. `<Suspense>` shows a fallback while
that load (or any other suspending work) is in flight.

```jsx
const Settings = lazy(() => import('./Settings'))

<Suspense fallback={<Skeleton />}>
  <Settings />
</Suspense>
```

The user downloads the settings page only if they actually open it.

## How Suspense works under the hood

A suspending component **throws a promise**. The nearest `<Suspense>` boundary
catches it, renders the fallback, and retries the subtree when the promise
resolves.

That is why it composes naturally with error boundaries — both are catch
mechanisms walking up the tree, one for promises and one for errors. It is also
why you cannot "await" in a normal component: throwing is the signalling
mechanism.

## Boundary placement is a UX decision

This is the part that separates a real answer from a definition.

```jsx
// one boundary: the whole page flashes a skeleton
<Suspense fallback={<PageSkeleton />}>
  <Header /><Feed /><Sidebar />
</Suspense>

// granular: each region resolves independently
<Header />
<Suspense fallback={<FeedSkeleton />}><Feed /></Suspense>
<Suspense fallback={<SidebarSkeleton />}><Sidebar /></Suspense>
```

Too coarse and you hide content that was ready. Too granular and you get a
"popcorn" effect of things appearing at random moments, which feels worse than a
single clean load.

A common balance: **one boundary per route, plus one around each genuinely heavy
independent widget.**

## The mistake that breaks everything

```jsx
function Page() {
  const Settings = lazy(() => import('./Settings'))   // ✗ INSIDE the component
  return <Suspense …><Settings /></Suspense>
}
```

`lazy()` called during render creates a **new component type every render**.
React sees a different type, unmounts the old one, and remounts — so it
refetches the chunk and loses all state, forever. Always call `lazy` at module
scope.

## Suspense does not make data fetching work

A very common misconception:

```jsx
<Suspense fallback={<Spinner />}>
  <ComponentThatUsesUseEffectFetch />   {/* ✗ never suspends */}
</Suspense>
```

`useEffect` + `setState` does not throw a promise, so Suspense has nothing to
catch and the fallback never shows. Suspense needs a **Suspense-enabled source**:
React Query/SWR in suspense mode, Relay, RSC, or the `use()` hook.

## Handling a failed chunk

Chunk loading can fail — most often because you deployed while the user's tab
was open, so the hashed file they are asking for no longer exists. That throws,
and needs an error boundary:

```jsx
<ErrorBoundary fallback={<button onClick={() => location.reload()}>Reload</button>}>
  <Suspense fallback={<Skeleton />}>
    <Settings />
  </Suspense>
</ErrorBoundary>
```

Ignoring this is a real production failure mode, not a theoretical one.

## Transitions avoid hiding visible content

If a route already shows content and you navigate, Suspense would normally
replace it with the fallback — a visible regression. Wrapping the navigation in
`startTransition` tells React to **keep the old UI** until the new one is ready:

```jsx
startTransition(() => navigate('/settings'))
```

## How to answer this out loud

"`React.lazy` wraps a dynamic import so the component ships in its own chunk,
and Suspense renders a fallback while it loads — mechanically, a suspending
component throws a promise that the nearest boundary catches. The interesting
part is boundary placement: one boundary per page flashes everything, too many
gives a popcorn effect. And Suspense doesn't magically make `useEffect` fetching
suspend — it needs a suspense-enabled data source."

## Follow-ups to expect

- *Where do you code-split?* Routes first, then heavy independent widgets —
  charts, editors, maps.
- *How do you avoid a flash for fast loads?* Delay showing the fallback, or use
  a transition so existing content stays.
- *What about SSR?* Suspense supports streaming server rendering — the shell is
  sent immediately and boundaries stream in.
