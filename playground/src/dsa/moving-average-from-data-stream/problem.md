# Moving Average from Data Stream (LeetCode #346)

Given a stream of integers and a window size, calculate the moving average
of all integers in the sliding window.

Example:
const ma = new MovingAverage(3);
ma.next(1);  // 1.0       (window: [1])
ma.next(10); // 5.5       (window: [1,10])
ma.next(3);  // 4.66667   (window: [1,10,3])
ma.next(5);  // 6.0       (window: [10,3,5]) ← 1 evicted

Constraints:
- 1 <= size <= 1000
- -10^5 <= val <= 10^5
- At most 10^4 calls to next
