# Error boundaries — implementation and limitations

## The short answer

An error boundary is a component that **catches errors thrown while rendering
its children** and shows a fallback instead of letting the whole app crash.

Without one, an uncaught render error **unmounts your entire React tree** —
React 16+ deliberately chose a blank page over a silently corrupted UI.

## Implementation

Error boundaries are **class components only**. There is still no hook
equivalent, because the mechanism relies on lifecycle methods React calls during
its own render and commit phases.

```jsx
class ErrorBoundary extends React.Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }                     // render phase: compute fallback UI
  }

  componentDidCatch(error, info) {
    logToService(error, info.componentStack)   // commit phase: side effects
  }

  render() {
    if (this.state.error) {
      return <Fallback error={this.state.error}
                       onRetry={() => this.setState({ error: null })} />
    }
    return this.props.children
  }
}
```

**Why two methods?** They run in different phases.
`getDerivedStateFromError` runs during render and must be pure — no logging, no
fetching. `componentDidCatch` runs after commit, where side effects are allowed.
That is where your error reporting goes.

## What they do NOT catch

This list is the actual interview content:

| Not caught | Use instead |
|---|---|
| **Event handlers** | `try/catch` inside the handler |
| **Async code** (`setTimeout`, promises) | `.catch()` / `try/catch` in the async fn |
| **Server-side rendering** | framework-level error handling |
| **Errors in the boundary itself** | a boundary further up |

The common thread: boundaries catch errors thrown **during React's own
rendering, lifecycle and constructor work**. An event handler runs outside that
call stack — by the time your `onClick` fires, React's render is long finished,
so there is nothing to catch it.

```jsx
// ✗ the boundary will not see this
<button onClick={() => { throw new Error('boom') }} />

// ✓
<button onClick={() => {
  try { risky() } catch (e) { setError(e) }
}} />
```

A common bridge: catch in the handler, put the error in state, then **throw it
during render** so the boundary does see it.

## Placement is a design decision

Granularity is the real question:

- **One boundary at the root** — any error blanks the whole app. Simple, harsh.
- **Per route** — a broken page does not kill the shell or navigation.
- **Around independent widgets** — a failing chart leaves the rest of the
  dashboard usable.

A common structure is root + per-route + around genuinely risky third-party
widgets.

## Recovery

`reset()` (clearing the error state) re-renders the subtree. That only helps if
the cause was transient — a failed chunk load, a flaky request. If the error is
deterministic, resetting immediately re-throws, so pair retry with a `key` change
or a real reload.

## Production behaviour

React does **not** send server error messages to the browser in production; you
get a generic message plus a `digest` to correlate with server logs. So
`componentDidCatch` reporting to Sentry/Datadog is not optional — without it you
have no visibility into what users actually hit.

## How to answer this out loud

"An error boundary is a class component with `getDerivedStateFromError` for the
fallback UI and `componentDidCatch` for logging — two methods because one runs
in the render phase and must be pure, the other after commit where side effects
are fine. The important limitation is that they only catch errors thrown during
rendering and lifecycles: event handlers and async code need try/catch. And
without a boundary, an uncaught error unmounts the whole tree, which is why I'd
place them per route and around risky widgets."

## Follow-ups to expect

- *Why no hook version?* The mechanism needs lifecycle methods; `react-error-
  boundary` wraps the class for you with a hook-friendly API.
- *How do you catch async errors?* Catch and re-throw during render, or handle
  them as state.
- *What about Suspense?* Same catch-based idea — one catches promises, the other
  errors, and they compose.
