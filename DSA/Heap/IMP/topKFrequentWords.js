/**
 * ============================================================================
 * PROBLEM: Top K Frequent Words (LeetCode #692)
 * CATEGORY: 🟢 IMPORTANT (Min-Heap with Multi-Key Custom Comparator)
 * ============================================================================
 * Given an array of strings `words` and an integer k, return the k most
 * frequent strings. Sort the answer by frequency from highest to lowest.
 * Words with the SAME frequency are sorted by LEXICOGRAPHICAL order (smaller
 * string first).
 *
 * Example 1:
 * Input: words=["i","love","leetcode","i","love","coding"], k=2
 * Output: ["i","love"]
 * Explanation: "i" and "love" both appear twice; "i" < "love" lexicographically.
 *
 * Example 2:
 * Input: words=["the","day","is","sunny","the","the","the","sunny","is","is"], k=4
 * Output: ["the","is","sunny","day"]
 *
 * Constraints:
 * - 1 <= words.length <= 500
 * - 1 <= words[i].length <= 10
 * - words[i] consists of lowercase English letters
 * - k is in the range [1, the number of unique words]
 */

// ============================================================================
// APPROACH: Min-Heap of Size K with a "Least Desirable First" Comparator
// ============================================================================
/**
 * STORY / INTUITION:
 * This is `topKFrequentElements` (LC347) with a TWIST: when frequencies tie,
 * we need a SECOND sort key (lexicographic order) — a single number can't
 * capture "priority" anymore, so the heap needs a CUSTOM COMPARATOR over
 * [word, count] pairs.
 *
 * Maintain a MIN-HEAP of size k where the "smallest" (root, popped first
 * when oversized) is the LEAST desirable candidate:
 *   - lower frequency is less desirable, OR
 *   - equal frequency AND lexicographically LARGER word is less desirable
 *     (because smaller words should rank higher / survive).
 *
 * Push every (word, count) pair; whenever size exceeds k, pop the least
 * desirable one. What remains are the k best, but in "worst-to-best" heap
 * order — pop them all and REVERSE to get "best-to-worst".
 *
 * DRY RUN: words=["i","love","leetcode","i","love","coding"], k=2
 * freq: i=2, love=2, leetcode=1, coding=1
 * push(i,2)        -> heap=[(i,2)]
 * push(love,2)     -> tie on freq, "love">"i" (less desirable) -> bubbles to root
 *                     heap root=(love,2)
 * push(leetcode,1) -> freq1<2, least desirable -> becomes root; size=3>2 -> pop root
 *                     pops (leetcode,1); heap=[(love,2),(i,2)]
 * push(coding,1)   -> freq1, least desirable -> root; size=3>2 -> pop root
 *                     pops (coding,1); heap=[(love,2),(i,2)]
 * Pop remaining (worst-first): (love,2) then (i,2) -> ["love","i"]
 * Reverse -> ["i","love"] ✓
 *
 * Time:  O(N log K) — N words, heap operations bounded by size K
 * Space: O(N) — frequency map + heap
 */
class MinHeap {
  constructor(compare) {
    this.heap = [];
    this.compare = compare; // true if `a` is "smaller" (popped first)
  }
  size() {
    return this.heap.length;
  }
  push(x) {
    this.heap.push(x);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!this.compare(this.heap[i], this.heap[p])) break;
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p;
    }
  }
  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < this.heap.length && this.compare(this.heap[l], this.heap[smallest])) smallest = l;
        if (r < this.heap.length && this.compare(this.heap[r], this.heap[smallest])) smallest = r;
        if (smallest === i) break;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }
    }
    return top;
  }
}

const topKFrequent = (words, k) => {
  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

  // "Smaller" (popped first) = less desirable: lower freq, or (tie) larger word
  const heap = new MinHeap((a, b) => {
    if (a[1] !== b[1]) return a[1] < b[1];
    return a[0] > b[0];
  });

  for (const entry of freq.entries()) {
    heap.push(entry);
    if (heap.size() > k) heap.pop();
  }

  const result = [];
  while (heap.size() > 0) result.push(heap.pop()[0]);
  return result.reverse();
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Top K Frequent Words Tests ===\n");

console.log(
  "Test 1:",
  topKFrequent(["i", "love", "leetcode", "i", "love", "coding"], 2)
); // Expected: ["i","love"]

console.log(
  "Test 2:",
  topKFrequent(["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4)
); // Expected: ["the","is","sunny","day"]

module.exports = { topKFrequent };
