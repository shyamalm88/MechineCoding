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

## Approach

Ring Buffer with front/rear pointers + size counter

## Story / intuition

Imagine seats arranged in a circle. `front` points to the first occupied seat,
`rear` points to the last occupied seat. When you add, move rear forward (wrap
around with % k). When you remove, move front forward. Track `size` to know
if full or empty — this avoids the classic ambiguity of front == rear.

## Key trick

(index + 1) % k wraps around. Array never actually "runs out of space"
because we reuse vacated slots.

DRY RUN (k=3):
Initial: data=[_,_,_], front=0, rear=-1, size=0
enQueue(1): rear=(0+1)%3=0, data[0]=1, size=1 → [1,_,_]
enQueue(2): rear=1, data[1]=2, size=2 → [1,2,_]
enQueue(3): rear=2, data[2]=3, size=3 → [1,2,3] FULL
deQueue():  front=(0+1)%3=1, size=2 → [_,2,3]
enQueue(4): rear=(2+1)%3=0, data[0]=4, size=3 → [4,2,3] ← wrapped!
Front=data[1]=2, Rear=data[0]=4

Time:  O(1) for all operations
Space: O(k)
