# Heap Sort (Classic Algorithm — no LC#, foundational)

Sort an array of numbers in ascending order using a binary max-heap,
in-place, without relying on a separate heap data structure.

Example 1:
Input: [5,3,8,1,9,2] → Output: [1,2,3,5,8,9]

Example 2:
Input: [1] → Output: [1]

## Approach

Build Max-Heap, Then Repeatedly Extract the Max to the End

## Story / intuition

A binary heap can be stored implicitly inside a plain array: for index i,
its children live at 2i+1 and 2i+2. "Heapify" fixes the heap property at
one node by sinking it down if a child is larger.

PHASE 1 — Build: heapify every internal node from the last parent up to
the root. After this, arr[0] is the LARGEST element (max-heap property).

PHASE 2 — Extract: swap arr[0] (the max) with the last unsorted element,
shrink the "active heap" by one, and heapify the root again to restore the
property. Repeating this n-1 times leaves the array fully sorted, because
each extracted max lands in its correct final position at the end.

## Dry run

arr=[5,3,8,1,9,2]
Build max-heap -> [9,5,8,1,3,2]
Extract: swap(0,5) -> [2,5,8,1,3,9], heapify(0..4) -> [8,5,2,1,3 | 9]
Extract: swap(0,4) -> [3,5,2,1,8 | 9], heapify(0..3) -> [5,3,2,1 | 8,9]
Extract: swap(0,3) -> [1,3,2,5 | 8,9], heapify(0..2) -> [3,1,2 | 5,8,9]
Extract: swap(0,2) -> [2,1,3 | 5,8,9], heapify(0..1) -> [2,1 | 3,5,8,9]
Extract: swap(0,1) -> [1,2 | 3,5,8,9], heapify(0..0) -> [1,2,3,5,8,9]
Result: [1,2,3,5,8,9] ✓

Time:  O(N log N) — build is O(N), N extractions each O(log N)
Space: O(1) — sorts in place (recursion stack O(log N) for heapify)
