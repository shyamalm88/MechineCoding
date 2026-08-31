# Find Median from Data Stream (LeetCode #295)

Design a data structure that supports:
- addNum(num): add a number to the stream
- findMedian(): return the median of all numbers so far

Example:
addNum(1) → addNum(2) → findMedian() = 1.5
addNum(3) → findMedian() = 2.0

Constraints:
- -10^5 <= num <= 10^5
- At most 5 * 10^4 calls to addNum and findMedian
- findMedian will only be called after at least one addNum

## Approach

Two Heaps — MaxHeap (lower half) + MinHeap (upper half)

## Story / intuition

Split all numbers into two halves:
```text
  - lo: MaxHeap holding the LOWER half  (top = largest of lower half)
  - hi: MinHeap holding the UPPER half  (top = smallest of upper half)
```

Invariants after every addNum:
```text
  1. lo.size == hi.size  OR  lo.size == hi.size + 1  (lo has equal or one extra)
  2. lo.top() <= hi.top()  (lower half is truly lower)
```

findMedian:
```text
  - Odd total → median = lo.top()
  - Even total → median = (lo.top() + hi.top()) / 2
```

ADDING A NUMBER (always balance after add):
```text
  1. Push to lo (max-heap).
  2. Move lo's max to hi (ensures lo.top <= hi.top).
  3. If hi.size > lo.size, move hi's min back to lo (rebalance).
```

## Dry run

add(1), add(2), add(3)
add(1): lo=[1], hi=[]      → lo.size=1, hi.size=0  → median=1
add(2): push 2→lo=[1,2], move lo.max(2)→hi=[2], hi.size=lo.size → move hi.min(2)→lo=[1,2] → median=(1+2)/2=1.5?
```text
        Wait: lo=[2,1] max-heap. After step2: lo=[1], hi=[2]. Balanced.
        median=(1+2)/2=1.5 ✓
```

add(3): push 3→lo=[3,1]. Move lo.max(3)→hi=[2,3]. hi.size > lo.size → move hi.min(2)→lo=[2,1].
```text
        lo=[2,1], hi=[3]. median=lo.top()=2 ✓
```

Time:  O(log N) addNum, O(1) findMedian
Space: O(N)
