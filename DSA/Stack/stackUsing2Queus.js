/**
 * ============================================================================
 * DESIGN: Implement Stack using Two Queues
 * ============================================================================
 *
 * Invariant:
 * - q1's front ALWAYS represents the top of the stack
 *
 * Strategy:
 * - Costly push
 * - Cheap pop
 * ============================================================================
 */

class MyStack {
  constructor() {
    this.q1 = [];
    this.q2 = [];
  }

  push(x) {
    // Step 1: push new element to helper queue
    this.q2.push(x);

    // Step 2: move everything from q1 → q2
    while (this.q1.length > 0) {
      this.q2.push(this.q1.shift());
    }

    // Step 3: swap queues
    [this.q1, this.q2] = [this.q2, this.q1];
  }

  pop() {
    return this.q1.shift();
  }

  top() {
    return this.q1[0];
  }

  empty() {
    return this.q1.length === 0;
  }
}
