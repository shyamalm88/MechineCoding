/**
 * Two eviction policies beyond plain LRU.
 */

/**
 * LFU: evict the LEAST FREQUENTLY used key; ties broken by least-recently used.
 *
 * Two maps make every operation O(1):
 *   keyMap:  key  -> { value, freq }
 *   freqMap: freq -> Map<key, true>   (insertion-ordered ⇒ first entry is LRU)
 *   minFreq: the smallest frequency currently in use
 */
export class LFUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.keyMap = new Map()
    this.freqMap = new Map()
    this.minFreq = 0
  }

  #touch(key) {
    const entry = this.keyMap.get(key)
    const bucket = this.freqMap.get(entry.freq)
    bucket.delete(key)

    // If we just emptied the minimum bucket, the new minimum is one higher.
    if (bucket.size === 0) {
      this.freqMap.delete(entry.freq)
      if (this.minFreq === entry.freq) this.minFreq++
    }

    entry.freq++
    if (!this.freqMap.has(entry.freq)) this.freqMap.set(entry.freq, new Map())
    this.freqMap.get(entry.freq).set(key, true)
  }

  get(key) {
    if (!this.keyMap.has(key)) return -1
    this.#touch(key)
    return this.keyMap.get(key).value
  }

  put(key, value) {
    if (this.capacity === 0) return

    if (this.keyMap.has(key)) {
      this.keyMap.get(key).value = value
      this.#touch(key)
      return
    }

    if (this.keyMap.size >= this.capacity) {
      // Evict the oldest key in the least-frequent bucket (LFU, LRU tiebreak).
      const bucket = this.freqMap.get(this.minFreq)
      const evictKey = bucket.keys().next().value
      bucket.delete(evictKey)
      if (bucket.size === 0) this.freqMap.delete(this.minFreq)
      this.keyMap.delete(evictKey)
    }

    this.keyMap.set(key, { value, freq: 1 })
    if (!this.freqMap.has(1)) this.freqMap.set(1, new Map())
    this.freqMap.get(1).set(key, true)
    this.minFreq = 1 // a brand-new key always resets the minimum
  }
}

/**
 * LRU with per-entry TTL. Expiry is LAZY -- checked on read -- so there is no
 * background timer per key.
 */
export class LRUWithTTL {
  constructor(capacity, defaultTtlMs = 1000) {
    this.capacity = capacity
    this.defaultTtlMs = defaultTtlMs
    this.map = new Map()
  }

  get(key) {
    if (!this.map.has(key)) return -1
    const entry = this.map.get(key)

    if (Date.now() > entry.expiresAt) {
      this.map.delete(key)   // expired: treat exactly like a miss
      return -1
    }

    this.map.delete(key)     // refresh recency
    this.map.set(key, entry)
    return entry.value
  }

  put(key, value, ttlMs = this.defaultTtlMs) {
    if (this.map.has(key)) this.map.delete(key)
    this.map.set(key, { value, expiresAt: Date.now() + ttlMs })

    if (this.map.size > this.capacity) {
      // Prefer evicting something already expired before a live entry.
      const expired = [...this.map.entries()].find(([, e]) => Date.now() > e.expiresAt)
      this.map.delete(expired ? expired[0] : this.map.keys().next().value)
    }
  }
}
