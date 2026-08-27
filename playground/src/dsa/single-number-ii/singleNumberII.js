// ============================================================================
// APPROACH: Bit Counting — For Each of the 32 Bit Positions, Count mod 3
// ============================================================================
/**
 * STORY / INTUITION:
 * If every number appeared TWICE except one (the classic "Single Number"),
 * XOR-ing everything cancels pairs out, leaving the odd one. With triples,
 * XOR doesn't cancel cleanly — but a different invariant does:
 *
 * For ANY fixed bit position, sum up how many numbers have that bit set.
 * Every number that's part of a "triple" contributes either 0 or 3 to that
 * count (since it's counted 3 times). The SINGLE number contributes 0 or 1.
 * So `totalCount % 3` tells you EXACTLY what the single number's bit is at
 * that position: if the total isn't a multiple of 3, the single number must
 * have a 1 there.
 *
 * Do this independently for all 32 bit positions and OR the results together
 * to reconstruct the answer. Using `>>` (sign-extending) and building the
 * result with `|=` correctly reproduces negative numbers via 32-bit two's
 * complement when bit 31 ends up set.
 *
 * DRY RUN: nums=[2,2,3,2]  (2=0b010, 3=0b011)
 * bit0: bits are 0,0,1,0 -> count=1, 1%3=1 -> result bit0 = 1
 * bit1: bits are 1,1,1,1 -> count=4, 4%3=1 -> result bit1 = 1
 * bit2+: all 0
 * result = 0b011 = 3 ✓
 *
 * DRY RUN: nums=[0,1,0,1,0,1,99]  (99 = 0b1100011)
 * bit0: three 1's contribute 3, plus 99's bit0=1 -> count=4, 4%3=1 -> set
 * bit1: 99's bit1=1 -> count=1, 1%3=1 -> set
 * bit5: 99's bit5=1 -> count=1 -> set
 * bit6: 99's bit6=1 -> count=1 -> set
 * result = bits {0,1,5,6} = 1+2+32+64 = 99 ✓
 *
 * Time:  O(32 * N) = O(N)
 * Space: O(1)
 */
const singleNumber = (nums) => {
  let result = 0;

  for (let bit = 0; bit < 32; bit++) {
    let count = 0;
    for (const num of nums) {
      count += (num >> bit) & 1;
    }
    if (count % 3 !== 0) {
      result |= 1 << bit;
    }
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Single Number II Tests ===\n");

console.log("Test 1:", singleNumber([2, 2, 3, 2])); // Expected: 3
console.log("Test 2:", singleNumber([0, 1, 0, 1, 0, 1, 99])); // Expected: 99
console.log("Test 3:", singleNumber([-2, -2, -2, -5])); // Expected: -5

module.exports = { singleNumber };
