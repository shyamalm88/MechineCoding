# Critical Connections in a Network (LeetCode #1192)

## Category

🔴 VVIMP (Tarjan's Bridge-Finding Algorithm)
There are `n` servers numbered from 0 to n-1 connected by undirected
server-to-server `connections`. A CRITICAL CONNECTION is a connection
that, if removed, would split the network into two or more disconnected
groups (i.e., it's a "bridge" — not part of any cycle).

Return all critical connections, in any order.

Example 1:
Input: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]
Output: [[1,3]]
Explanation: 0-1-2-0 forms a cycle (none of those edges are critical),
but 1-3 is the only link to server 3 — removing it isolates server 3.

Example 2:
Input: n = 2, connections = [[0,1]]
Output: [[0,1]]

Constraints:
- 1 <= n <= 10^5
- n-1 <= connections.length <= 10^5
- The graph is guaranteed connected, with no repeated/self connections.
