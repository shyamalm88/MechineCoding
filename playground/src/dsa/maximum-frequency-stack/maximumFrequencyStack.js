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
