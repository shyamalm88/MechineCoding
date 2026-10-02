/**
 * ============================================================================
 * PROBLEM: Async Queue with Backpressure
 * ============================================================================
 * Implement a task queue that limits:
 * 1. Concurrency: How many tasks run at the same time.
 * 2. Queue Size: How many tasks can wait in the "ready" buffer.
 *
 * If the queue is full, the `push` method should delay the acceptance of
 * the task until space frees up.
 *
 * ============================================================================
 * INTUITION: Double Gating
 * ============================================================================
 * We have two gates:
 * 1. Execution Gate: `running < concurrency`.
 *    - Controls moving tasks from `queue` -> Execution.
 * 2. Admission Gate: `queue.length < maxQueueSize`.
 *    - Controls moving tasks from `push()` -> `queue`.
 *
 * If the Admission Gate is closed (queue full), we park the incoming task
 * in a `waitingProducers` list.
 */

class BackpressureQueue {
  constructor(concurrency, maxQueueSize) {
    this.concurrency = concurrency;
    this.maxQueueSize = maxQueueSize;

    this.running = 0;
    this.queue = [];
    this.waitingProducers = [];
  }

  push(task) {
    return new Promise((resolve, reject) => {
      const runTask = async () => {
        this.running++;
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          this.running--;
          this._releaseProducer(); // 🔓 relieve backpressure
          this._drain();
        }
      };

      const enqueue = () => {
        this.queue.push(runTask);
        this._drain();
      };

      if (this.queue.length < this.maxQueueSize) {
        enqueue();
      } else {
        // Backpressure: producer waits
        this.waitingProducers.push(enqueue);
      }
    });
  }

  _releaseProducer() {
    if (
      this.waitingProducers.length > 0 &&
      this.queue.length < this.maxQueueSize
    ) {
      const wakeProducer = this.waitingProducers.shift();
      wakeProducer();
    }
  }

  _drain() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const nextTask = this.queue.shift();
      nextTask();
    }
  }
}

export { BackpressureQueue }
