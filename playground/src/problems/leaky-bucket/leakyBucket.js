/**
 * Leaky bucket: requests enter a queue and drain at a CONSTANT rate.
 *
 * Contrast with token bucket, which lets a saved-up burst through instantly.
 * Leaky bucket smooths output no matter how bursty the input is.
 */
export class LeakyBucket {
  constructor({ capacity = 5, leakRatePerSec = 2 } = {}) {
    this.capacity = capacity
    this.intervalMs = 1000 / leakRatePerSec
    this.queue = []
    this.timer = null
  }

  /** Returns false when the bucket is full -- the request is DROPPED. */
  add(item, onLeak) {
    if (this.queue.length >= this.capacity) return false
    this.queue.push({ item, onLeak })
    this.#start()
    return true
  }

  #start() {
    if (this.timer !== null) return
    this.timer = setInterval(() => {
      const next = this.queue.shift()
      if (!next) { clearInterval(this.timer); this.timer = null; return }
      next.onLeak(next.item)
    }, this.intervalMs)
  }

  stop() { clearInterval(this.timer); this.timer = null }
  get size() { return this.queue.length }
}
