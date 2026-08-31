# Sort Colors (LeetCode #75)

Given an array nums with n objects colored red, white, or blue, sort them
in-place so that objects of the same color are adjacent, with the colors
in the order red, white, and blue.

We will use the integers 0, 1, and 2 to represent the color red, white,
and blue, respectively.

You must solve this problem without using the library's sort function.

Example 1:
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]

Example 2:
Input: nums = [2,0,1]
Output: [0,1,2]

Constraints:
- n == nums.length
- 1 <= n <= 300
- nums[i] is either 0, 1, or 2.

## Approach

Three Pointers (Dutch National Flag Algorithm)

## Intuition

We want to partition the array into three sections:
[0s ... 1s ... 2s]

We use three pointers:
- `low`: The boundary for 0s (everything before `low` is 0).
- `mid`: The current element we are inspecting.
- `high`: The boundary for 2s (everything after `high` is 2).

Logic:
- If nums[mid] == 0: Swap with `low`, increment both `low` and `mid`.
- If nums[mid] == 1: It's in the correct middle section, just increment `mid`.
- If nums[mid] == 2: Swap with `high`, decrement `high`. Do NOT increment `mid`
```text
  because the swapped element from `high` hasn't been inspected yet.
```

Time Complexity: O(N) - One pass.
Space Complexity: O(1) - In-place.
