# Next Permutation (LeetCode #31)

A permutation of an array of integers is an arrangement of its members into
a sequence or linear order.

The next permutation of an array of integers is the next lexicographically
greater permutation of its integer. If such an arrangement is not possible,
the array must be rearranged as the lowest possible order (i.e., sorted in
ascending order).

The replacement must be in place and use only constant extra memory.

Example 1:
Input: nums = [1,2,3]
Output: [1,3,2]

Example 2:
Input: nums = [3,2,1]
Output: [1,2,3]

Constraints:
- 1 <= nums.length <= 100

## Approach

Single Pass (Find Pivot -> Swap -> Reverse)

## Intuition

1. Find the first pair from the right where nums[i] < nums[i+1]. This `i` is the pivot.
2. If no pivot (entirely descending), reverse the whole array (lowest permutation).
3. Else, find the smallest number in the suffix that is larger than nums[i]. Swap them.
4. Reverse the suffix (from i+1 to end) to make it the smallest possible suffix.

## Dry run

Input: nums = [1, 3, 5, 4, 2]

1. Find Pivot:
```text
   - Loop runs while nums[i] >= nums[i+1] (skipping descending sequence).
   - i=3: 4 >= 2? Yes. Continue loop (i--).
   - i=2: 5 >= 4? Yes. Continue loop (i--).
   - i=1: 3 >= 5? No. Loop ends. Pivot found at index 1 (value 3).
```

2. Find Successor:
```text
   - Loop runs while nums[j] <= pivot (skipping smaller/equal elements).
   - j=4: 2 <= 3? Yes. Continue loop (j--).
   - j=3: 4 <= 3? No. Loop ends. Successor found at index 3 (value 4).
```

3. Swap Pivot and Successor:
```text
   - Swap nums[1] and nums[3].
   - Array becomes: [1, 4, 5, 3, 2]
```

4. Reverse Suffix:
```text
   - Reverse elements after index 1 (i.e., [5, 3, 2]).
   - [5, 3, 2] becomes [2, 3, 5].
   - Final Array: [1, 4, 2, 3, 5]
```

Time Complexity: O(N)
Space Complexity: O(1)

@param {number[]} nums
@return {void} Do not return anything, modify nums in-place.
