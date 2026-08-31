# Number of Recent Calls (LeetCode #933)

Implement RecentCounter that counts the number of requests in the past 3000ms.
ping(t) adds a new request at time t and returns the count of requests in [t-3000, t].
It is guaranteed that every call to ping uses a strictly larger value of t.

Example:
Input: ["RecentCounter","ping","ping","ping","ping"]
```text
       [[],[1],[100],[3001],[3002]]
```

Output: [null, 1, 2, 3, 3]

Constraints:
- 1 <= t <= 10^9
- Each call to ping uses strictly increasing t
- At most 10^4 calls to ping

## Approach

Sliding Window with Queue

## Story / intuition

Think of it as a conveyor belt that only shows the last 3 seconds.
Every ping gets added to the belt (queue). But old pings (before t-3000)
are so far back they've fallen off the front. We trim the front of the
queue to keep only the relevant window.

Because pings always arrive in order (increasing t), the queue front is
always the oldest — the only place stale entries can be.

## Dry run

ping(1):    queue=[1]           → trim none → size=1
ping(100):  queue=[1,100]       → trim none → size=2
ping(3001): queue=[1,100,3001]  → trim 1 (1 < 3001-3000=1? No, 1 is exactly the boundary) → size=3
```text
            Actually [1,100,3001]: t-3000=1, so 1 >= 1 stays → size=3
```

ping(3002): queue=[1,100,3001,3002] → trim 1 (1 < 3002-3000=2) → queue=[100,3001,3002] → size=3

Time:  Amortized O(1) per ping (each element added/removed once)
Space: O(1) — queue holds at most 3000 elements (one per ms)
