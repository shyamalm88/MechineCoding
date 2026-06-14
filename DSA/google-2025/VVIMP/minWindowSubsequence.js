/**
 * ============================================================================
 * PROBLEM: Minimum Window Subsequence (LeetCode #727)
 * ============================================================================
 * Given strings s and t, find the minimum (contiguous) substring `w` of s,
 * so that t is a subsequence of `w`. If there is no such window, return "".
 *
 * Example:
 * Input: s = "abcdebdde", t = "bde"
 * Output: "bcde"
 * Explanation: "bcde" is the answer because it occurs before "bdde" which
 * has the same length. "deb" is not a valid window because t is not a
 * subsequence of it (order matters: 'b' must come before 'd' before 'e').
 *
 * Constraints:
 * 1 <= s.length <= 2 * 10^4
 * 1 <= t.length <= 100
 */

// ============================================================================
// APPROACH: Two-Pass Two Pointer (Forward Match, Backward Shrink)
// ============================================================================
/**
 * STORY / INTUITION:
 * Brute force would check every substring of s for t as a subsequence — too
 * slow. Instead, walk through s once with a pointer `j` into t:
 *
 * 1) FORWARD SCAN: advance `i` through s, advancing `j` through t whenever
 *    characters match. The moment `j` reaches t.length, we've found *some*
 *    window ending at `i` that contains t as a subsequence — but it may have
 *    extra junk at the front.
 *
 * 2) BACKWARD SHRINK: walk `i` backwards from that point, matching t in
 *    reverse, to find the tightest possible start for this window. This
 *    trims the "junk" prefix.
 *
 * 3) The trimmed window [i, end] is a candidate. Record it if it's the
 *    smallest seen so far, then resume the forward scan from i + 1 to look
 *    for the next candidate (a later window might be shorter still).
 *
 * DRY RUN: s = "abcdebdde", t = "bde"
 *  Forward from i=0: a,b(j=1),c,d(j=2),e(j=3=len) -> stop at i=4 (end=4)
 *  Backward from i=4: e(j=1),d(j=0),c(skip),b(j=-1) -> stop at i=1
 *  Window = s[1..4] = "bcde", length = 4 -> minLen=4, start=1
 *  Resume forward from i = 2:
 *  Forward: c,d,e,b(j=1),d(j=2),d(skip),e(j=3=len) -> stop at i=8 (end=8)
 *  Backward from i=8: e(j=1),d(j=0),d(skip),b(j=-1) -> stop at i=5
 *  Window = s[5..8] = "bdde", length = 4 -> not smaller than 4, ignore
 *  Resume forward from i = 6 -> no more full matches -> stop
 *  Result: "bcde"
 *
 * Time:  O(N * M) worst case (N = s.length, M = t.length) — each forward/
 *        backward pass is O(N), and in the worst case we restart O(N) times.
 * Space: O(1) extra (excluding the returned substring).
 */
function minWindowSubsequence(s, t) {
  let minLen = Infinity;
  let start = -1;

  let i = 0; // pointer on s

  while (i < s.length) {
    let j = 0; // pointer on t

    // Step 1: forward scan to match t
    while (i < s.length) {
      if (s[i] === t[j]) {
        j++;
        if (j === t.length) break;
      }
      i++;
    }

    if (j !== t.length) break; // no more matches

    // Step 2: backward shrink to find the tightest start
    let end = i;
    j = t.length - 1;

    while (i >= 0) {
      if (s[i] === t[j]) {
        j--;
        if (j < 0) break;
      }
      i--;
    }

    // window is [i, end] inclusive
    const windowLen = end - i + 1;
    if (windowLen < minLen) {
      minLen = windowLen;
      start = i;
    }

    // Move i forward to search for next window
    i = i + 1;
  }

  return start === -1 ? "" : s.slice(start, start + minLen);
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Window Subsequence Tests ===\n");

console.log("Test 1:", minWindowSubsequence("abcdebdde", "bde"));
// Expected: "bcde"

console.log("Test 2:", minWindowSubsequence("fgrqsqsnodwmuq", "fqsq"));
// Expected: "fgrqsq"

console.log("Test 3:", minWindowSubsequence("abc", "ac"));
// Expected: "abc"

console.log("Test 4:", minWindowSubsequence("abc", "xyz"));
// Expected: "" (t is not a subsequence of any window)

module.exports = { minWindowSubsequence };
