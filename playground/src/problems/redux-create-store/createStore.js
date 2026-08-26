/**
 * Redux in ~40 lines. The whole library is: hold state, run it through a pure
 * reducer on dispatch, notify subscribers.
 */
export function createStore(reducer, preloadedState, enhancer) {
  if (typeof enhancer === 'function') return enhancer(createStore)(reducer, preloadedState)

  let state = preloadedState
  let listeners = []
  let isDispatching = false

  const getState = () => {
    if (isDispatching) throw new Error('You may not call getState() while the reducer is executing')
    return state
  }

  const subscribe = (listener) => {
    // Snapshot the array so a subscribe/unsubscribe DURING a dispatch does not
    // mutate the list currently being iterated.
    listeners = [...listeners, listener]
    let subscribed = true
    return () => {
      if (!subscribed) return
      subscribed = false
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    if (typeof action.type === 'undefined') throw new Error('Actions must have a type')
    if (isDispatching) throw new Error('Reducers may not dispatch actions')

    try {
      isDispatching = true
      state = reducer(state, action)
    } finally {
      isDispatching = false
    }

    for (const listener of listeners) listener()
    return action
  }

  dispatch({ type: '@@redux/INIT' }) // let reducers supply their defaults
  return { getState, dispatch, subscribe }
}

/** applyMiddleware: each middleware wraps dispatch, innermost first. */
export function applyMiddleware(...middlewares) {
  return (create) => (reducer, preloadedState) => {
    const store = create(reducer, preloadedState)
    let dispatch = store.dispatch
    const api = { getState: store.getState, dispatch: (a) => dispatch(a) }
    const chain = middlewares.map((mw) => mw(api))
    dispatch = chain.reduceRight((next, mw) => mw(next), store.dispatch)
    return { ...store, dispatch }
  }
}

export function combineReducers(reducers) {
  return (state = {}, action) => {
    let changed = false
    const next = {}
    for (const [key, reducer] of Object.entries(reducers)) {
      next[key] = reducer(state[key], action)
      if (next[key] !== state[key]) changed = true
    }
    // Return the SAME reference when nothing changed, so === checks short-circuit.
    return changed ? next : state
  }
}
