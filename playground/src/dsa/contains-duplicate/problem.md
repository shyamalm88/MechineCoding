# Contains Duplicate (LeetCode #217)

Return true if any value appears at least twice.

## Intuition

A Set answers "have I seen this?" in O(1). Compare set.size to array length
at the end, or bail early on the first repeat — early exit is better on the
common case where a duplicate appears near the front.

Sorting first is O(n log n) with O(1) space — the trade to mention if the
interviewer constrains memory.

## Complexity

TIME: O(n) · SPACE: O(n)
