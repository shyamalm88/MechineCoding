# Task Scheduler (LeetCode #621)

Given a list of tasks (chars 'A'-'Z') and a cooldown n, find the minimum
number of CPU intervals (including idle) needed to execute all tasks.
Same task must be separated by at least n intervals.

Example 1:
Input: tasks=["A","A","A","B","B","B"], n=2
Output: 8   → A B _ A B _ A B

Example 2:
Input: tasks=["A","A","A","B","B","B"], n=0
Output: 6   → no cooldown needed

Example 3:
Input: tasks=["A","A","A","A","B","B","B","C","C","D","D","E"], n=2
Output: 12

Constraints:
- 1 <= task.length <= 10^4
- tasks[i] is uppercase English letters
- 0 <= n <= 100
