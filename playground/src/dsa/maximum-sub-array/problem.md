# Maximum Subarray (LeetCode #53)

Given an integer array nums, find the subarray with the largest sum,
and return its sum.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

## Approach

Kadane's Algorithm

## Intuition

We iterate through the array maintaining a running sum (`currentSum`).
At each step, we face a choice:
1. Extend the existing subarray by adding the current number.
2. Start a new subarray from the current number (discarding the previous sum).

We choose option 2 if the previous running sum was negative (or effectively,
if `currentSum + num < num`).

## Dry run

Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

1. Initialize: currentSum = -2, maxSum = -2

2. i=1, num=1:
```text
   - currentSum = Math.max(1, -2 + 1) = 1. (Start new subarray)
   - maxSum = Math.max(-2, 1) = 1.
```

3. i=2, num=-3:
```text
   - currentSum = Math.max(-3, 1 - 3) = -2. (Extend)
   - maxSum = 1.
```

4. i=3, num=4:
```text
   - currentSum = Math.max(4, -2 + 4) = 4. (Start new)
   - maxSum = 4.
```

5. i=4, num=-1:
```text
   - currentSum = Math.max(-1, 4 - 1) = 3. (Extend)
   - maxSum = 4.
```

6. i=5, num=2:
```text
   - currentSum = Math.max(2, 3 + 2) = 5. (Extend)
   - maxSum = 5.
```

7. i=6, num=1:
```text
   - currentSum = Math.max(1, 5 + 1) = 6. (Extend)
   - maxSum = 6.
```

Result: 6 (Subarray [4, -1, 2, 1])

Time Complexity: O(N)
Space Complexity: O(1)
