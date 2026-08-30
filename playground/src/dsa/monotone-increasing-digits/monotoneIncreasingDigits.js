// ============================================================================
// APPROACH: Right-to-Left Scan — Borrow Once, Then Flood With Nines
// ============================================================================
/**
 * STORY / INTUITION:
 * Walk from the RIGHT. Whenever a digit is bigger than the one after it
 * (d[i-1] > d[i]) the number is not monotone there. Since we may only go DOWN
 * from n, the fix is to decrement that offending left digit by one and make
 * everything to its right as large as possible — all 9s.
 *
 * Why right-to-left? Because decrementing can CASCADE. In 332, fixing the "32"
 * gives 3-2-9 → but now 3 > 2 is a fresh violation one place left. Scanning
 * right-to-left catches that cascade for free in a single pass; a left-to-right
 * scan would need to restart. Track the leftmost position that broke, then
 * flood everything from there onward with 9.
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * At the first (leftmost) violation, the prefix cannot stay as it is — no
 * assignment of the suffix can repair d[i-1] > d[i]. So the answer must be
 * strictly smaller in that prefix, and the largest such candidate decrements
 * exactly one digit by one. Having gone below n in that position, every later
 * digit is unconstrained by n, so setting them all to 9 is the maximum and is
 * trivially monotone.
 *
 * DRY RUN: n = 332 → digits [3,3,2]
 * i=2: d[1]=3 > d[2]=2 → d[1]-- → [3,2,2], marker = 2
 * i=1: d[0]=3 > d[1]=2 → d[0]-- → [2,2,2], marker = 1   ← the cascade
 * flood from index 1 → [2,9,9] = 299
 *
 * DRY RUN: n = 668841 → [6,6,8,8,4,1]
 * i=5: 4>1 → [6,6,8,8,3,1] marker=5
 * i=4: 8>3 → [6,6,8,7,3,1] marker=4
 * i=3: 8>7 → [6,6,7,7,3,1] marker=3
 * i=2: 6>7? no.  i=1: 6>6? no
 * flood from 3 → [6,6,7,9,9,9] = 667999
 *
 * Time:  O(D) where D = number of digits (<= 10)
 * Space: O(D)
 */
const monotoneIncreasingDigits = (n) => {
  const digits = String(n).split("").map(Number);

  // marker = first index that must become 9. Default past the end = no change.
  let marker = digits.length;

  // Right-to-left so a cascading borrow is handled in one pass.
  for (let i = digits.length - 1; i > 0; i--) {
    if (digits[i - 1] > digits[i]) {
      digits[i - 1]--;
      marker = i;
    }
  }

  // Everything right of the borrow is free to be maximal.
  for (let i = marker; i < digits.length; i++) digits[i] = 9;

  return Number(digits.join(""));
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Monotone Increasing Digits Tests ===\n");

console.log("Test 1:", monotoneIncreasingDigits(10));     // Expected: 9
console.log("Test 2:", monotoneIncreasingDigits(1234));   // Expected: 1234
console.log("Test 3:", monotoneIncreasingDigits(332));    // Expected: 299 (cascade)
console.log("Test 4:", monotoneIncreasingDigits(668841)); // Expected: 667999
console.log("Test 5:", monotoneIncreasingDigits(0));      // Expected: 0
console.log("Test 6:", monotoneIncreasingDigits(100));    // Expected: 99

module.exports = { monotoneIncreasingDigits };
