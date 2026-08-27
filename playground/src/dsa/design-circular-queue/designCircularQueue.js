// ============================================================================
// APPROACH: Ring Buffer with front/rear pointers + size counter
// ============================================================================
/**
 * STORY / INTUITION:
 * Imagine seats arranged in a circle. `front` points to the first occupied seat,
 * `rear` points to the last occupied seat. When you add, move rear forward (wrap
 * around with % k). When you remove, move front forward. Track `size` to know
 * if full or empty — this avoids the classic ambiguity of front == rear.
 *
 * KEY TRICK: (index + 1) % k wraps around. Array never actually "runs out of space"
 * because we reuse vacated slots.
 *
 * DRY RUN (k=3):
 * Initial: data=[_,_,_], front=0, rear=-1, size=0
 * enQueue(1): rear=(0+1)%3=0, data[0]=1, size=1 → [1,_,_]
 * enQueue(2): rear=1, data[1]=2, size=2 → [1,2,_]
 * enQueue(3): rear=2, data[2]=3, size=3 → [1,2,3] FULL
 * deQueue():  front=(0+1)%3=1, size=2 → [_,2,3]
 * enQueue(4): rear=(2+1)%3=0, data[0]=4, size=3 → [4,2,3] ← wrapped!
 * Front=data[1]=2, Rear=data[0]=4
 *
 * Time:  O(1) for all operations
 * Space: O(k)
 */
class MyCircularQueue {
  constructor(k) {
    this.data = new Array(k);
    this.front = 0;
    this.rear = -1;
    this.size = 0;
    this.capacity = k;
  }

  enQueue(value) {
    if (this.isFull()) return false;
    this.rear = (this.rear + 1) % this.capacity;
    this.data[this.rear] = value;
    this.size++;
    return true;
  }

  deQueue() {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return true;
  }

  Front() {
    return this.isEmpty() ? -1 : this.data[this.front];
  }

  Rear() {
    return this.isEmpty() ? -1 : this.data[this.rear];
  }

  isEmpty() {
    return this.size === 0;
  }

  isFull() {
    return this.size === this.capacity;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Design Circular Queue Tests ===\n");

const cq = new MyCircularQueue(3);
console.log("enQueue(1):", cq.enQueue(1)); // true
console.log("enQueue(2):", cq.enQueue(2)); // true
console.log("enQueue(3):", cq.enQueue(3)); // true
console.log("enQueue(4):", cq.enQueue(4)); // false (full)
console.log("Rear:", cq.Rear());           // 3
console.log("isFull:", cq.isFull());       // true
console.log("deQueue:", cq.deQueue());     // true
console.log("enQueue(4):", cq.enQueue(4)); // true
console.log("Rear:", cq.Rear());           // 4
console.log("Front:", cq.Front());         // 2

module.exports = { MyCircularQueue };
