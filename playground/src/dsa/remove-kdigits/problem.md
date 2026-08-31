# Remove K Digits (LeetCode #402)

Given a string num (non-negative integer) and integer k, remove k digits
to make the resulting number as small as possible. Return it as a string.

Example 1:
Input: num="1432219", k=3 → Output: "1219"
(remove 4, 3, 2 → leaves 1219, but actually: remove 4→"132219", remove 3→"12219", remove 2→"1219")

Example 2:
Input: num="10200", k=1 → Output: "200" → strip leading zeros → "200"

Example 3:
Input: num="10", k=2 → Output: "0"

Constraints:
- 1 <= k <= num.length <= 10^5
- num consists of only digits
- num does not have leading zeros except "0" itself

## Approach

Monotonic Increasing Stack (Greedy)

## Story / intuition

To make the number as small as possible, we want the leftmost digits to be
as small as possible. Greedy insight: if we see a digit smaller than the
one before it, removing the larger one (earlier digit) makes the number smaller.

Maintain a MONOTONIC INCREASING stack. For each digit:
- While k > 0 and stack top > current digit → pop (remove that bigger digit)
- Push current digit

After processing, if k > 0 still, remove from the end (they're ascending,
so removing the largest tail reduces the number least aggressively).

Finally, strip leading zeros.

## Dry run

num="1432219", k=3
'1': stack=[1]
'4': 4>1 → push → [1,4]
'3': 3<4 → pop 4 (k=2), 3>1 → push → [1,3]
'2': 2<3 → pop 3 (k=1), 2>1 → push → [1,2]
'2': 2=2 → push → [1,2,2]
'1': 1<2 → pop 2 (k=0), can't pop more → push 1 → [1,2,1]
'9': push → [1,2,1,9]
k=0, no tail removal. Result: "1219" ✓

Time:  O(N)
Space: O(N)
