# Design a Priority Queue (Classic Data Structure — no LC#, foundational)

Implement a generic Priority Queue backed by a binary heap stored in an
array. The `compare(a, b)` function decides priority:
- Min Heap: compare = (a, b) => a < b   (smallest value has highest priority)
- Max Heap: compare = (a, b) => a > b   (largest value has highest priority)

Supports:
- push(x): insert an element — O(log n)
- pop(): remove and return the highest-priority element — O(log n)
- peek(): view the highest-priority element without removing — O(1)
- size(): number of elements — O(1)

Example 1 (Min Heap):
push 5, 3, 8, 1 → pop() → 1 → pop() → 3

Example 2 (Max Heap):
push 5, 3, 8, 1 → pop() → 8 → pop() → 5

## Approach

Array-Backed Binary Heap (Bubble Up / Bubble Down)

## Story / intuition

Store the heap as a flat array where node `i`'s children live at `2i+1`
and `2i+2`, and its parent at `floor((i-1)/2)` — no pointers needed.

push(x): append x at the end, then BUBBLE UP — repeatedly swap with its
parent while x has higher priority than the parent (per `compare`).

pop(): the root (index 0) is always the highest-priority element. Replace
it with the LAST element, shrink the array, then BUBBLE DOWN — repeatedly
swap with whichever child has higher priority, until the heap property
holds again.

The `compare` function is the ONLY thing that changes between a min-heap
and a max-heap — the bubble up/down mechanics are identical. This is the
generic building block reused conceptually by findKthLargest,
kClosestPointsToOrigin, mergeKSortedLists, etc.

DRY RUN (Min Heap, compare = (a,b) => a < b):
push(5) -> [5]
push(3) -> [5,3] -> 3<5, bubble up -> [3,5]
push(8) -> [3,5,8] -> 8<3? no, stays -> [3,5,8]
push(1) -> [3,5,8,1] -> 1<5(parent idx1)? yes, swap -> [3,1,8,5]
```text
                      -> 1<3(parent idx0)? yes, swap -> [1,3,8,5]
```

pop() -> return 1. Move last (5) to root -> [5,3,8]
```text
         bubble down: children of 5 are 3,8; smallest child=3 <5? yes, swap -> [3,5,8]
         children of idx1(5): none in range -> done. Returns 1.
```

pop() -> return 3. Move last (8) to root -> [8,5]
```text
         bubble down: child 5 < 8? yes, swap -> [5,8]. Returns 3.
```

Time:  O(log n) for push/pop, O(1) for peek/size
Space: O(n) — the underlying array
