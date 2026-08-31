# Can Place Flowers (LeetCode #605)

You have a long flowerbed where some plots are planted (1) and some are not
(0). Flowers cannot be planted in ADJACENT plots. Given the flowerbed and an
integer n, return true if n new flowers can be planted without violating the
no-adjacent-flowers rule.

Example 1:
Input: flowerbed = [1,0,0,0,1], n = 1 → Output: true

Example 2:
Input: flowerbed = [1,0,0,0,1], n = 2 → Output: false

Constraints:
- 1 <= flowerbed.length <= 2 * 10^4
- flowerbed[i] is 0 or 1
- There are no two adjacent flowers in the input
- 0 <= n <= flowerbed.length

## Approach

Greedy Left-to-Right — Plant at the First Legal Plot

## Story / intuition

Sweep left to right and plant the moment it is legal: the plot is empty AND
both neighbours are empty (treating off-the-end as empty, since there is no
flower out there to conflict with).

## Why the greedy choice is safe

Consider any maximal run of zeros. Planting as early as possible inside it
is optimal because a flower placed at position i blocks exactly i-1 and i+1
— the same amount of damage wherever you put it — but planting EARLY leaves
the longest possible unblocked tail to the right. Delaying a plant never
unlocks a slot; it can only waste one. Formally, a run of k zeros bounded by
flowers fits floor((k-1)/2) plants and the left-greedy sweep always achieves
that bound.

## Watch the edges

the first and last plots have only one neighbour. Guarding
with `i === 0 ||` and `i === len-1 ||` is what makes [0,0,1] correctly yield
one plant instead of zero.

## Dry run

[1,0,0,0,1], n = 2
i=0: plot is 1 → skip
i=1: 0 but left neighbour is 1 → skip
i=2: 0, left 0, right 0 → PLANT. bed = [1,0,1,0,1], count = 1
i=3: 0 but left is now 1 → skip
i=4: plot is 1 → skip
count 1 < 2 → FALSE

Time:  O(N) — single pass
Space: O(1) — mutates in place
