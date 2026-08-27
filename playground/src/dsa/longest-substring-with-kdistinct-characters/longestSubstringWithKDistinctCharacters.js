// ============================================================================
// APPROACH: Sliding Window — at most K distinct chars in window
// ============================================================================
/**
 * STORY / INTUITION:
 * Same template as Fruit Into Baskets (#904), generalized from "2 baskets"
 * to "K baskets". Use a Map to track { char → count in window }.
 * When map.size > k, shrink from left until map.size <= k again.
 * At every step the window is valid (<= k distinct), so track max length.
 *
 * Edge case: k = 0 → no characters allowed → answer is always 0.
 *
 * DRY RUN (s = "eceba", k = 2):
 * r=0('e'): map={e:1}, size=1, win=[0..0] len=1
 * r=1('c'): map={e:1,c:1}, size=2, win=[0..1] len=2
 * r=2('e'): map={e:2,c:1}, size=2, win=[0..2] len=3
 * r=3('b'): map={e:2,c:1,b:1}, size=3 > 2 → shrink:
 *   l=0('e'): map={e:1,c:1,b:1}, size=3 > 2 → shrink:
 *   l=1('c'): map={e:1,b:1}, size=2. Stop. win=[2..3] len=2
 * r=4('a'): map={e:1,b:1,a:1}, size=3 > 2 → shrink:
 *   l=2('e'): map={b:1,a:1}, size=2. Stop. win=[3..4] len=2
 * Result: max length seen = 3
 *
 * Time:  O(N)
 * Space: O(K) — map holds at most K+1 entries at any time
 */
const lengthOfLongestSubstringKDistinct = (s, k) => {
  if (k === 0) return 0;

  const window = new Map(); // char -> count in window
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    window.set(ch, (window.get(ch) || 0) + 1);

    while (window.size > k) {
      const leftCh = s[left];
      window.set(leftCh, window.get(leftCh) - 1);
      if (window.get(leftCh) === 0) window.delete(leftCh);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Longest Substring with At Most K Distinct Characters Tests ===\n");

console.log("Test 1:", lengthOfLongestSubstringKDistinct("eceba", 2));        // Expected: 3
console.log("Test 2:", lengthOfLongestSubstringKDistinct("aa", 1));           // Expected: 2
console.log("Test 3:", lengthOfLongestSubstringKDistinct("a", 0));            // Expected: 0
console.log("Test 4:", lengthOfLongestSubstringKDistinct("abcabcabc", 2));    // Expected: 2

module.exports = { lengthOfLongestSubstringKDistinct };
