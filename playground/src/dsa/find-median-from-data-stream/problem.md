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
