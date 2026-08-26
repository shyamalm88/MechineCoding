/**
 * LRU cache with O(1) get and put.
 *
 * Uses a JS Map, which guarantees INSERTION ORDER -- so the first key from
 * map.keys() is the least recently used, provided we re-insert on every
 * access. That removes the need to hand-roll a doubly linked list.
 */
export class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map()
  }

  get(key) {
    if (!this.map.has(key)) return -1
    const value = this.map.get(key)
    // Re-insert to move this key to the most-recent end.
    this.map.delete(key)
    this.map.set(key, value)
    return value
  }

  put(key, value) {
    // Delete first so an update also moves the key to the recent end.
    if (this.map.has(key)) this.map.delete(key)
    this.map.set(key, value)

    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value
      this.map.delete(oldest)
    }
  }
}
