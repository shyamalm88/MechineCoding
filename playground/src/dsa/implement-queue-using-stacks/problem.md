# Implement Queue using Stacks (LeetCode #232)

Implement a first in first out (FIFO) queue using only two stacks.
Support push, pop, peek, and empty operations.

Example:
const q = new MyQueue();
q.push(1); q.push(2);
q.peek(); // 1
q.pop();  // 1
q.empty(); // false

Constraints:
- 1 <= x <= 9
- At most 100 calls to push, pop, peek, empty
- All calls to pop and peek are valid

## Approach

Two Stacks — Inbox + Outbox (Amortized O(1))

## Story / intuition

Think of two trays on your desk: "inbox" and "outbox".
- push → always goes onto the inbox tray (top).
- pop/peek → you need the BOTTOM of inbox (oldest item).
```text
  If outbox is empty, flip all of inbox into outbox (reverses order).
  Now the oldest item sits on TOP of outbox. Pop it.
```

## Key insight

Each element moves at most TWICE — once into inbox, once into outbox.
So over N operations, total moves = 2N → Amortized O(1) per operation.

## Dry run

push(1) → inbox=[1], outbox=[]
push(2) → inbox=[1,2], outbox=[]
pop()   → outbox empty → pour inbox → outbox=[2,1] → pop 1 → outbox=[2]
push(3) → inbox=[3], outbox=[2]
pop()   → outbox not empty → pop 2 → outbox=[]
pop()   → outbox empty → pour inbox → outbox=[3] → pop 3

Time:  push O(1) | pop/peek amortized O(1) | empty O(1)
Space: O(N)
