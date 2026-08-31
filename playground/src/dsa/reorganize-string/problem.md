# Reorganize String (LeetCode #767)

Given a string s, rearrange its characters so that no two ADJACENT characters
are the same. Return any valid rearrangement, or "" if none exists.

Example 1:
Input: s = "aab"  → Output: "aba"
Example 2:
Input: s = "aaab" → Output: "" (impossible)

Constraints:
- 1 <= s.length <= 500
- s consists of lowercase English letters

## Approach

Place the Most Frequent Character on Even Slots First

## Story / intuition

The whole problem is controlled by the single most frequent character. If it
appears maxCount times it needs maxCount "islands" separated by other
characters, which requires at least maxCount - 1 separators. So the string is
solvable exactly when:

```text
     maxCount <= ceil(n / 2)
```

Beyond that check, there is a neat construction that avoids a heap entirely.
Write characters into the EVEN indices first (0, 2, 4, ...), and when those
run out wrap around to the ODD indices (1, 3, 5, ...). Two positions filled
consecutively by the same character always differ by 2, so they can never
touch — and the wrap point is safe precisely because of the count bound.

Crucially, place the MOST FREQUENT character first. It is the only one that
can span the wrap-around and collide with itself, so giving it the clean run
of even slots is what makes the rest trivially safe.

## Why the greedy choice is safe

Necessity: each occurrence of the top character needs a distinct neighbour
slot, giving the ceil(n/2) bound — below it no arrangement exists at all.
Sufficiency: the even-then-odd stride places identical characters at least 2
apart by construction. The only risk is a character straddling the wrap
(last even slot then first odd slot, which are adjacent when n is odd), and
the count bound rules that out for the top character; every other character
has count <= maxCount and starts after it, so it cannot straddle either.

## Dry run

s = "aab"  (n = 3, counts a:2 b:1, max a:2, ceil(3/2)=2 → OK)
place 'a' twice from idx 0: res[0]='a' (idx→2), res[2]='a' (idx→4)
place 'b' once: idx 4 >= 3 → wrap to 1: res[1]='b'
→ "aba"

Time:  O(N + K) where K = alphabet size
Space: O(N) for the result

 Verify no two adjacent characters match (used by the tests below).
