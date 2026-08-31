# Maximum Product Subarray (LeetCode #152)

Given an integer array nums, find a subarray that has the largest product,
and return the product.

Example 1:
Input: nums = [2,3,-2,4]
Output: 6
Explanation: [2,3] has the largest product 6.

Example 2:
Input: nums = [-2,0,-1]
Output: 0
Explanation: The result cannot be 2, because [-2,-1] is not a subarray.

Constraints:
- 1 <= nums.length <= 2 * 10^4
- -10 <= nums[i] <= 10

## Approach

Dynamic Programming (Tracking Min and Max)

## Intuition

This is similar to Kadane's algorithm, but with a twist.
Since we are dealing with products, a negative number can flip the smallest
product (a large negative number) into the largest product.

Therefore, we must keep track of both the `maxProd` and `minProd` ending at
the current position.

At each step, the new max product can come from:
1. The current number itself.
2. The current number * previous max product.
3. The current number * previous min product (if current number is negative).

## Dry run

Input: nums = [-2, 3, -4]

1. Initialize:
```text
   - maxProd = -2, minProd = -2, result = -2
```

2. i=1, x=3:
```text
   - prevMax = -2, prevMin = -2
   - maxProd = Math.max(3, 3*-2, 3*-2) = 3
   - minProd = Math.min(3, 3*-2, 3*-2) = -6
   - result = Math.max(-2, 3) = 3
```

3. i=2, x=-4:
```text
   - prevMax = 3, prevMin = -6
   - maxProd = Math.max(-4, -4*3, -4*-6) = Math.max(-4, -12, 24) = 24
     (Notice how minProd (-6) * negative (-4) became the new max!)
   - minProd = Math.min(-4, -4*3, -4*-6) = -12
   - result = Math.max(3, 24) = 24
```

Time Complexity: O(N)
Space Complexity: O(1)
