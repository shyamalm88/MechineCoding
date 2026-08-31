# Course Schedule III (LeetCode #630)

courses[i] = [duration_i, lastDay_i] means course i takes duration_i days
and must be FINISHED on or before lastDay_i. You start on day 1 and can take
only one course at a time. Return the maximum number of courses you can take.

Example 1:
Input: courses = [[100,200],[200,1300],[1000,1250],[2000,3200]] → Output: 3
Example 2:
Input: courses = [[1,2]] → Output: 1
Example 3:
Input: courses = [[3,2],[4,3]] → Output: 0

Constraints:
- 1 <= courses.length <= 10^4
- 1 <= duration_i, lastDay_i <= 10^4

## Approach

Sort by Deadline + Max-Heap "Regret" Swap

## Story / intuition

Sort by DEADLINE ascending and consider courses in that order — a deadline is
a hard wall, and there is never a reason to consider a later-deadline course
before an earlier one.

Take each course optimistically. When one no longer fits, do NOT simply drop
it — that is where a naive greedy fails. Instead ask: is this new course
SHORTER than the longest course I have already committed to? If so, swap them.
Course COUNT is unchanged, but total time spent drops, which frees room for
everything still to come. This "undo my worst past decision" move is called a
REGRET heap, and it is the pattern worth internalising here.

A max-heap keyed on duration gives O(log N) access to that worst commitment.

## Why the greedy choice is safe

Invariant: after processing the first i courses, the heap holds a maximum-size
feasible set among them AND, among all such maximum-size sets, one with the
smallest total duration. Both halves matter — minimal total time is what keeps
the most room available for future courses, so a maximum-size set with minimum
time is never worse than any other maximum-size set. The swap step preserves
exactly this: size stays the same, time strictly decreases.

Note we only need `time + duration <= lastDay` (not per-course start times),
because courses taken in deadline order can always be scheduled back-to-back.

## Dry run

[[100,200],[200,1300],[1000,1250],[2000,3200]]
sorted by deadline → [100,200], [1000,1250], [200,1300], [2000,3200]
[100,200]:   0+100 = 100 <= 200   → take.  time=100,  heap{100}
[1000,1250]: 100+1000 = 1100 <= 1250 → take. time=1100, heap{1000,100}
[200,1300]:  1100+200 = 1300 <= 1300 → take. time=1300, heap{1000,200,100}
[2000,3200]: 1300+2000 = 3300 > 3200 → doesn't fit.
```text
             Is 2000 < heap max 1000? No → skip.
```

heap size 3 → answer 3

Time:  O(N log N)
Space: O(N)

 Minimal binary max-heap — the files here are self-contained by convention.

## Regret

swap out the longest course taken so far. Same count, less
