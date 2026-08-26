/**
 * EventEmitter / pub-sub.
 *
 * `on` returns an unsubscribe function -- far less error-prone than requiring
 * the caller to keep the exact same function reference for `off`.
 */
export class EventEmitter {
  constructor() {
    this.listeners = new Map() // event -> Set<handler>
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event).add(handler)
    return () => this.off(event, handler)
  }

  once(event, handler) {
    const wrapped = (...args) => {
      this.off(event, wrapped) // remove BEFORE calling, so a throw still unsubscribes
      handler(...args)
    }
    return this.on(event, wrapped)
  }

  off(event, handler) {
    const set = this.listeners.get(event)
    if (!set) return
    set.delete(handler)
    if (set.size === 0) this.listeners.delete(event) // avoid unbounded growth
  }

  emit(event, ...args) {
    const set = this.listeners.get(event)
    if (!set) return false
    // Copy first: a handler that unsubscribes (or subscribes) during emit
    // would otherwise mutate the Set we are iterating.
    for (const handler of [...set]) handler(...args)
    return true
  }
}
