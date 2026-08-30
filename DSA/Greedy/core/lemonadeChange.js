/**
 * ============================================================================
 * PROBLEM: Lemonade Change (LeetCode #860)
 * ============================================================================
 * Each lemonade costs $5. Customers queue up paying with a $5, $10, or $20
 * bill and you must give correct change immediately. You start with no money.
 * Return true if you can serve every customer in order.
 *
 * Example 1:
 * Input: bills = [5,5,5,10,20] → Output: true
 * (Take 5,5,5. For 10 give back a 5. For 20 give back 10 + 5.)
 *
 * Example 2:
 * Input: bills = [5,5,10,10,20] → Output: false
 * (At the 20 you hold 10,10 — you cannot make 15.)
 *
 * Constraints:
 * - 1 <= bills.length <= 10^5
 * - bills[i] is either 5, 10, or 20
 */

// ============================================================================
// APPROACH: Greedy — Always Pay a $20 With a Ten First
// ============================================================================
/**
 * STORY / INTUITION:
 * You never need a real "counter" — only how many $5 and $10 bills you hold
 * ($20 bills are useless as change, so never track them).
 *
 *   $5  → keep it, no change due
 *   $10 → owe $5.  Only one way to pay: a five.
 *   $20 → owe $15. Two ways: (10 + 5) or (5 + 5 + 5).
 *
 * The only real decision is that last one, and the greedy rule is:
 * PREFER 10 + 5.
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * A $5 bill is strictly more flexible than a $10 — fives can settle both a $10
 * customer and a $20 customer, tens can only help with a $20. So when both
 * options exist, spending the rigid bill and hoarding the flexible one leaves
 * you in a state at least as good. Paying with three fives when you had a ten
 * available can only strand you later; the reverse is never true.
 *
 * DRY RUN: [5,5,10,10,20]
 * 5  → five=1
 * 5  → five=2
 * 10 → give a five. five=1, ten=1
 * 10 → give a five. five=0, ten=2
 * 20 → want 10+5 but five=0; want 5*3 but five=0 → FALSE
 *
 * Time:  O(N) — one pass
 * Space: O(1) — two counters
 */
const lemonadeChange = (bills) => {
  let five = 0;
  let ten = 0;

  for (const bill of bills) {
    if (bill === 5) {
      five++;
    } else if (bill === 10) {
      if (five === 0) return false; // owe $5 and have no fives
      five--;
      ten++;
    } else {
      // $20 → owe $15. Burn the inflexible ten first, keep fives in reserve.
      if (ten > 0 && five > 0) {
        ten--;
        five--;
      } else if (five >= 3) {
        five -= 3;
      } else {
        return false;
      }
    }
  }

  return true;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Lemonade Change Tests ===\n");

console.log("Test 1:", lemonadeChange([5, 5, 5, 10, 20]));  // Expected: true
console.log("Test 2:", lemonadeChange([5, 5, 10, 10, 20])); // Expected: false
console.log("Test 3:", lemonadeChange([5, 5, 10]));         // Expected: true
console.log("Test 4:", lemonadeChange([10]));               // Expected: false
console.log("Test 5:", lemonadeChange([5, 5, 5, 5, 20, 20])); // Expected: false (2nd 20 has no five)

module.exports = { lemonadeChange };
