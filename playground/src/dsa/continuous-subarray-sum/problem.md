# Continuous Subarray Sum (LeetCode #523)

Is there a subarray of length >= 2 whose sum is a multiple of k?

## Intuition

Prefix sums plus modular arithmetic. If prefix[j] % k === prefix[i] % k then
the sum between them is divisible by k — the remainders cancel.

So store the FIRST index at which each remainder was seen. When the remainder
repeats, the gap between the indices is the subarray; require a gap of at
least 2 to satisfy the length constraint. Storing the first index only is
what maximises that gap.

Seed the map with {0: -1} so a prefix that is itself divisible by k counts.

## Complexity

TIME: O(n) · SPACE: O(min(n,k))
