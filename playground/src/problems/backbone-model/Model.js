/**
 * A miniature Backbone-style Model: attributes + change events.
 *
 * The design that made Backbone work: state lives behind get/set rather than
 * as plain properties, so `set` is the single choke point where change
 * detection and event emission happen.
 */
export class Model {
  constructor(attributes = {}) {
    this.attributes = { ...attributes }
    this._previous = { ...attributes }
    this._listeners = new Map()
  }

  get(key) { return this.attributes[key] }
  has(key) { return this.attributes[key] != null }
  toJSON() { return { ...this.attributes } }

  set(keyOrObject, maybeValue) {
    const updates =
      typeof keyOrObject === 'object' ? keyOrObject : { [keyOrObject]: maybeValue }

    const changed = []
    for (const [key, value] of Object.entries(updates)) {
      // Object.is so setting NaN over NaN is NOT reported as a change.
      if (!Object.is(this.attributes[key], value)) {
        this._previous[key] = this.attributes[key]
        this.attributes[key] = value
        changed.push(key)
      }
    }
    if (changed.length === 0) return this // silent -- no spurious events

    // Per-attribute events first, then one aggregate event.
    for (const key of changed) {
      this._emit(`change:${key}`, this, this.attributes[key], this._previous[key])
    }
    this._emit('change', this, changed)
    return this
  }

  previous(key) { return this._previous[key] }

  on(event, handler) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set())
    this._listeners.get(event).add(handler)
    return () => this._listeners.get(event)?.delete(handler)
  }

  _emit(event, ...args) {
    for (const handler of [...(this._listeners.get(event) ?? [])]) handler(...args)
  }
}
