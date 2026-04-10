/**
 * ============================================================================
 * PROBLEM: Priority Queue (Min-Heap)
 * ============================================================================
 * Implement a Priority Queue backed by a binary Min-Heap that supports:
 *  - enqueue(value, priority) — add item with priority
 *  - dequeue()                — remove and return highest-priority item (lowest number)
 *  - peek()                   — view without removing
 *  - size() / isEmpty()
 *
 * WHY: Underpins task schedulers, Dijkstra's algorithm, event simulation,
 *      OS process scheduling, A* pathfinding. Interviewers ask you to build
 *      the heap from scratch — not just use it as a black box.
 * ============================================================================
 */

class MinHeap {
  constructor(comparator = (a, b) => a.priority - b.priority) {
    this.heap = [];
    this.comparator = comparator; // returns negative if a should be above b
  }

  size()    { return this.heap.length; }
  isEmpty() { return this.heap.length === 0; }
  peek()    { return this.heap[0] ?? null; }

  // O(log n)
  enqueue(value, priority) {
    this.heap.push({ value, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  // O(log n)
  dequeue() {
    if (this.isEmpty()) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  // ─── Private: heap navigation ─────────────────────────────────────────────

  _parent(i)  { return Math.floor((i - 1) / 2); }
  _left(i)    { return 2 * i + 1; }
  _right(i)   { return 2 * i + 2; }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // After insert — bubble new node up until heap property restored
  _bubbleUp(i) {
    while (i > 0) {
      const parent = this._parent(i);
      if (this.comparator(this.heap[i], this.heap[parent]) < 0) {
        this._swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  // After dequeue — sink root down until heap property restored
  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left  = this._left(i);
      const right = this._right(i);

      if (left < n && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest !== i) {
        this._swap(i, smallest);
        i = smallest;
      } else {
        break;
      }
    }
  }
}

// ─── MaxHeap (flip comparator) ───────────────────────────────────────────────
class MaxHeap extends MinHeap {
  constructor() {
    super((a, b) => b.priority - a.priority);
  }
}

// ─── PriorityQueue (public API wrapper) ─────────────────────────────────────
class PriorityQueue {
  constructor(type = "min") {
    this._heap = type === "max" ? new MaxHeap() : new MinHeap();
  }

  enqueue(value, priority) { this._heap.enqueue(value, priority); }
  dequeue()                 { return this._heap.dequeue(); }
  peek()                    { return this._heap.peek(); }
  size()                    { return this._heap.size(); }
  isEmpty()                 { return this._heap.isEmpty(); }
}

// ─── Usage: basic ─────────────────────────────────────────────────────────
const pq = new PriorityQueue("min");
pq.enqueue("low priority task",    10);
pq.enqueue("critical task",         1);
pq.enqueue("medium priority task",  5);
pq.enqueue("urgent task",           2);

console.log(pq.peek());     // { value: "critical task", priority: 1 }
console.log(pq.dequeue());  // { value: "critical task", priority: 1 }
console.log(pq.dequeue());  // { value: "urgent task", priority: 2 }
console.log(pq.dequeue());  // { value: "medium priority task", priority: 5 }

// ─── Usage: Max heap ──────────────────────────────────────────────────────
const maxPQ = new PriorityQueue("max");
maxPQ.enqueue("A", 3);
maxPQ.enqueue("B", 10);
maxPQ.enqueue("C", 1);
console.log(maxPQ.dequeue()); // { value: "B", priority: 10 }

// ─── Real-world: Task Scheduler with Priority ─────────────────────────────
class TaskRunner {
  constructor(concurrency = 2) {
    this.queue = new PriorityQueue("min"); // lower number = higher priority
    this.running = 0;
    this.concurrency = concurrency;
  }

  add(fn, priority = 5) {
    this.queue.enqueue(fn, priority);
    this._run();
  }

  _run() {
    while (this.running < this.concurrency && !this.queue.isEmpty()) {
      const { value: task } = this.queue.dequeue();
      this.running++;
      Promise.resolve(task()).finally(() => {
        this.running--;
        this._run(); // pick next task
      });
    }
  }
}

const runner = new TaskRunner(2);
runner.add(() => console.log("priority 5 task"), 5);
runner.add(() => console.log("priority 1 task"), 1);
runner.add(() => console.log("priority 3 task"), 3);
// priority 1 task and priority 3 task run first (concurrency=2)
// then priority 5 task

// ─── Real-world: Dijkstra's shortest path ─────────────────────────────────
function dijkstra(graph, start) {
  const dist = {};
  const pq = new PriorityQueue("min");

  for (const node of Object.keys(graph)) dist[node] = Infinity;
  dist[start] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const { value: node, priority: d } = pq.dequeue();
    if (d > dist[node]) continue; // stale entry

    for (const [neighbor, weight] of graph[node]) {
      const newDist = dist[node] + weight;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        pq.enqueue(neighbor, newDist);
      }
    }
  }
  return dist;
}

const graph = {
  A: [["B", 1], ["C", 4]],
  B: [["C", 2], ["D", 5]],
  C: [["D", 1]],
  D: [],
};
console.log(dijkstra(graph, "A")); // { A: 0, B: 1, C: 3, D: 4 }

/**
 * ─── Complexity ──────────────────────────────────────────────────────────────
 * enqueue:   O(log n)
 * dequeue:   O(log n)
 * peek:      O(1)
 * build heap from array: O(n)  — heapify (not implemented here, FYI)
 *
 * ─── Interview talking points ────────────────────────────────────────────────
 * 1. Heap vs sorted array:
 *    Sorted array: insert O(n), dequeue O(1)
 *    Heap:         insert O(log n), dequeue O(log n) — better for dynamic data
 *
 * 2. Why 0-indexed? Parent = floor((i-1)/2), children = 2i+1, 2i+2.
 *    1-indexed: parent = floor(i/2), children = 2i, 2i+1 — slightly cleaner math.
 *
 * 3. Heap property: every parent is smaller (min-heap) than its children.
 *    NOT sorted left-to-right — only root is guaranteed minimum.
 *
 * 4. bubbleUp after insert, sinkDown after dequeue — these are the two core ops.
 */
