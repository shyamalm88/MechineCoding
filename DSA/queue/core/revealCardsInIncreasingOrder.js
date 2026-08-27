/**
 * PROBLEM: Reveal Cards In Increasing Order (LeetCode #950)
 *
 * Order a deck so that repeatedly (reveal top, move next card to the bottom)
 * yields increasing order.
 *
 * INTUITION:
 * Simulating forwards requires guessing the arrangement. Run the process
 * BACKWARDS instead and it becomes deterministic:
 *
 *   place cards from largest to smallest; before each placement, move the
 *   current bottom card to the top (the inverse of "move top to bottom").
 *
 * Reversing an unknown-input process to make it constructive is the
 * transferable idea here.
 *
 * DRY RUN: sorted [2,3,5,7,11,13,17]
 *   start [17]; rotate+push 13 → [13,17]; rotate+push 11 → [11,17,13] ...
 *   final [2,13,3,11,5,17,7]
 *
 * TIME: O(n log n) for the sort   SPACE: O(n)
 */
const deckRevealedIncreasing = (deck) => {
  const sorted = [...deck].sort((a, b) => b - a); // descending
  const result = [];
  for (const card of sorted) {
    if (result.length) result.unshift(result.pop()); // inverse of top→bottom
    result.unshift(card);
  }
  return result;
};

console.log(deckRevealedIncreasing([17, 13, 11, 2, 3, 5, 7])); // [2,13,3,11,5,17,7]
console.log(deckRevealedIncreasing([1, 1000])); // [1,1000]
