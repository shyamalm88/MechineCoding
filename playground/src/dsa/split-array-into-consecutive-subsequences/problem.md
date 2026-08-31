# Split Array into Consecutive Subsequences (LeetCode #659)

You are given a SORTED integer array nums (non-decreasing). Determine if it
can be split into one or more subsequences such that each subsequence is a
run of consecutive integers of length AT LEAST 3.

Example 1:
Input: nums = [1,2,3,3,4,5] → Output: true   ([1,2,3] and [3,4,5])
Example 2:
Input: nums = [1,2,3,3,4,4,5,5] → Output: true ([1,2,3,4,5] and [3,4,5])
Example 3:
Input: nums = [1,2,3,4,4,5] → Output: false

Constraints:
- 1 <= nums.length <= 10^4
- -1000 <= nums[i] <= 1000
- nums is sorted in non-decreasing order

## Approach

Two Maps — Prefer EXTENDING an Existing Run Over Starting a New One

## Story / intuition

Process numbers in order. For each number x you face exactly one decision:

```text
  (a) APPEND x to a run that currently ends at x-1, or
  (b) START a fresh run x, x+1, x+2 (needs all three to be available).
```

The greedy rule is: ALWAYS PREFER (a).

Two maps carry the state:
```text
  count — how many of each value are still unused
  end   — how many runs currently END at each value (i.e. are hungry for
          value+1)
```

## Why the greedy choice is safe

Appending is free: it consumes only x and leaves an equally hungry run
(now ending at x) behind, so the "capacity to absorb future numbers" is
unchanged. Starting a new run instead consumes x PLUS x+1 and x+2, and leaves
the old run stranded at length < 3 unless something else rescues it. So
appending is never worse — it dominates on every axis. Only when no run is
waiting for x are we forced into option (b), and if that fails too, no valid
split exists.

## Dry run

[1,2,3,3,4,5]
counts {1:1,2:1,3:2,4:1,5:1}
x=1: no run ends at 0 → start [1,2,3]. count{3:1,4:1,5:1}, end{3:1}
x=2: count[2] is 0 → already consumed, skip
x=3: count[3]=1. A run ends at 2? end[2]=0. Start [3,4,5]? 4 and 5 available
```text
     → yes. end{3:1, 5:1}
```

x=3 (2nd): count[3] now 0 → skip
x=4, x=5: consumed → skip
→ TRUE

## Dry run

[1,2,3,4,4,5]  → after [1,2,3] is formed, the stray 4 finds a run
ending at 3 and extends it to [1,2,3,4]; the second 4 has no run at 3 left
and cannot start [4,5,6] (no 6) → FALSE

Time:  O(N)
Space: O(N) for the two maps
