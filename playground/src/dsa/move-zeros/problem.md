# Move Zeroes (LeetCode #283)

Given an integer array nums, move all 0's to the end of it while maintaining
the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.

Example 1:
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]

Example 2:
Input: nums = [0]
Output: [0]

Constraints:
- 1 <= nums.length <= 10^4
- -2^31 <= nums[i] <= 2^31 - 1

## Approach

Two Pointers (Snowball / Partitioning)

## Intuition

We need to group non-zero elements at the start of the array.
We can use two pointers:
- `slow`: Points to the position where the next non-zero element should go.
- `fast`: Iterates through the array to find non-zero elements.

Logic:
1. Iterate `fast` from 0 to n-1.
2. If `nums[fast]` is non-zero:
```text
   - Swap `nums[slow]` and `nums[fast]`.
   - Increment `slow`.
```

3. If `nums[fast]` is zero, just continue.

By doing this, all non-zero elements are moved to the left (at indices 0 to slow-1),
and zeros naturally accumulate to the right.

## Dry run

Input: nums = [0, 1, 0, 3, 12]

1. fast=0 (val=0): Zero. Skip.
```text
   Array: [0, 1, 0, 3, 12], slow=0
```

2. fast=1 (val=1): Non-zero. Swap(0, 1).
```text
   Array: [1, 0, 0, 3, 12], slow=1
```

3. fast=2 (val=0): Zero. Skip.
```text
   Array: [1, 0, 0, 3, 12], slow=1
```

4. fast=3 (val=3): Non-zero. Swap(1, 3).
```text
   Array: [1, 3, 0, 0, 12], slow=2
```

5. fast=4 (val=12): Non-zero. Swap(2, 4).
```text
   Array: [1, 3, 12, 0, 0], slow=3
```

Result: [1, 3, 12, 0, 0]

Time Complexity: O(N) - One pass.
Space Complexity: O(1) - In-place.
