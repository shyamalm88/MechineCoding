# Find All Duplicates in an Array (LeetCode #442)

Given an integer array nums of length n where all the integers of nums are
in the range [1, n] and each integer appears once or twice, return an array
of all the integers that appears twice.

You must write an algorithm that runs in O(n) time and uses only constant
extra space.

Example 1:
Input: nums = [4,3,2,7,8,2,3,1]
Output: [2,3]

Example 2:
Input: nums = [1,1,2]
Output: [1]

Example 3:
Input: nums = [1]
Output: []

Constraints:
- n == nums.length
- 1 <= n <= 10^5
- 1 <= nums[i] <= n
- Each element in nums appears once or twice.

## Approach

Index Marking (In-place Hashing)

## Intuition

Since the numbers are in the range [1, n], we can use the input array itself
as a hash map. The value `x` maps to index `x-1`.

We iterate through the array. For each number `x` (taking absolute value):
1. Calculate the target index: `index = abs(x) - 1`.
2. Check the value at `nums[index]`.
```text
   - If it's negative, it means we have seen this index before (marked by a previous instance of `x`).
     Therefore, `x` is a duplicate.
   - If it's positive, we flip it to negative to mark that we have seen `x`.
```

## Dry run

Input: nums = [4, 3, 2, 7, 8, 2, 3, 1]

1. i=0, val=4:
```text
   - index = 3. nums[3] (7) > 0. Flip to -7.
   - Array: [4, 3, 2, -7, 8, 2, 3, 1]
```

2. i=1, val=3:
```text
   - index = 2. nums[2] (2) > 0. Flip to -2.
   - Array: [4, 3, -2, -7, 8, 2, 3, 1]
```

3. i=2, val=2 (abs(-2)):
```text
   - index = 1. nums[1] (3) > 0. Flip to -3.
   - Array: [4, -3, -2, -7, 8, 2, 3, 1]
```

4. i=3, val=7 (abs(-7)):
```text
   - index = 6. nums[6] (3) > 0. Flip to -3.
   - Array: [4, -3, -2, -7, 8, 2, -3, 1]
```

5. i=4, val=8:
```text
   - index = 7. nums[7] (1) > 0. Flip to -1.
   - Array: [4, -3, -2, -7, 8, 2, -3, -1]
```

6. i=5, val=2:
```text
   - index = 1. nums[1] (-3) < 0. SEEN BEFORE!
   - Add 2 to result. Result: [2]
```

7. i=6, val=3:
```text
   - index = 2. nums[2] (-2) < 0. SEEN BEFORE!
   - Add 3 to result. Result: [2, 3]
```

8. i=7, val=1 (abs(-1)):
```text
   - index = 0. nums[0] (4) > 0. Flip to -4.
```

Result: [2, 3]

Time Complexity: O(N) - Single pass.
Space Complexity: O(1) - We modify the input array in place (output array doesn't count).
