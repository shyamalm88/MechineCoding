# Product of Array Except Self (LeetCode #238)

Given an integer array nums, return an array answer such that answer[i] is
equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a
32-bit integer.

You must write an algorithm that runs in O(n) time and without using the
division operation.

Example 1:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Example 2:
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]

Constraints:
- 2 <= nums.length <= 10^5
- -30 <= nums[i] <= 30

## Approach

Prefix and Suffix Products

## Intuition

Instead of dividing the total product by nums[i] (which fails if 0 exists),
we calculate:
- Left Product: Product of all numbers to the left of i.
- Right Product: Product of all numbers to the right of i.
Result[i] = LeftProduct[i] * RightProduct[i].

We can do this in O(1) space (excluding output array) by using the output
array to store left products first, then multiplying by right products on the fly.

## Dry run

Input: nums = [1, 2, 3, 4]

1. Pass 1 (Left Products):
```text
   - Initialize result array. leftProduct = 1.
   - i=0: result[0] = 1. New leftProduct = 1 * 1 = 1.
   - i=1: result[1] = 1. New leftProduct = 1 * 2 = 2.
   - i=2: result[2] = 2. New leftProduct = 2 * 3 = 6.
   - i=3: result[3] = 6. New leftProduct = 6 * 4 = 24.
   - Array state: [1, 1, 2, 6] (Each index holds product of elements to its left)
```

2. Pass 2 (Right Products):
```text
   - Initialize rightProduct = 1.
   - i=3: result[3] *= 1 -> 6.  New rightProduct = 1 * 4 = 4.
   - i=2: result[2] *= 4 -> 8.  New rightProduct = 4 * 3 = 12.
   - i=1: result[1] *= 12 -> 12. New rightProduct = 12 * 2 = 24.
   - i=0: result[0] *= 24 -> 24. New rightProduct = 24 * 1 = 24.
   - Final Array: [24, 12, 8, 6]
```

Time Complexity: O(N)
Space Complexity: O(1) (Output array doesn't count towards space complexity)
