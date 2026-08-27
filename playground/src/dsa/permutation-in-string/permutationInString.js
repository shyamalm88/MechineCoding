// ============================================================================
// APPROACH: Fixed Sliding Window
// ============================================================================
/**
 * INTUITION:
 * We need to find a substring in s2 of length `s1.length` that has the exact
 * same character counts as s1.
 * We maintain a window of size `s1.length` on s2.
 * We compare the frequency arrays (or maps) of s1 and the current window in s2.
 *
 * DRY RUN:
 * Input: s1 = "ab", s2 = "eidbaooo"
 * s1 length = 2. Target counts: {a:1, b:1}
 *
 * 1. Init Window (indices 0-1): "ei"
 *    - s2 counts: {e:1, i:1}. Match? No.
 *
 * 2. Slide (index 2): Add 'd', Remove 'e'
 *    - Window: "id". s2 counts: {i:1, d:1}. Match? No.
 *
 * 3. Slide (index 3): Add 'b', Remove 'i'
 *    - Window: "db". s2 counts: {d:1, b:1}. Match? No.
 *
 * 4. Slide (index 4): Add 'a', Remove 'd'
 *    - Window: "ba". s2 counts: {b:1, a:1}. Match? Yes!
 *    - Return true.
 *
 * Time Complexity: O(N) where N is length of s2.
 * Space Complexity: O(1) (Array of size 26).
 */
const checkInclusion = (s1, s2) => {
  if (s1.length > s2.length) return false;

  const need = new Map();
  const window = new Map();

  // build frequency map for s1
  for (const ch of s1) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }

  // build first window
  for (let i = 0; i < s1.length; i++) {
    const ch = s2[i];
    window.set(ch, (window.get(ch) || 0) + 1);
  }

  if (mapsEqual(need, window)) return true;

  // slide the window
  for (let i = s1.length; i < s2.length; i++) {
    // add right char
    const rightChar = s2[i];
    window.set(rightChar, (window.get(rightChar) || 0) + 1);

    // remove left char
    const leftChar = s2[i - s1.length];
    window.set(leftChar, window.get(leftChar) - 1);

    if (mapsEqual(need, window)) return true;
  }

  return false;
};

function mapsEqual(m1, m2) {
  if (m1.size !== m2.size) return false;
  for (const [key, val] of m1) {
    if (m2.get(key) !== val) return false;
  }
  return true;
}

console.log("=== Permutation in String Tests ===\n");
console.log("Test 1:", checkInclusion("ab", "eidbaooo")); // Expected: true
console.log("Test 2:", checkInclusion("ab", "eidboaoo")); // Expected: false
console.log("Test 3:", checkInclusion("abc", "bbbca")); // Expected: true

module.exports = { checkInclusion };
