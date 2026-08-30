# Assign Cookies (LeetCode #455)

Each child i has a greed factor g[i] — the minimum cookie size that will
content them. Each cookie j has size s[j]. A cookie can be given to at most
one child, and a child can receive at most one cookie. A child is content if
s[j] >= g[i]. Return the maximum number of content children.

Example 1:
Input: g = [1,2,3], s = [1,1] → Output: 1
(Only the child with greed 1 can be satisfied.)

Example 2:
Input: g = [1,2], s = [1,2,3] → Output: 2

Constraints:
- 1 <= g.length <= 3 * 10^4
- 0 <= s.length <= 3 * 10^4
- 1 <= g[i], s[j] <= 2^31 - 1
