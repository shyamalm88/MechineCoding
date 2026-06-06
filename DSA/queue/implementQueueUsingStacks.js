/**
 * ============================================================================
 * PROBLEM: Implement Queue using Stacks (LeetCode #232)
 * ============================================================================
 * Implement a first in first out (FIFO) queue using only two stacks.
 * Support push, pop, peek, and empty operations.
 *
 * Example:
 * const q = new MyQueue();
 * q.push(1); q.push(2);
 * q.peek(); // 1
 * q.pop();  // 1
 * q.empty(); // false
 *
 * Constraints:
 * - 1 <= x <= 9
 * - At most 100 calls to push, pop, peek, empty
 * - All calls to pop and peek are valid
 */

// ============================================================================
// APPROACH: Two Stacks — Inbox + Outbox (Amortized O(1))
// ============================================================================
/**
 * STORY / INTUITION:
 * Think of two trays on your desk: "inbox" and "outbox".
 * - push → always goes onto the inbox tray (top).
 * - pop/peek → you need the BOTTOM of inbox (oldest item).
 *   If outbox is empty, flip all of inbox into outbox (reverses order).
 *   Now the oldest item sits on TOP of outbox. Pop it.
 *
 * KEY INSIGHT: Each element moves at most TWICE — once into inbox, once into outbox.
 * So over N operations, total moves = 2N → Amortized O(1) per operation.
 *
 * DRY RUN:
 * push(1) → inbox=[1], outbox=[]
 * push(2) → inbox=[1,2], outbox=[]
 * pop()   → outbox empty → pour inbox → outbox=[2,1] → pop 1 → outbox=[2]
 * push(3) → inbox=[3], outbox=[2]
 * pop()   → outbox not empty → pop 2 → outbox=[]
 * pop()   → outbox empty → pour inbox → outbox=[3] → pop 3
 *
 * Time:  push O(1) | pop/peek amortized O(1) | empty O(1)
 * Space: O(N)
 */
class MyQueue {
  constructor() {
    this.inbox = [];   // push here
    this.outbox = [];  // pop/peek from here
  }

  push(x) {
    this.inbox.push(x);
  }

  // Pour inbox into outbox only when outbox is empty
  _transfer() {
    if (this.outbox.length === 0) {
      while (this.inbox.length) {
        this.outbox.push(this.inbox.pop());
      }
    }
  }

  pop() {
    this._transfer();
    return this.outbox.pop();
  }

  peek() {
    this._transfer();
    return this.outbox[this.outbox.length - 1];
  }

  empty() {
    return this.inbox.length === 0 && this.outbox.length === 0;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Implement Queue Using Stacks Tests ===\n");

const q = new MyQueue();
q.push(1);
q.push(2);
console.log("peek:", q.peek());   // Expected: 1
console.log("pop:", q.pop());     // Expected: 1
console.log("empty:", q.empty()); // Expected: false
q.push(3);
console.log("pop:", q.pop());     // Expected: 2
console.log("pop:", q.pop());     // Expected: 3
console.log("empty:", q.empty()); // Expected: true

module.exports = { MyQueue };
