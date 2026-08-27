/** A tiny external store: state living outside React. */
export function createStore(initial) {
  let state = initial
  const listeners = new Set()
  return {
    getSnapshot: () => state,
    subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener) },
    set: (next) => { state = next; listeners.forEach((l) => l()) },
  }
}
