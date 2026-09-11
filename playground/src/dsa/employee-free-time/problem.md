# Employee Free Time (LeetCode #759)

You are given schedule, a list of employees. Each employee is a list of
non-overlapping intervals sorted by start time, representing when they are
WORKING.

Return the list of finite intervals, sorted, representing the time that is
COMMON AND POSITIVE-LENGTH free time for ALL employees.

Example 1:
Input:  [[[1,2],[5,6]], [[1,3]], [[4,10]]]
Output: [[3,4]]
(Everyone is busy 1-3 and 4-10; the only shared gap is 3 to 4.)

Example 2:
Input:  [[[1,3],[6,7]], [[2,4]], [[2,5],[9,12]]]
Output: [[5,6],[7,9]]

Constraints:
- 1 <= schedule.length, schedule[i].length <= 50
- 0 <= start < end <= 10^8
- Each employee's own intervals are sorted and non-overlapping

## Note

the answer is FINITE time only. The stretch before the first meeting
and the stretch after the last are unbounded, so neither is reported.

## Approach

Flatten, Sort by Start, Then Read the Gaps

## Story / intuition

The per-employee grouping is a decoy. "Free for EVERYONE" means no employee
is working, and an interval blocks that moment regardless of whose it is. So
throw the employee boundaries away, pour every interval into one list, and
sort by start time.

Now walk left to right tracking the furthest point anyone is busy until --
call it `busyUntil`. For each interval:

```text
  - starts AFTER busyUntil  -> nobody was working in between. That is a gap.
  - starts at or before it  -> overlaps the block we are in; just extend
                              busyUntil if this one runs later.
```

That is Merge Intervals with the output inverted: instead of emitting the
merged blocks, emit the space BETWEEN them.

THE TRAP -- take the MAX, do not just assign:
```text
  busyUntil = Math.max(busyUntil, end)
```

A fully nested interval like [1,10] followed by [2,3] would otherwise pull
busyUntil backwards from 10 to 3 and invent a free slot from 3 to the next
start, when everyone is in fact busy until 10. Sorting by START does not
order the ENDS, so nesting is normal, not an edge case.

## Why positive length matters

two meetings touching exactly ([1,3] then
[3,5]) leave a gap of zero minutes. Testing `start > busyUntil` rather than
`>=` keeps those out.

## Dry run

[[[1,3],[6,7]], [[2,4]], [[2,5],[9,12]]]
flattened + sorted by start:
```text
  [1,3] [2,4] [2,5] [6,7] [9,12]
```

busyUntil = 3          after [1,3]
[2,4]: 2 > 3? no  -> busyUntil = max(3,4) = 4
[2,5]: 2 > 4? no  -> busyUntil = max(4,5) = 5
[6,7]: 6 > 5? YES -> free [5,6];  busyUntil = 7
[9,12]: 9 > 7? YES -> free [7,9]; busyUntil = 12
answer [[5,6],[7,9]]

Time:  O(N log N) for N intervals total -- the sort dominates
Space: O(N) for the flattened list

FOLLOW-UP worth knowing: with K employees each already sorted, a min-heap
seeded with one interval per employee merges them in O(N log K) instead of
re-sorting everything. Better when K is far smaller than N; the flatten-and-
sort version is what to write first.
