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

## Approach

Floyd's Tortoise and Hare (fast/slow pointers)

## Story / intuition

Two runners on a (possibly circular) track: `slow` moves 1 step at a time,
`fast` moves 2 steps. If there's no cycle, `fast` simply falls off the end
(hits null) first. If there IS a cycle, the faster runner eventually LAPS
the slower one and they meet somewhere INSIDE the loop.

THE TRICK (why phase 2 lands on the cycle's start):
Let `head -> cycle start` = a, `cycle start -> meeting point` = b, and the
rest of the loop back to start = c. At the meeting point:
```text
  slow traveled = a + b
  fast traveled = a + b + (b + c)   <- one extra full lap around the loop
  fast = 2 * slow  =>  a + 2b + c = 2(a + b)  =>  a = c
```

So "head -> cycle start" and "meeting point -> cycle start" are the SAME
distance. Reset one pointer to `head`, advance both 1 step at a time -
they meet exactly at the cycle's start.

Time:  O(N)
Space: O(1)
