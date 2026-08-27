# Design a Priority Queue (Classic Data Structure — no LC#, foundational)

## Category

🔵 CORE (Generic Binary Heap — building block for many Heap problems)
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
