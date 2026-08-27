// ============================================================================
// APPROACH: Two Pointers from the END (O(1) space)
// ============================================================================
/**
 * STORY / INTUITION:
 * Process both strings from RIGHT to LEFT simultaneously.
 * Backspaces only affect characters to their LEFT — so scan right-to-left.
 * Track pending backspace count. Skip characters when there's a pending backspace.
 * Compare the first "valid" (non-skipped) character from each string.
 *
 * ALGORITHM:
 * Two pointers i (for s), j (for t).
 * Use getNext(str, idx) → returns the index of next valid character (skipping backspaces).
 * Compare s[i] == t[j]. If equal, both advance. If either is -1 (exhausted), must match.
 *
 * DRY RUN: s="ab#c", t="ad#c"
 * i=3(c), j=3(c): both valid. s[3]=c==t[3]=c ✓. i=2, j=2.
 * i=2('#'): skip. i=1. i=1('b'): skip (backspace from #). i=0.
 * j=2('#'): skip. j=1. j=1('d'): skip. j=0.
 * i=0('a'), j=0('a'): a==a ✓. i=-1, j=-1.
 * Both exhausted at same time → true ✓
 *
 * Time:  O(M + N)
 * Space: O(1)
 */
const backspaceCompare = (s, t) => {
  // Returns index of next valid character, scanning backwards from idx
  const getNext = (str, idx) => {
    let skip = 0;
    while (idx >= 0) {
      if (str[idx] === '#') { skip++; idx--; }
      else if (skip > 0)    { skip--; idx--; }
      else break;
    }
    return idx;
  };

  let i = s.length - 1;
  let j = t.length - 1;

  while (i >= 0 || j >= 0) {
    i = getNext(s, i);
    j = getNext(t, j);

    if (i < 0 && j < 0) return true;  // both exhausted
    if (i < 0 || j < 0) return false; // one exhausted, other not
    if (s[i] !== t[j])  return false; // mismatch

    i--;
    j--;
  }

  return true;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Backspace String Compare Tests ===\n");

console.log("Test 1:", backspaceCompare("ab#c", "ad#c")); // Expected: true
console.log("Test 2:", backspaceCompare("ab##", "c#d#")); // Expected: true
console.log("Test 3:", backspaceCompare("a#c", "b"));     // Expected: false
console.log("Test 4:", backspaceCompare("####", ""));     // Expected: true

module.exports = { backspaceCompare };
