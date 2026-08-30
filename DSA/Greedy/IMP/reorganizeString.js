/**
 * ============================================================================
 * PROBLEM: Reorganize String (LeetCode #767)
 * ============================================================================
 * Given a string s, rearrange its characters so that no two ADJACENT characters
 * are the same. Return any valid rearrangement, or "" if none exists.
 *
 * Example 1:
 * Input: s = "aab"  → Output: "aba"
 * Example 2:
 * Input: s = "aaab" → Output: "" (impossible)
 *
 * Constraints:
 * - 1 <= s.length <= 500
 * - s consists of lowercase English letters
 */

// ============================================================================
// APPROACH: Place the Most Frequent Character on Even Slots First
// ============================================================================
/**
 * STORY / INTUITION:
 * The whole problem is controlled by the single most frequent character. If it
 * appears maxCount times it needs maxCount "islands" separated by other
 * characters, which requires at least maxCount - 1 separators. So the string is
 * solvable exactly when:
 *
 *      maxCount <= ceil(n / 2)
 *
 * Beyond that check, there is a neat construction that avoids a heap entirely.
 * Write characters into the EVEN indices first (0, 2, 4, ...), and when those
 * run out wrap around to the ODD indices (1, 3, 5, ...). Two positions filled
 * consecutively by the same character always differ by 2, so they can never
 * touch — and the wrap point is safe precisely because of the count bound.
 *
 * Crucially, place the MOST FREQUENT character first. It is the only one that
 * can span the wrap-around and collide with itself, so giving it the clean run
 * of even slots is what makes the rest trivially safe.
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * Necessity: each occurrence of the top character needs a distinct neighbour
 * slot, giving the ceil(n/2) bound — below it no arrangement exists at all.
 * Sufficiency: the even-then-odd stride places identical characters at least 2
 * apart by construction. The only risk is a character straddling the wrap
 * (last even slot then first odd slot, which are adjacent when n is odd), and
 * the count bound rules that out for the top character; every other character
 * has count <= maxCount and starts after it, so it cannot straddle either.
 *
 * DRY RUN: s = "aab"  (n = 3, counts a:2 b:1, max a:2, ceil(3/2)=2 → OK)
 * place 'a' twice from idx 0: res[0]='a' (idx→2), res[2]='a' (idx→4)
 * place 'b' once: idx 4 >= 3 → wrap to 1: res[1]='b'
 * → "aba"
 *
 * Time:  O(N + K) where K = alphabet size
 * Space: O(N) for the result
 */
const reorganizeString = (s) => {
  const count = new Map();
  for (const ch of s) count.set(ch, (count.get(ch) || 0) + 1);

  // Find the bottleneck character.
  let maxChar = null;
  let maxCount = 0;
  for (const [ch, c] of count) {
    if (c > maxCount) {
      maxCount = c;
      maxChar = ch;
    }
  }

  // Too many copies to ever separate.
  if (maxCount > Math.ceil(s.length / 2)) return "";

  const result = new Array(s.length);
  let idx = 0;

  // Stride by 2: fill evens, then wrap to odds. Same char lands >= 2 apart.
  const place = (ch, times) => {
    for (let i = 0; i < times; i++) {
      if (idx >= s.length) idx = 1; // even slots exhausted → start the odds
      result[idx] = ch;
      idx += 2;
    }
  };

  // The bottleneck goes first — it is the only one that could straddle the wrap.
  place(maxChar, maxCount);
  count.delete(maxChar);
  for (const [ch, c] of count) place(ch, c);

  return result.join("");
};

/** Verify no two adjacent characters match (used by the tests below). */
const isValid = (out, original) =>
  out === ""
    ? "(impossible)"
    : out.length === original.length && ![...out].some((c, i) => c === out[i + 1]);

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Reorganize String Tests ===\n");

const t1 = reorganizeString("aab");
console.log("Test 1:", t1, "valid:", isValid(t1, "aab"));       // Expected: e.g. "aba", true

const t2 = reorganizeString("aaab");
console.log("Test 2:", JSON.stringify(t2));                      // Expected: ""

const t3 = reorganizeString("vvvlo");
console.log("Test 3:", t3, "valid:", isValid(t3, "vvvlo"));      // Expected: valid arrangement

const t4 = reorganizeString("a");
console.log("Test 4:", t4, "valid:", isValid(t4, "a"));          // Expected: "a", true

const t5 = reorganizeString("aabbcc");
console.log("Test 5:", t5, "valid:", isValid(t5, "aabbcc"));     // Expected: valid arrangement

module.exports = { reorganizeString };
