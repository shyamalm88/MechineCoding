/**
 * ============================================================================
 * PROBLEM: Min Stack (LeetCode #155)
 * ============================================================================
 * Design a stack that supports push, pop, top, and retrieving the minimum element
 * in constant time.
 *
 * Implement the MinStack class:
 * - MinStack() initializes the stack object.
 * - void push(int val) pushes the element val onto the stack.
 * - void pop() removes the element on the top of the stack.
 * - int top() gets the top element of the stack.
 * - int getMin() retrieves the minimum element in the stack.
 *
 * You must write an algorithm with O(1) time complexity for each function.
 */

// ============================================================================
// APPROACH: Two Stacks
// ============================================================================
/**
 * INTUITION:
 * We maintain two stacks:
 * 1. `stack`: Stores the actual values.
 * 2. `minStack`: Stores the minimum value encountered *so far* at each level.
 *
 * When pushing `val`, we push `val` to `stack`. For `minStack`, we push
 * `min(val, currentMin)`. This ensures the top of `minStack` is always the
 * minimum for the current state of `stack`.
 */
class MinStack {
  constructor() {
    // Main stack to store all elements
    this.stack = [];
    // Auxiliary stack to store the minimum element at each level
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);

    // If minStack is empty, this value is the minimum.
    // Otherwise, push the smaller of val and the current minimum.
    if (this.minStack.length === 0) {
      this.minStack.push(val);
    } else {
      this.minStack.push(
        Math.min(val, this.minStack[this.minStack.length - 1])
      );
    }
  }

  pop() {
    // Remove from both stacks to keep them in sync
    this.stack.pop();
    this.minStack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    // The top of minStack always holds the minimum of the current stack
    return this.minStack[this.minStack.length - 1];
  }
}
