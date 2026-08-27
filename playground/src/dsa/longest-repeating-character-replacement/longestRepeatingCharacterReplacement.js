// ============================================================================
// APPROACH: Sliding Window (Frequency Count)
// ============================================================================
/**
 * INTUITION:
 * In any window [left, right], we want to make all characters match the
 * "most frequent character" in that window.
 * The number of replacements needed = (Window Length) - (Count of Most Frequent Char).
 *
 * If (Length - MaxFreq) <= k, the window is valid.
 * If (Length - MaxFreq) > k, the window is invalid, so we shrink from left.
 *
 * DRY RUN:
 * Input: s = "AABABBA", k = 1
 *
 * 1. r=0 ('A'): freq={A:1}, maxFreq=1. Len=1. 1-1 <= 1. OK. maxLen=1.
 * 2. r=1 ('A'): freq={A:2}, maxFreq=2. Len=2. 2-2 <= 1. OK. maxLen=2.
 * 3. r=2 ('B'): freq={A:2, B:1}, maxFreq=2. Len=3. 3-2 <= 1. OK. maxLen=3.
 * 4. r=3 ('A'): freq={A:3, B:1}, maxFreq=3. Len=4. 4-3 <= 1. OK. maxLen=4.
 *
 * 5. r=4 ('B'): freq={A:3, B:2}, maxFreq=3. Len=5. 5-3 = 2 > 1. INVALID.
 *    - Shrink: Remove s[0] ('A'). freq={A:2, B:2}. left=1.
 *    - Now Len=4. 4-3 <= 1. OK.
 *
 * 6. r=5 ('B'): freq={A:2, B:3}, maxFreq=3. Len=5 (indices 1-5). 5-3 = 2 > 1. INVALID.
 *    - Shrink: Remove s[1] ('A'). freq={A:1, B:3}. left=2.
 *    - Now Len=4. 4-3 <= 1. OK.
 *
 * Result: 4
 *
 * Time Complexity: O(N)
 * Space Complexity: O(26) -> O(1)
 */
const characterReplacement = (s, k) => {
  const freq = new Map();
  let left = 0;
  let maxFreq = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    freq.set(ch, (freq.get(ch) || 0) + 1);

    // track most frequent char in current window
    maxFreq = Math.max(maxFreq, freq.get(ch));

    // if window invalid, shrink
    while (right - left + 1 - maxFreq > k) {
      const leftChar = s[left];
      freq.set(leftChar, freq.get(leftChar) - 1);
      left++;
    }

    // window is valid here
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
};

console.log("=== Longest Repeating Character Replacement Tests ===\n");
console.log("Test 1:", characterReplacement("ABAB", 2)); // Expected: 4
console.log("Test 2:", characterReplacement("AABABBA", 1)); // Expected: 4

module.exports = { characterReplacement };
