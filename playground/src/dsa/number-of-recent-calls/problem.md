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
