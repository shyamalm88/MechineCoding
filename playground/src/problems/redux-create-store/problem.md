# Redux createStore from scratch

The whole library is about forty lines: hold state, run it through a pure
reducer on dispatch, notify subscribers.

```js
{ getState, dispatch, subscribe }
```

## Why the reducer must be pure

`(state, action) => newState`, with no mutation, no I/O, no `Date.now()`, no
`Math.random()`. Purity is what buys time-travel debugging, replayable action
logs, and trivially testable state logic. Break it and every one of those
guarantees goes.

## The core

```js
function dispatch(action) {
  state = reducer(state, action)
  listeners.forEach((listener) => listener())
}
```

`subscribe(listener)` adds to a `Set` and returns an unsubscribe function.
`createStore(reducer, initialState)` also dispatches `{ type: "__INIT__" }` once
on creation so reducers can supply their defaults (`state = { count: 0 }`).

## Details that show you understand it

- **The init dispatch.** Reducers use default parameters to declare their
  initial value; the store has to dispatch something unrecognised once to
  collect them.
- **Mutating the listener `Set` during a dispatch** — a listener that
  unsubscribes while being notified is the edge case. Redux snapshots the
  listener list before iterating to make it safe.
- **Guard against dispatching inside a reducer.** It is an infinite loop waiting
  to happen, and an explicit error is far kinder than a stack overflow.
- **Return the same reference when nothing changed.** The reducer's `default:
  return state` is what lets `===` checks downstream (`useSelector`,
  `React.memo`) skip work.

## Beyond this version

The real library adds `combineReducers` (one reducer per slice of state) and
`applyMiddleware` (`store => next => action => …`, which is why thunk is only a
few lines). Both are natural follow-ups.

## Context

Modern Redux Toolkit hides all of this, and Zustand/Jotai use a similar
store-plus-subscription core. Knowing the primitive explains why the rules
(pure reducers, immutable updates, serialisable actions) exist rather than
being arbitrary ceremony.
