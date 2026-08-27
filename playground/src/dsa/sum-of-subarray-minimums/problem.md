# Sum of Subarray Minimums (LeetCode #907)

> Sum of Subarray Minimums (LeetCode #907)

Sum min(b) over every contiguous subarray b. Answer modulo 1e9+7.

## Intuition

Enumerating all O(n^2) subarrays is too slow. Flip the question: instead of
"what is the min of this subarray?", ask

```text
    for each element, HOW MANY subarrays is it the minimum of?
```

That count is (distance to the previous smaller element) ×
(distance to the next smaller element) — the number of ways to choose a left
and right boundary within which arr[i] is smallest. This is the
CONTRIBUTION technique, and a monotonic stack finds both boundaries in O(n).

The tie-break matters: use STRICTLY smaller on one side and smaller-or-equal
on the other, or subarrays with duplicate minima get counted twice.

## Dry run

[3,1,2,4]
```text
  element 1 at index 1: prev smaller none (left=2 choices), next smaller none
  (right=3) → contributes 1 × 2 × 3 = 6
  ... total 17
```

## Time

O(n)   SPACE: O(n)
