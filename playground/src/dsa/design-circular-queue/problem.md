# Design Circular Queue (LeetCode #622)

Design a circular (ring buffer) queue with fixed capacity.
Supports: enQueue, deQueue, Front, Rear, isEmpty, isFull.

Example:
const cq = new MyCircularQueue(3);
cq.enQueue(1); // true
cq.enQueue(2); // true
cq.enQueue(3); // true
cq.enQueue(4); // false (full)
cq.Rear();     // 3
cq.isFull();   // true
cq.deQueue();  // true
cq.enQueue(4); // true
cq.Rear();     // 4

Constraints:
- 1 <= k <= 1000
- 0 <= value <= 1000
- At most 3000 calls per operation
