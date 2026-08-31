# Path Sum III (LeetCode #437)

Given the root of a binary tree and an integer targetSum, return the
number of paths where the sum of the values along the path equals
targetSum.

The path does not need to start or end at the root or a leaf, but it
must go downwards (i.e., traveling only from parent nodes to child nodes).

Example 1:
```text
             10
            /  \
           5   -3
          / \    \
         3   2    11
        / \   \
       3  -2   1
```

Input: root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
Output: 3
Explanation: The paths that sum to 8 are:
```text
  1. 5 → 3
  2. 5 → 2 → 1
  3. -3 → 11
```

Example 2:
Input: root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
Output: 3

Constraints:
- The number of nodes in the tree is in the range [0, 1000]
- -10^9 <= Node.val <= 10^9
- -1000 <= targetSum <= 1000

Approach 1: Brute Force - O(n²)
Approach 2: Prefix Sum with HashMap - O(n)

## Solution 1

Brute Force - O(n²)

## Intuition

A path can start at any node. So we must treat every node as a potential
starting point.

1. Traverse the entire tree (Outer DFS).
2. For every node visited, start a new search (Inner DFS) to see if any
```text
   downward path starting from *this* node sums to targetSum.
```

## Dry run

Tree: 10 -> 5 -> 3. Target: 8.

1. traverse(10):
```text
   - countPaths(10, 8):
     - Node 10. Rem: -2. (10 != 8)
     - countPaths(5, -2) -> Node 5. Rem: -7. (5 != -2)
     - countPaths(3, -7) -> Node 3. Rem: -10. (3 != -7)
   - traverse(5) (Left child):
     - countPaths(5, 8):
       - Node 5. Rem: 3. (5 != 8)
       - countPaths(3, 3) -> Node 3. Rem: 0. (3 == 3) -> MATCH!
   - traverse(3) (Left child of 5):
     - countPaths(3, 8):
       - Node 3. Rem: 5. (3 != 8)
```

@param {TreeNode} root
@param {number} targetSum
@return {number}

## Solution 2

Prefix Sum with HashMap - O(n)

INTUITION (Optimized Approach):
The problem asks for paths summing to targetSum that go downwards.
This is similar to the "Subarray Sum Equals K" problem (LeetCode 560),
but on a tree.

We can use the Prefix Sum technique:
1. Maintain a running sum (`currentSum`) from the root to the current node.
2. At any node, if `currentSum - targetSum` exists in our history of
```text
   prefix sums, it means there is a sub-path ending at the current node
   with sum equal to `targetSum`.
```

3. We use a HashMap to store the frequency of all prefix sums encountered
```text
   in the current path (from root to current node).
```

## Dry run

Tree:      10
```text
          /  \
         5   -3
        / \    \
       3   2    11
```

Target: 8

1. dfs(10, 0):
```text
   - currentSum = 10
   - needed = 10 - 8 = 2. Map {0:1}. No 2 found.
   - Map update: {0:1, 10:1}
```

```text
   2. dfs(5, 10) (Left child of 10):
      - currentSum = 15
      - needed = 15 - 8 = 7. Map {0:1, 10:1}. No 7 found.
      - Map update: {0:1, 10:1, 15:1}
```

```text
      3. dfs(3, 15) (Left child of 5):
         - currentSum = 18
         - needed = 18 - 8 = 10. Map has 10? Yes! (freq: 1)
         - count += 1 (Found path: 5 -> 3)
         - Map update: {..., 18:1}
         - ... (children return)
         - Backtrack: Remove 18 from Map.
```

```text
      - Backtrack: Remove 15 from Map.
```

Key insight: If prefixSum at node X minus prefixSum at ancestor Y equals
targetSum, then the path from Y to X sums to targetSum.

currentSum - targetSum = previousPrefixSum
means there exists a path ending at current node with sum = targetSum
