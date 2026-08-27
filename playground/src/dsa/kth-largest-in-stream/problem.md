# Kth Largest Element in a Stream (LeetCode #703)

> Kth Largest Element in a Stream (LeetCode #703)

Design a class to find the kth largest element in a stream.
- KthLargest(k, nums): init with k and initial array nums.
- add(val): add val to the stream and return the current kth largest.

Example:
KthLargest(3, [4,5,8,2])
add(3)  → 4   (stream=[2,3,4,5,8], 3rd largest=4)
add(5)  → 5   (stream=[2,3,4,5,5,8])
add(10) → 5
add(9)  → 8
add(4)  → 8

Constraints:
- 1 <= k <= 10^4
- 0 <= nums.length <= 10^4
- -10^4 <= nums[i] <= 10^4
- add will be called at most 10^4 times
