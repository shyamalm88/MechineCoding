# First Missing Positive (LeetCode #41) ⭐ HARD

Given an unsorted integer array nums, return the smallest missing positive integer.
Must run in O(N) time and O(1) space.

Example 1:
Input: nums=[1,2,0]  → Output: 3
Example 2:
Input: nums=[3,4,-1,1] → Output: 2
Example 3:
Input: nums=[7,8,9,11,12] → Output: 1

Constraints:
- 1 <= nums.length <= 5 * 10^5
- -2^31 <= nums[i] <= 2^31 - 1

## Approach

Array as Hashmap (Index Placement / Cyclic Sort Idea)

## Story / intuition

## Key insight

The answer must be in range [1, n+1] where n = array length.
Why? If array contains all of 1..n, answer = n+1. Otherwise answer is in 1..n.

Use the array ITSELF as a hashmap: value x should be placed at index x-1.
After rearranging, the first index i where nums[i] != i+1 gives the answer: i+1.

REARRANGING STEP (Cyclic Sort):
For each i: while nums[i] is in [1,n] AND nums[nums[i]-1] != nums[i]
```text
  → swap nums[i] into its "correct" position nums[i]-1.
  The while condition prevents infinite loops on duplicates.
```

## Dry run

nums=[3,4,-1,1], n=4
Place step:
i=0, nums[0]=3: place 3 at index 2. swap(0,2) → [-1,4,3,1]. nums[0]=-1 → not in [1,4]. stop.
i=1, nums[1]=4: place 4 at index 3. swap(1,3) → [-1,1,3,4]. nums[1]=1 → place at 0. swap(1,0) → [1,-1,3,4]. nums[1]=-1 → stop.
i=2, nums[2]=3: already at right place (3 at index 2). stop.
i=3, nums[3]=4: already at right place. stop.
Array after: [1,-1,3,4]
Scan: i=0: 1==1 ✓. i=1: -1≠2 → return 2 ✓

Time:  O(N) — each element swapped at most once
Space: O(1)
