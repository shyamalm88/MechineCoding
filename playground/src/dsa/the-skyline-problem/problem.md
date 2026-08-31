# The Skyline Problem (LeetCode #218)

A city's skyline is the outer contour of the silhouette formed by all the
buildings. Given `buildings` where buildings[i] = [left_i, right_i, height_i],
return the skyline as a list of "key points" [x, height] in left-to-right
order, where each key point is the LEFT endpoint of a horizontal segment.
The last key point has height 0, marking the end of the skyline. Consecutive
key points must NOT have the same height.

Example 1:
Input: buildings=[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]

Example 2:
Input: buildings=[[0,2,3],[2,5,3]]
Output: [[0,3],[5,0]]

Constraints:
- 1 <= buildings.length <= 10^4
- buildings[i].length == 3
- 0 <= left_i < right_i <= 2^31 - 1
- 1 <= height_i <= 2^31 - 1

## Approach

Sweep Line over Critical X-Coordinates + Max-Heap (Lazy Eviction)

## Story / intuition

The skyline only changes HEIGHT at a building's LEFT or RIGHT edge — those
are the only "events" that matter. Collect all such x-coordinates, sort
them, and sweep left to right. At each x, the current skyline height is the
MAX height among all buildings that are "active" (started but not yet
ended) at that x.

Encode events as [x, height, isStart]:
```text
  - START event:  height is POSITIVE  (building begins)
  - END event:    height is NEGATIVE  (building ends)
```

Sort events by x; if x ties, process STARTS before ENDS at the SAME x is
WRONG for max — actually we need: at a tie, process in an order such that
a building ending at x and one starting at x are both reflected correctly.
The simplest robust trick: sort by x, and for ties sort START events
(positive height) before END events (negative height) — but break further
ties among starts by LARGER height first, and among ends by SMALLER height
first. This guarantees the heap always reflects the correct max exactly
when we query it.

Use a MAX-HEAP of active heights with LAZY EVICTION: instead of removing an
ended building's height immediately (heaps don't support efficient
arbitrary delete), keep a `count` map of how many times each height is
currently active. On an END event, decrement the count. Before reading the
heap's max, pop off any heights whose count has dropped to 0.

At each distinct x, after processing all events at that x, compare the new
max height (0 if heap is empty) to the previous max. If it changed, emit
`[x, newMax]`.

## Dry run

buildings=[[0,2,3],[2,5,3]]
events: [0,3,start], [2,-3,end], [2,3,start], [5,-3,end]
sorted (x, then starts-by-desc-height before ends-by-asc-height):
```text
  [0,3,start], [2,3,start], [2,-3,end], [5,-3,end]
```

x=0: push 3 -> active={3:1}, max=3, prevMax=0 -> emit [0,3]
x=2: push 3 -> active={3:2}; then end -3 -> active={3:1}, max=3,
```text
      prevMax=3 -> no change, no emit
```

x=5: end -3 -> active={3:0}, lazy-evict -> heap empty, max=0,
```text
      prevMax=3 -> emit [5,0]
```

Result: [[0,3],[5,0]] ✓

Time:  O(N log N) — sorting 2N events + heap ops
Space: O(N) — events array, heap, and count map
