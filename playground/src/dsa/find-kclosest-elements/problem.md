# Find K Closest Elements (LeetCode #658)

> Find K Closest Elements (LeetCode #658)

## Category

🟢 IMPORTANT (Binary Search on the Answer's Window Boundary)
Given a sorted integer array `arr`, two integers `k` and `x`, return the
`k` closest integers to `x` in the array, sorted in ascending order.

An integer `a` is closer to `x` than an integer `b` if:
- |a - x| < |b - x|, OR
- |a - x| == |b - x| AND a < b

Example 1:
Input: arr=[1,2,3,4,5], k=4, x=3 → Output: [1,2,3,4]

Example 2:
Input: arr=[1,2,3,4,5], k=4, x=-1 → Output: [1,2,3,4]

Constraints:
- 1 <= k <= arr.length
- 1 <= arr.length <= 10^4
- arr is sorted in ascending order
- -10^4 <= arr[i], x <= 10^4
