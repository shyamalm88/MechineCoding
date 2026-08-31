# Car Fleet (LeetCode #853)

n cars travel to the same destination at `target` miles away.
position[i] and speed[i] give the starting position and speed of car i.
A car that catches up to another car ahead never passes it — they form a fleet.
Return the number of fleets that arrive at the destination.

Example 1:
Input: target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]
Output: 3
(Car at 10 takes 1hr. Car at 8 takes 1hr → same fleet. Car at 5 takes 3.5hr.
 Car at 3 takes 3hr → catches car at 5? Car at 5 arrives 3.5hr, car at 3 arrives 3hr.
 3 < 3.5, so car at 3 catches car at 5 → same fleet. Car at 0 takes 12hr. → 3 fleets)

Example 2:
Input: target=10, position=[3], speed=[3]
Output: 1

Constraints:
- 1 <= n <= 10^5
- 0 < target <= 10^6
- 0 <= position[i] < target
- All positions are unique

## Approach

Sort by position (desc) + Monotonic Stack of arrival times

## Story / intuition

Sort cars by starting position in DESCENDING order (closest to target first).
For each car, compute time to reach target = (target - position) / speed.

A car behind can only SLOW DOWN to match the car ahead — it CANNOT speed up.
So if a car's arrival time <= the car ahead's time, it catches up and joins
that fleet (we ignore it — it's absorbed).

The stack tracks fleet leaders' arrival times (monotonically increasing from
closest to farthest). Each push = new fleet. If current time <= stack top,
this car merges into the leading fleet (no push).

DRY RUN (target=12, sorted by pos: [(10,2),(8,4),(5,1),(3,3),(0,1)]):
times: [1.0, 1.0, 3.5, 3.0, 12.0]

t=1.0:  stack=[] → push 1.0  → [1.0]       (car at 10, fleet 1)
t=1.0:  1.0 <= 1.0 → merge   → [1.0]       (car at 8 joins fleet 1)
t=3.5:  3.5 > 1.0  → push    → [1.0, 3.5]  (car at 5, fleet 2)
t=3.0:  3.0 <= 3.5 → merge   → [1.0, 3.5]  (car at 3 joins fleet 2)
t=12.0: 12.0 > 3.5 → push    → [1.0,3.5,12](car at 0, fleet 3)
Result: stack.length = 3 ✓

Time:  O(N log N) for sort
Space: O(N) for stack
