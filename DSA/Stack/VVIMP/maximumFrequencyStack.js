/**
 * ============================================================================
 * PROBLEM: Maximum Frequency Stack (LeetCode #895)
 * ============================================================================
 * Design a stack-like data structure to push elements to the stack and pop the
 * most frequent element from the stack.
 *
 * Implement the FreqStack class:
 * - FreqStack() constructs an empty frequency stack.
 * - void push(int val) pushes an integer val onto the top of the stack.
 * - int pop() removes and returns the most frequent element in the stack.
 *   - If there is a tie for the most frequent element, the element closest to
 *     the stack's top is removed and returned.
 *
 * Example 1:
 * Input:
 * ["FreqStack", "push", "push", "push", "push", "push", "push", "pop", "pop", "pop", "pop"]
 * [[], [5], [7], [5], [7], [4], [5], [], [], [], []]
 * Output:
 * [null, null, null, null, null, null, null, 5, 7, 5, 4]
 *
 * Explanation:
 * FreqStack freqStack = new FreqStack();
 * freqStack.push(5); // The stack is [5]
 * freqStack.push(7); // The stack is [5,7]
 * freqStack.push(5); // The stack is [5,7,5]
 * freqStack.push(7); // The stack is [5,7,5,7]
 * freqStack.push(4); // The stack is [5,7,5,7,4]
 * freqStack.push(5); // The stack is [5,7,5,7,4,5]
 * freqStack.pop();   // return 5, as 5 is the most frequent.
 * freqStack.pop();   // return 7, as 5 and 7 is the most frequent, but 7 is closest to the top.
 * freqStack.pop();   // return 5, as 5 is the most frequent.
 * freqStack.pop();   // return 4, as 4, 5 and 7 is the most frequent, but 4 is closest to the top.
 */

// ============================================================================
// APPROACH: Hash Map of Stacks
// ============================================================================
/**
 * INTUITION:
 * We need to track two things:
 * 1. The frequency of each element (`freq` map).
 * 2. The order of elements for each frequency (`group` map).
 *
 * `group` is a map where the key is the frequency `k`, and the value is a stack
 * of elements that have that frequency.
 *
 * When we push `val`:
 * - Increment its count in `freq`. Let's say it becomes `f`.
 * - Push `val` onto the stack at `group[f]`.
 * - This means `val` is the most recent element to reach frequency `f`.
 *
 * When we pop:
 * - Look at the stack at `group[maxFreq]`.
 * - Pop the top element `x`. This is the most recent element with the highest frequency.
 * - Decrement `freq[x]`.
 * - If the stack at `group[maxFreq]` becomes empty, decrement `maxFreq`.
 *
 * Time Complexity: O(1) for both push and pop.
 * Space Complexity: O(N) to store elements.
 */
class FreqStack {
  constructor() {
    this.freq = new Map();
    this.group = new Map();
    this.maxFreq = 0;
  }

  push(val) {
    // 1. Update frequency map
    const f = (this.freq.get(val) || 0) + 1;
    this.freq.set(val, f);

    // 2. Update max frequency if needed
    if (f > this.maxFreq) this.maxFreq = f;

    // 3. Push element to the stack associated with frequency 'f'
    // If this is the first element with frequency 'f', create a new stack
    if (!this.group.has(f)) {
      this.group.set(f, []);
    }
    this.group.get(f).push(val);
  }

  pop() {
    // 1. Get the stack corresponding to the current maximum frequency
    const stack = this.group.get(this.maxFreq);

    // 2. Pop the top element (most recently added with this frequency)
    const x = stack.pop();

    // 3. Decrement the frequency of the popped element
    this.freq.set(x, this.freq.get(x) - 1);

    // 4. If the stack for maxFreq is empty, decrement maxFreq
    if (stack.length === 0) {
      this.group.delete(this.maxFreq);
      this.maxFreq--;
    }
    return x;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Maximum Frequency Stack Tests ===\n");

const fs = new FreqStack();
fs.push(5);
fs.push(7);
fs.push(5);
fs.push(7);
fs.push(4);
fs.push(5);

console.log("Pop 1:", fs.pop()); // Expected: 5
console.log("Pop 2:", fs.pop()); // Expected: 7
console.log("Pop 3:", fs.pop()); // Expected: 5
console.log("Pop 4:", fs.pop()); // Expected: 4

module.exports = { FreqStack };
