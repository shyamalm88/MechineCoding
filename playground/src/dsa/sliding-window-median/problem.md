# Sliding Window Median (LeetCode #480)

The median is the middle value in an ordered list. Given an array `nums`
and a window size `k`, return the median of each sliding window of size k
as the window moves from the very left to the very right of the array.

Example:
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [1,-1,-1,3,5,6]

Constraints:
1 <= k <= nums.length <= 2000
-2^31 <= nums[i] <= 2^31 - 1

## Approach

Maintain a Sorted Window, Binary-Search to Insert/Remove

## Story / intuition

A two-heap "lazy deletion" design is the classic textbook answer, but it's
fiddly to get right (tracking pending deletions across two heaps with
size-balance invariants). For k <= 2000, a much simpler approach is fast
enough: keep the current window as a SORTED array.

On each slide:
- Binary search for the value LEAVING the window and remove it (splice).
- Binary search for the insertion point of the value ENTERING the window
```text
  and insert it (splice).
```

- The median is then an O(1) lookup at the middle index/indices.

## Dry run

nums = [1,3,-1,-3,5,3,6,7], k = 3
 Initial window [1,3,-1] sorted -> [-1,1,3]. median = window[1] = 1
 Slide: remove 1 (leaving), insert -3 (entering) -> [-3,-1,3]. median = -1
 Slide: remove 3 (leaving), insert 5 (entering)  -> [-3,-1,5]. median = -1
 Slide: remove -1 (leaving), insert 3 (entering) -> [-3,3,5]. median = 3
 Slide: remove -3 (leaving), insert 6 (entering) -> [3,5,6]. median = 5
 Slide: remove 5 (leaving), insert 7 (entering)  -> [3,6,7]. median = 6
 Result: [1, -1, -1, 3, 5, 6]

Time:  O((N - k) * k) — each slide does O(log k) binary searches but
```text
       O(k) splices to shift array elements.
```

Space: O(k) for the sorted window.
