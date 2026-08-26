/**
 * Async task scheduler: runs tasks by priority, with a concurrency cap.
 *
 * Uses a binary min-heap so the highest-priority task is O(log n) to extract.
 * A sorted array would be O(n) per insert; a linear scan O(n) per pull.
 */
class MinHeap {
  constructor() { this.items = [] }
  get size() { return this.items.length }

  push(item) {
    this.items.push(item)
    let i = this.items.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.compare(this.items[i], this.items[parent]) >= 0) break
      this.swap(i, parent)
      i = parent
    }
  }

  pop() {
    const top = this.items[0]
    const last = this.items.pop()
    if (this.items.length) {
      this.items[0] = last
      let i = 0
      for (;;) {
        const l = 2 * i + 1, r = l + 1
        let smallest = i
        if (l < this.items.length && this.compare(this.items[l], this.items[smallest]) < 0) smallest = l
        if (r < this.items.length && this.compare(this.items[r], this.items[smallest]) < 0) smallest = r
        if (smallest === i) break
        this.swap(i, smallest)
        i = smallest
      }
    }
    return top
  }

  // Lower priority number = more urgent. `seq` breaks ties so equal
  // priorities run FIFO -- without it, heap order is arbitrary and the
  // scheduler is not stable.
  compare(a, b) { return a.priority - b.priority || a.seq - b.seq }
  swap(i, j) { [this.items[i], this.items[j]] = [this.items[j], this.items[i]] }
}

export class PriorityScheduler {
  constructor(concurrency = 1) {
    this.concurrency = concurrency
    this.heap = new MinHeap()
    this.running = 0
    this.seq = 0
  }

  add(task, priority = 10) {
    return new Promise((resolve, reject) => {
      this.heap.push({ task, priority, seq: this.seq++, resolve, reject })
      this.#drain()
    })
  }

  #drain() {
    while (this.running < this.concurrency && this.heap.size > 0) {
      const { task, resolve, reject } = this.heap.pop()
      this.running++
      Promise.resolve()
        .then(task)
        .then(resolve, reject)
        .finally(() => { this.running--; this.#drain() })
    }
  }
}
