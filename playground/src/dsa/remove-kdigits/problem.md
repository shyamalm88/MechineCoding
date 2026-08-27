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
