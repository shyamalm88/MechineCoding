// ============================================================================
// APPROACH: Count Map + Always Start a Group at the Smallest Card Left
// ============================================================================
/**
 * STORY / INTUITION:
 * Look at the SMALLEST card still in your hand. Nothing smaller exists, so no
 * group can contain it in any position other than FIRST. That removes all
 * choice: the group containing it must be exactly [x, x+1, ..., x+size-1]. If
 * those cards are not all available, the hand is impossible — no cleverness
 * later can rescue it.
 *
 * Repeat: take the smallest remaining card, force out its group, delete.
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * There is no greedy "choice" at all — the move is forced. That is the cleanest
 * kind of greedy argument. Since the minimum card can only ever be a group's
 * head, every valid solution must contain that exact group, so committing to it
 * loses nothing.
 *
 * EFFICIENCY NOTE: rather than peeling one card at a time, if the smallest card
 * x appears `need` times, then ALL `need` groups start at x. Consume `need`
 * copies of each of x..x+size-1 in one go — that is what keeps this near
 * O(N log N) instead of degenerating.
 *
 * QUICK REJECT: if hand.length % groupSize !== 0 the answer is false outright.
 *
 * DRY RUN: [1,2,3,6,2,3,4,7,8], groupSize = 3
 * counts {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}, keys sorted [1,2,3,4,6,7,8]
 * k=1 need=1 → consume 1,2,3 → {2:1, 3:1, 4:1, 6:1, 7:1, 8:1}
 * k=2 need=1 → consume 2,3,4 → {6:1, 7:1, 8:1}
 * k=3 need=0 → skip.  k=4 need=0 → skip
 * k=6 need=1 → consume 6,7,8 → {}
 * all consumed → TRUE
 *
 * Time:  O(N log N) — sorting the distinct keys
 * Space: O(N) for the count map
 */
const isNStraightHand = (hand, groupSize) => {
  // Cards must divide evenly into full groups.
  if (hand.length % groupSize !== 0) return false;

  const count = new Map();
  for (const card of hand) count.set(card, (count.get(card) || 0) + 1);

  // Ascending, so we always face the smallest card still unused.
  const keys = [...count.keys()].sort((a, b) => a - b);

  for (const key of keys) {
    const need = count.get(key);
    if (need <= 0) continue; // already swallowed by an earlier group

    // The smallest leftover card can only be a group HEAD, so `need` groups
    // must all start here — consume the whole run at once.
    for (let offset = 0; offset < groupSize; offset++) {
      const card = key + offset;
      const have = count.get(card) || 0;
      if (have < need) return false; // run is broken → impossible
      count.set(card, have - need);
    }
  }

  return true;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Hand of Straights Tests ===\n");

console.log("Test 1:", isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3)); // Expected: true
console.log("Test 2:", isNStraightHand([1, 2, 3, 4, 5], 4));             // Expected: false (5 % 4 !== 0)
console.log("Test 3:", isNStraightHand([1, 2, 3, 4, 5], 1));             // Expected: true (groups of one)
console.log("Test 4:", isNStraightHand([1, 1, 2, 2, 3, 3], 3));          // Expected: true (two [1,2,3])
console.log("Test 5:", isNStraightHand([1, 2, 4, 5], 2));                // Expected: true ([1,2] and [4,5])
console.log("Test 6:", isNStraightHand([1, 1, 2, 3], 2));                // Expected: false

module.exports = { isNStraightHand };
