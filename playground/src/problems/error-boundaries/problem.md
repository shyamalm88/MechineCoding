# Error boundaries — implementation and limitations

## Implementation

Error boundaries are **class components only** — there is still no hook
equivalent, because the mechanism depends on lifecycle methods React calls
during the commit phase.

```js
class ErrorBoundary extends React.Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }          // render phase: compute fallback UI
  }

  componentDidCatch(error, info) {
    logToService(error, info.componentStack)   // commit phase: side effects
  }

  render() {
    return this.state.error
      ? <Fallback error={this.state.error} onRetry={() => this.setState({ error: null })} />
      : this.props.children
  }
}
```

Two methods because the phases differ: `getDerivedStateFromError` runs during
render and must be pure; `componentDidCatch` runs after commit and is where
logging belongs.

## What they do NOT catch

- **Event handlers** — use `try/catch`. This is the one people forget.
- **Asynchronous code** — `setTimeout`, promises, `async` callbacks.
- **Server-side rendering.**
- **Errors thrown in the boundary itself** — it cannot catch its own error, so
  it propagates upward.

The common thread: boundaries only catch errors thrown **during React's
rendering, lifecycle, and constructor work**. Anything outside that call stack
is invisible to them.

## Placement

Granularity is a design decision. One boundary at the root means any error
blanks the whole app; a boundary per widget keeps the rest of the page alive.
Route-level plus around risky independent widgets is a common middle ground.

## Note

An unhandled error with no boundary **unmounts the entire tree** — React 16+
deliberately chose a blank page over a corrupted UI.
