# Subsets II (LeetCode #90)

Given an integer array nums that may contain duplicates,
return all possible UNIQUE subsets.

Example:

```text
  nums = [1,2,2]
```

```text
  Output:
  [
    [],
    [1],
    [1,2],
    [1,2,2],
    [2],
    [2,2]
  ]
```

INTUITION

This looks like subsets,
BUT duplicates break naive recursion.

Key Insight (CRITICAL):

```text
  Duplicates only cause problems at the SAME recursion depth.
```

Solution:
- Sort the array
- Skip duplicates WHEN they appear at the same level

BACKTRACKING STATE

State:
- path
- start index

DUPLICATE RULE (VERY IMPORTANT)

If:
```text
  i > start AND nums[i] === nums[i - 1]
```

Then:
```text
  skip nums[i]
```

Why?
- Prevents generating identical subsets

TIME COMPLEXITY

O(2^n)

WHY THIS IS 🟢 IMPORTANT

Duplicate handling is one of the MOST common
backtracking interview mistakes.
