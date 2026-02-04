/**
 * ============================================================================
 * PROBLEM: Redux-like State Management (CreateStore)
 * ============================================================================
 *
 * INTUITION:
 * A centralized store that holds the state tree of the application.
 * The only way to change the state is to emit an action (dispatch).
 *
 * ALGORITHM (Pub/Sub Pattern):
 * 1. State: Holds the current data.
 * 2. Listeners: Array of functions subscribed to changes.
 * 3. Dispatch(action):
 *    - Call reducer(currentState, action) -> newState.
 *    - Update state.
 *    - Loop through listeners and call them.
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * 1. createStore(reducer, {count:0}). State={count:0}.
 * 2. subscribe(fn). Listeners=[fn].
 * 3. dispatch({type: INC}). Reducer returns {count:1}. State updated. fn() called.
 * ============================================================================
 */
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((l) => l());
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener); // unsubscribe
  }

  // initialize state
  dispatch({ type: "__INIT__" });

  return { getState, dispatch, subscribe };
}

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(counterReducer, { count: 0 });

const unsubscribe = store.subscribe(() => {
  console.log("State changed:", store.getState());
});

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "DECREMENT" });

unsubscribe();
