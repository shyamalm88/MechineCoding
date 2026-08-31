# K Closest Points to Origin (LeetCode #973)

Given an array of points on a 2D plane and an integer k, return the k
closest points to the origin (0, 0). Distance = sqrt(x² + y²).
The answer may be returned in any order.

Example 1:
Input: points=[[1,3],[-2,2]], k=1 → Output: [[-2,2]]
(sqrt(1+9)=√10 vs sqrt(4+4)=√8, so (-2,2) is closer)

Example 2:
Input: points=[[3,3],[5,-1],[-2,4]], k=2 → Output: [[3,3],[-2,4]]

Constraints:
- 1 <= k <= points.length <= 10^4
- -10^4 <= xi, yi <= 10^4

## Approach

Max-Heap of size K

## Story / intuition

Keep a "VIP club" of K closest points. For each new point:
- Add it to the club.
- If club size > K, evict the FARTHEST member (max-heap top).
After all points, the K members left are the K closest.

Use a MAX-HEAP keyed by distance² (skip sqrt — same ordering).
Negate distance to use MinHeap as MaxHeap (or implement MaxHeap).

## Alternative

QuickSelect — O(N) average, but O(N²) worst case.
Heap approach is O(N log K) and simpler to explain in interview.

## Dry run

points=[[1,3],[-2,2],[5,0]], k=2
dist²: [10, 8, 25]
push [1,3]  → heap(max): {10}    size=1
push [-2,2] → heap: {10,8}  size=2
push [5,0]  → heap: {10,8,25} size=3 > 2 → pop max(25) → {10,8}
Result: [[1,3],[-2,2]] ✓

Time:  O(N log K)
Space: O(K)
