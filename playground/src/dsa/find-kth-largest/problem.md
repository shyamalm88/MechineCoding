# Kth Largest Element in an Array (LeetCode #215)

Given an integer array nums and an integer k, return the kth largest element
in the array.

Note that it is the kth largest element in the sorted order, not the kth
distinct element.

Example 1:
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5

Example 2:
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4

Constraints:
- 1 <= k <= nums.length <= 10^5

## Approach

Min-Heap

## Intuition

We maintain a Min-Heap of size k.
As we iterate through the array, we push elements into the heap.
If the heap size exceeds k, we pop the smallest element.
At the end, the root of the heap (the smallest of the top k) is the kth largest.

Time Complexity: O(N log K)
Space Complexity: O(K)
