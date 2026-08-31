# Merge K Sorted Lists (LeetCode #23)

Given an array of k linked-lists, each sorted in ascending order,
merge all the linked-lists into one sorted linked-list.

Example 1:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]

Example 2:
Input: lists = [] → Output: []

Constraints:
- k == lists.length
- 0 <= k <= 10^4
- 0 <= lists[i].length <= 500
- Node values in [-10^4, 10^4]

## Approach

Min-Heap of size K

## Story / intuition

Think of K sorted queues racing to be the next smallest. At any point,
the global minimum must be the FRONT element of one of the K lists.
Use a Min-Heap that holds ONE node from each list.
Poll the minimum → add to result → push the NEXT node from that same list.

This way the heap always holds at most K nodes (one per list).

## Dry run

lists=[[1,4,5],[1,3,4],[2,6]]
Init heap: {1→list0, 1→list1, 2→list2}
Pop 1 (list0): result=[1], push 4(list0) → heap:{1,2,4}
Pop 1 (list1): result=[1,1], push 3(list1) → heap:{2,3,4}
Pop 2 (list2): result=[1,1,2], push 6(list2) → heap:{3,4,6}
Pop 3 (list1): result=[1,1,2,3], push 4(list1) → heap:{4,4,6}
Pop 4 (list0): result=[1,1,2,3,4], push 5(list0) → heap:{4,5,6}
... → [1,1,2,3,4,4,5,6] ✓

Time:  O(N log K) where N = total nodes, K = number of lists
Space: O(K) for heap
