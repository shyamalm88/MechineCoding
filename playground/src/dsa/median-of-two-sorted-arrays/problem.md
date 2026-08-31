# Median of Two Sorted Arrays (LeetCode #4) ⭐ HARD

Given two sorted arrays nums1 and nums2, return the median of the two
combined sorted arrays. Must run in O(log(m+n)).

Example 1:
Input: nums1=[1,3], nums2=[2] → Output: 2.0

Example 2:
Input: nums1=[1,2], nums2=[3,4] → Output: 2.5

Constraints:
- 0 <= m, n <= 1000
- -10^6 <= nums1[i], nums2[i] <= 10^6

## Approach

Binary Search on Partition

## Story / intuition

The median splits ALL elements into two equal halves: LEFT half and RIGHT half.
We need to find the right partition in each array such that:
```text
  - left half of A + left half of B = right half of A + right half of B (by count)
  - max(leftA, leftB) <= min(rightA, rightB) (all left elements <= all right)
```

Binary search on the partition index of the SMALLER array (say A).
If we cut A at index i, then we cut B at index j = (m+n+1)/2 - i.

VISUALIZE (total=8, half=4):
A: [1, 3 | 5, 7]    ← partition after index 1 (i=2)
B: [2, 4 | 6, 8]    ← partition after index 1 (j=2)
leftA=3, leftB=4, rightA=5, rightB=6
3 <= 6 ✓ and 4 <= 5 ✓ → valid partition
Median = (max(3,4) + min(5,6)) / 2 = (4+5)/2 = 4.5

## When to adjust

- leftA > rightB: i too big → hi = i - 1
- leftB > rightA: i too small → lo = i + 1

## Edge cases

Use -Infinity/+Infinity for out-of-bound partitions.

Time:  O(log(min(m,n)))
Space: O(1)
