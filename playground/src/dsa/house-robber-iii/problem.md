# House Robber III (LeetCode #337)

> House Robber III (LeetCode #337)

The thief has found a new place for his thievery. The houses form a
binary tree — the root is the only entrance. If two directly-linked
houses (a node and its child) are both robbed on the same night, an
alarm goes off.

Given the root of the binary tree, return the maximum amount of money
the thief can rob WITHOUT alerting the police.

Example 1:
```text
      3
     / \
    2   3
     \   \
      3   1
```

Input: root = [3,2,3,null,3,null,1]
Output: 7
Explanation: Rob 3 + 3 + 1 = 7 (the root's grandchildren).

Example 2:
```text
        3
       / \
      4   5
     / \   \
    1   3   1
```

Input: root = [3,4,5,1,3,null,1]
Output: 9
Explanation: Rob 4 + 5 = 9 (neither is the other's parent/child).

Constraints:
- The number of nodes is in the range [1, 10^4].
- 0 <= Node.val <= 10^4
