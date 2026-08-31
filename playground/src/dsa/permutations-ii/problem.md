# Permutations II (LeetCode #47)

Given a collection of numbers, nums, that might contain duplicates, return
all possible unique permutations in any order.

Example 1:
Input: nums = [1,1,2]
Output: [[1,1,2],[1,2,1],[2,1,1]]

Example 2:
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

Constraints:
- 1 <= nums.length <= 8
- -10 <= nums[i] <= 10

## Approach

Backtracking with a `used` array + sort-and-skip dedup

## Story / intuition

This is `permutations.js` (LC46) plus ONE extra rule to avoid generating
the same permutation twice when duplicate values exist.

SORT the array first — this makes duplicate values sit next to each other.
At each recursion level, we're choosing "what goes in this slot next."
If two candidates have the SAME VALUE, picking either one leads to the
exact same set of future permutations — so only let ONE of them go first.

The rule: skip `nums[i]` if `nums[i] === nums[i-1]` AND `nums[i-1]` is
NOT currently used. "Not used" means the earlier duplicate is sitting on
the bench, available for THIS slot too — so this branch is a redundant
copy of the branch where the earlier duplicate gets picked instead.

## Dry run

nums = [1,1,2]  (sorted: [1,1,2], indices 0,1,2)

Slot 1:
```text
  i=0 (val=1, unused): pick → current=[1], used=[T,F,F]
    Slot 2:
      i=1 (val=1, unused, prev(i=0) IS used → don't skip): pick → [1,1]
        Slot 3: i=2 (val=2) → [1,1,2] ✓ COMPLETE
      i=2 (val=2, unused): pick → [1,2]
        Slot 3: i=1 (val=1, prev(i=0) IS used → don't skip) → [1,2,1] ✓ COMPLETE
  i=1 (val=1, unused, prev(i=0) NOT used → SKIP — redundant with i=0 above)
  i=2 (val=2, unused): pick → current=[2], used=[F,F,T]
    Slot 2:
      i=0 (val=1, unused) → [2,1]
        Slot 3: i=1 (val=1, prev(i=0) IS used → don't skip) → [2,1,1] ✓ COMPLETE
      i=1 (val=1, unused, prev(i=0) NOT used → SKIP)
```

Result: [[1,1,2],[1,2,1],[2,1,1]] ✓

Time:  O(N! * N) — generating all permutations, each of length N
Space: O(N) — recursion depth + `used` array
