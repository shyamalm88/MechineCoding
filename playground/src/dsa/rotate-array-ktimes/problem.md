# Rotate Array (LeetCode #189)

Given an integer array nums, rotate the array to the right by k steps,
where k is non-negative.

Example 1:
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]

Example 2:
Input: nums = [-1,-100,3,99], k = 2
Output: [3,99,-1,-100]

Constraints:
- 1 <= nums.length <= 10^5
- 0 <= k <= 10^5

## Approach

Reverse Strategy

## Intuition

To rotate an array by k elements to the right, we can perform three reversals:
1. Reverse the entire array.
```text
   [1,2,3,4,5,6,7] -> [7,6,5,4,3,2,1]
```

2. Reverse the first k elements.
```text
   [7,6,5] -> [5,6,7]
```

3. Reverse the remaining n-k elements.
```text
   [4,3,2,1] -> [1,2,3,4]
```

Result: [5,6,7,1,2,3,4]

This works because reversing the whole array puts the last k elements at the
front (but in reverse order) and the first n-k elements at the back (in reverse order).
Reversing the individual parts fixes their internal order.

## Dry run

Input: nums = [1, 2, 3, 4, 5, 6, 7], k = 3

1. Normalize k:
```text
   - n = 7. k = 3 % 7 = 3.
```

2. Reverse Entire Array (0 to 6):
```text
   - [1, 2, 3, 4, 5, 6, 7] becomes [7, 6, 5, 4, 3, 2, 1].
```

3. Reverse First k Elements (0 to 2):
```text
   - Subarray [7, 6, 5] becomes [5, 6, 7].
   - Array state: [5, 6, 7, 4, 3, 2, 1].
```

4. Reverse Remaining Elements (3 to 6):
```text
   - Subarray [4, 3, 2, 1] becomes [1, 2, 3, 4].
   - Final Array: [5, 6, 7, 1, 2, 3, 4].
```

Time Complexity: O(N)
Space Complexity: O(1) - In-place.
