# Top K Frequent Elements (LeetCode #347)

Given an integer array nums and an integer k, return the k most frequent elements.
You may return the answer in any order.

Example 1:
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Example 2:
Input: nums = [1], k = 1
Output: [1]

Constraints:
- 1 <= nums.length <= 10^5
- k is in the range [1, the number of unique elements in the array].
- It is guaranteed that the answer is unique.

## Approach

Min-Heap (Keep Top K)

## Intuition

We count the frequency of each number.
Then we iterate through the unique numbers and maintain a Min-Heap of size k
based on frequency.
If the heap size exceeds k, we remove the element with the smallest frequency.
The remaining elements in the heap are the k most frequent.

Time Complexity: O(N log K)
Space Complexity: O(N + K)
