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

## Approach

Max-Heap + Cooldown Queue (Simulation)

## Story / intuition

At each CPU cycle, greedily pick the task with the HIGHEST remaining frequency
(so the most "urgent" task goes first, minimizing total idle time).

But a just-executed task must COOL DOWN for n cycles before it can run again.
Use a QUEUE to track tasks in cooldown: [remainingCount, readyAt_time].

Each cycle:
1. Pop max-freq task from heap → execute → decrement count.
2. If count > 0, push to cooldown queue with readyAt = time + n + 1.
3. If cooldown queue front is ready (readyAt <= time), push back to heap.
4. If heap is empty (no ready task), CPU idles (time still advances).

## Dry run

tasks=[A,A,A,B,B,B], n=2
Freq: A=3, B=3. Heap: [3,3]
t=1: run A(3→2). queue=[(2, t=4)]. heap=[3]. result=1
t=2: run B(3→2). queue=[(2,4),(2,5)]. heap=[]. result=2
t=3: heap empty, IDLE. Check queue: (2,4) not ready. result=3
t=4: (2,4) ready → push A back. run A(2→1). queue=[(2,5),(1,7)]. heap=[2→B]. result=4
t=5: (2,5) ready → push B back. run B(2→1). queue=[(1,7),(1,8)]. heap=[]. result=5
t=6: IDLE. result=6
t=7: A ready. run A(1→0). queue=[(1,8)]. result=7
t=8: B ready. run B(1→0). queue=[]. result=8
Answer: 8 ✓

Time:  O(N log 26) = O(N) since at most 26 distinct tasks
Space: O(26) = O(1)
