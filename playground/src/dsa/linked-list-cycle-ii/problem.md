# Linked List Cycle II (LeetCode #142)

Given the head of a linked list, return the node where the cycle begins.
If there is no cycle, return null.

Example 1:
Input: head = [3,2,0,-4], tail connects to node index 1 (value 2)
Output: the node with value 2

Example 2:
Input: head = [1,2], tail connects to node index 0 (value 1)
Output: the node with value 1

Example 3:
Input: head = [1], no cycle
Output: null

Constraints:
- 0 <= number of nodes <= 10^4
- -10^5 <= Node.val <= 10^5
- Follow up: solve in O(1) extra space
