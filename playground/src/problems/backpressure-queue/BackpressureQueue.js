/**
 * A queue with TWO gates:
 *   1. Execution gate  -- running < concurrency
 *   2. Admission gate  -- queue.length < maxQueueSize
 *
 * When the admission gate is closed, push() returns a promise that does not
 * resolve until space frees up. That is backpressure: the producer is SLOWED
 * rather than the queue growing without bound.
 */
export class BackpressureQueue {
  constructor({ concurrency = 2, maxQueueSize = 3 } = {}) {
    this.concurrency = concurrency
    this.maxQueueSize = maxQueueSize
    this.queue = []
    this.waitingProducers = []
    this.running = 0
  }

  /** Resolves once the task has been ACCEPTED into the queue (not completed). */
  push(task) {
    return new Promise((admit) => {
      const enqueue = () => {
        this.queue.push(task)
        admit()
        this.#drain()
      }
      if (this.queue.length < this.maxQueueSize) enqueue()
      else this.waitingProducers.push(enqueue) // park the producer
    })
  }

  #drain() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift()

      // A slot just opened in the queue -- admit one parked producer.
      this.waitingProducers.shift()?.()

      this.running++
      Promise.resolve()
        .then(task)
        .catch(() => {})
        .finally(() => { this.running--; this.#drain() })
    }
  }

  get stats() {
    return { running: this.running, queued: this.queue.length, blocked: this.waitingProducers.length }
  }
}
