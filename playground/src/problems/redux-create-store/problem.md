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

## The details that show you understand it

**`dispatch({type: '@@redux/INIT'})` on creation.** Reducers use default
parameters (`state = 0`) to declare their initial value; the store has to
dispatch something unrecognised once to collect them.

**Snapshot the listener array.** A subscriber that subscribes or unsubscribes
during a dispatch would otherwise mutate the array being iterated. Copying on
subscribe (rather than mutating in place) makes the in-flight iteration safe.

**`combineReducers` must return the same reference when nothing changed:**

```js
return changed ? next : state
```

Always returning a fresh object defeats every `===` optimisation downstream —
`useSelector`, `React.memo`, and `shouldComponentUpdate` all start firing on
every action.

**Guard against dispatching inside a reducer.** It is an infinite loop waiting
to happen, and the explicit error is far kinder than a stack overflow.

## applyMiddleware

Middleware are `store => next => action => …` — each wraps `dispatch`, composed
with `reduceRight` so the first listed runs outermost. That signature is why
thunk is only a few lines:

```js
const thunk = ({dispatch, getState}) => next => action =>
  typeof action === 'function' ? action(dispatch, getState) : next(action)
```

## Context

Modern Redux Toolkit hides all of this, and Zustand/Jotai use a similar
store-plus-subscription core. Knowing the primitive explains why the rules
(pure reducers, immutable updates, serialisable actions) exist rather than
being arbitrary ceremony.
